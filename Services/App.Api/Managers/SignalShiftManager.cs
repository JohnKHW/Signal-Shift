using App.ServiceInvoker.Interfaces;
using Contracts.Domain.Enums;
using Contracts.Dto;

namespace App.Api.Managers
{
    public class SignalShiftManager : IManagerService
    {
        private const string SuddenPlanChangeScenarioId = "sudden-plan-change";
        private const string SignalDetourLevelId = "signal-detour";
        private const string ClearTheAirLevelId = "clear-the-air";
        private const string UnclearBriefScenarioId = "unclear-brief";
        private const string SteadyGroundLevelId = "steady-ground";
        private const string BoundaryPressureScenarioId = "boundary-pressure";

        public Task<SignalShiftSessionDto> GetSession(GetSignalShiftSessionRequestDto request)
        {
            var mode = request.Mode;
            var levelId = string.IsNullOrWhiteSpace(request.LevelId) ? SignalDetourLevelId : request.LevelId;
            var authoredScenario = BuildScenario(levelId);

            return Task.FromResult(new SignalShiftSessionDto
            {
                Mode = mode,
                LevelId = levelId,
                LevelNumber = GetLevelNumber(levelId),
                RequiresTutorial = mode == SignalShiftEntryMode.Learning,
                Title = mode == SignalShiftEntryMode.Demo ? "直接試玩 Demo" : "開始學習",
                Subtitle = "Classify → Confirm → Respond",
                IntroText = mode == SignalShiftEntryMode.Demo
                    ? "你會直接進入一個代表性情境。先看線索，分辨訊號，再選擇一個回應。"
                    : "這次先用一個情境練習核心步驟：先分類，再確認，最後回應。",
                EndPromptTitle = mode == SignalShiftEntryMode.Demo ? "你已經完成 Demo" : "你已完成今次練習",
                EndPromptText = mode == SignalShiftEntryMode.Demo
                    ? "你剛剛完成一次完整流程：先按證據分類，再用確認問題弄清楚下一步。準備好時，可以返回主頁開始完整學習。"
                    : "你已經完成第一個核心流程。之後的學習版會用同一套方法，帶你逐步練習更多職場訊號。",
                ContinueLabel = "返回世界地圖",
                TutorialSteps = mode == SignalShiftEntryMode.Learning ? BuildTutorialSteps() : new List<SignalShiftTutorialStepDto>(),
                SignalCatalog = BuildSignalCatalog(),
                Scenario = authoredScenario.Scenario
            });
        }

        public Task<SignalShiftClassificationResultDto> EvaluateClassification(EvaluateSignalShiftClassificationRequestDto request)
        {
            var authoredScenario = BuildScenarioForScenarioId(request.ScenarioId);
            EnsureScenario(request.ScenarioId, authoredScenario.Scenario.ScenarioId);
            var correctSignal = BuildSignalCatalog().Single(signal => signal.SignalType == authoredScenario.CorrectSignalType);

            return Task.FromResult(new SignalShiftClassificationResultDto
            {
                ScenarioId = authoredScenario.Scenario.ScenarioId,
                SelectedSignalType = request.SelectedSignalType,
                CorrectSignalType = authoredScenario.CorrectSignalType,
                IsCorrect = request.SelectedSignalType == authoredScenario.CorrectSignalType,
                RevealTitle = $"最佳分類：{correctSignal.Label}",
                RevealCoaching = authoredScenario.RevealCoaching,
                FollowUpPrompt = authoredScenario.FollowUpPrompt,
                ResponseOptions = authoredScenario.ResponseOptions
            });
        }

        public Task<SignalShiftResponseResultDto> EvaluateResponse(EvaluateSignalShiftResponseRequestDto request)
        {
            var authoredScenario = BuildScenarioForScenarioId(request.ScenarioId);
            EnsureScenario(request.ScenarioId, authoredScenario.Scenario.ScenarioId);
            var responseOption = authoredScenario.ResponseOptions.SingleOrDefault(option => option.ResponseOptionId == request.ResponseOptionId)
                ?? throw new InvalidOperationException("Unknown response option.");

            var result = request.ResponseOptionId switch
            {
                "confirm-priority" => new SignalShiftResponseResultDto
                {
                    ScenarioId = authoredScenario.Scenario.ScenarioId,
                    ResponseOptionId = "confirm-priority",
                    ResponseLabel = "較佳回應",
                    ResponseText = responseOption.ResponseText,
                    FeedbackTitle = "你先確認新安排，令下一步更清晰。",
                    FeedbackCoaching = "這個回應先接住改動，再問清楚優先次序和原本任務如何處理，最能減少誤會。它保護到你的清晰度和主動性，也有助維持合作。",
                    RelationshipImpact = CreateImpact("關係", SignalShiftImpactLevel.SmallRise, "關係稍為改善"),
                    StressImpact = CreateImpact("壓力", SignalShiftImpactLevel.SmallDrop, "壓力稍為下降"),
                    PerformanceImpact = CreateImpact("工作進度", SignalShiftImpactLevel.ClearRise, "工作進度明顯改善")
                },
                "accept-without-checking" => new SignalShiftResponseResultDto
                {
                    ScenarioId = authoredScenario.Scenario.ScenarioId,
                    ResponseOptionId = "accept-without-checking",
                    ResponseLabel = "可接受回應",
                    ResponseText = responseOption.ResponseText,
                    FeedbackTitle = "你有跟到指示，但仍然欠少少確認。",
                    FeedbackCoaching = "你即時配合，關係通常不會受損。不過你未問清楚報告是否延後，以及簡報何時交付，之後仍然可能出現混亂。",
                    RelationshipImpact = CreateImpact("關係", SignalShiftImpactLevel.SmallRise, "關係稍為改善"),
                    StressImpact = CreateImpact("壓力", SignalShiftImpactLevel.SmallRise, "壓力稍為上升"),
                    PerformanceImpact = CreateImpact("工作進度", SignalShiftImpactLevel.SmallRise, "工作進度稍為改善")
                },
                "push-back" => new SignalShiftResponseResultDto
                {
                    ScenarioId = authoredScenario.Scenario.ScenarioId,
                    ResponseOptionId = "push-back",
                    ResponseLabel = "有風險回應",
                    ResponseText = responseOption.ResponseText,
                    FeedbackTitle = "你表達到壓力，但情況更容易升溫。",
                    FeedbackCoaching = "這句說話將焦點由確認新安排，變成當場反擊。你真實感到混亂是可以理解的，但這個說法未幫到你取得清晰指示，也較容易令合作氣氛變差。",
                    RelationshipImpact = CreateImpact("關係", SignalShiftImpactLevel.ClearDrop, "關係明顯下降"),
                    StressImpact = CreateImpact("壓力", SignalShiftImpactLevel.ClearRise, "壓力明顯上升"),
                    PerformanceImpact = CreateImpact("工作進度", SignalShiftImpactLevel.SmallDrop, "工作進度稍為下降")
                },
                _ => throw new InvalidOperationException("Unknown response option.")
            };

            return Task.FromResult(result);
        }

        public Task<SignalShiftSummaryDto> GetSummary(GetSignalShiftSummaryRequestDto request)
        {
            var authoredScenario = BuildScenarioForScenarioId(request.ScenarioId);
            EnsureScenario(request.ScenarioId, authoredScenario.Scenario.ScenarioId);

            var selectedSignal = BuildSignalCatalog().SingleOrDefault(signal => signal.SignalType == request.SelectedSignalType);
            if (selectedSignal is null)
            {
                throw new InvalidOperationException("Unknown signal type.");
            }

            var responseOption = authoredScenario.ResponseOptions.SingleOrDefault(option => option.ResponseOptionId == request.ResponseOptionId);
            if (responseOption is null)
            {
                throw new InvalidOperationException("Unknown response option.");
            }

            var correctSignal = BuildSignalCatalog().Single(signal => signal.SignalType == authoredScenario.CorrectSignalType);
            var isClassificationCorrect = request.SelectedSignalType == authoredScenario.CorrectSignalType;
            var isTransferSuccessful = isClassificationCorrect && request.ResponseOptionId == authoredScenario.TransferSuccessResponseOptionId;

            return Task.FromResult(new SignalShiftSummaryDto
            {
                ScenarioId = authoredScenario.Scenario.ScenarioId,
                SelectedSignalType = request.SelectedSignalType,
                CorrectSignalType = authoredScenario.CorrectSignalType,
                IsClassificationCorrect = isClassificationCorrect,
                SelectedSignalLabel = selectedSignal.Label,
                CorrectSignalLabel = correctSignal.Label,
                ResponseOptionId = responseOption.ResponseOptionId,
                ResponseLabel = responseOption.Label,
                IsTransferSuccessful = isTransferSuccessful,
                TransferTitle = isTransferSuccessful ? "你成功將方法帶到下一個情境" : "方法已經起步，再校準一次",
                TransferCoaching = isTransferSuccessful
                    ? "你先辨認計劃改道，再用確認問題保留清晰度。這個步驟可以直接帶到下一個職場情境。"
                    : "轉移方法需要先辨認正確訊號，再用一個能確認下一步的回應。回到這一關再試一次，會更穩。",
                TransferRule = authoredScenario.TransferRule
            });
        }

        private static List<SignalShiftSignalOptionDto> BuildSignalCatalog()
        {
            return new List<SignalShiftSignalOptionDto>
            {
                new() { SignalType = SignalShiftSignalType.GreenLight, Label = "綠燈", Description = "指示已經夠清楚，可以直接做。", Shape = "circle", AccentToken = "mint" },
                new() { SignalType = SignalShiftSignalType.YellowLight, Label = "黃燈", Description = "意思未夠清楚，要再問或再觀察。", Shape = "rounded-square", AccentToken = "amber" },
                new() { SignalType = SignalShiftSignalType.RedLight, Label = "紅燈", Description = "先停一停，保護自己，避免升級。", Shape = "triangle", AccentToken = "coral" },
                new() { SignalType = SignalShiftSignalType.DetourSign, Label = "改道標誌", Description = "計劃突然改變，要確認新目標和先後次序。", Shape = "diamond", AccentToken = "sky" },
                new() { SignalType = SignalShiftSignalType.JokeSign, Label = "玩笑標誌", Description = "先分辨是否輕鬆玩笑，再決定怎樣回應。", Shape = "pill", AccentToken = "plum" }
            };
        }

        private static (SignalShiftScenarioDto Scenario, SignalShiftSignalType CorrectSignalType, string TransferSuccessResponseOptionId, string TransferRule, string RevealCoaching, string FollowUpPrompt, List<SignalShiftResponseOptionDto> ResponseOptions) BuildScenario(string levelId)
        {
            if (levelId == ClearTheAirLevelId)
            {
                return (
                    Scenario: new SignalShiftScenarioDto
                    {
                        ScenarioId = UnclearBriefScenarioId,
                        ScenarioTitle = "模糊要求",
                        SceneLabel = "訊息角落",
                        CharacterName = "阿琪",
                        CharacterRole = "同事",
                        SceneContext = "同事傳訊息請你幫手睇一睇簡報，但沒有講清楚要看甚麼，亦沒有說明確實期限。",
                        Dialogue = "阿琪：『你得閒幫我睇一睇份簡報？今日盡快俾我啦。』",
                        EvidenceItems = new List<string>
                        {
                            "對方提出了請求，但未講清楚要你檢查內容還是格式。",
                            "『今日盡快』不是一個具體時間，優先次序仍然不清楚。",
                            "情況重點是先問清楚目標和期限，再決定怎樣做。"
                        }
                    },
                    CorrectSignalType: SignalShiftSignalType.YellowLight,
                    TransferSuccessResponseOptionId: "confirm-priority",
                    TransferRule: "轉移成功 = 看見資訊不完整 + 用一個具體問題確認目標和期限。",
                    RevealCoaching: "這個要求未夠清楚：你知道對方想你幫手，但不知道要看甚麼、幾時要交。先問清楚，才不會一邊猜一邊做。",
                    FollowUpPrompt: "現在選擇一個回應。留意哪個選項最能幫你把目標和期限問清楚。",
                    ResponseOptions: BuildClearTheAirResponseOptions()
                );
            }

            if (levelId == SteadyGroundLevelId)
            {
                return (
                    Scenario: new SignalShiftScenarioDto
                    {
                        ScenarioId = BoundaryPressureScenarioId,
                        ScenarioTitle = "權限紅線",
                        SceneLabel = "檔案角落",
                        CharacterName = "阿姐",
                        CharacterRole = "主管",
                        SceneContext = "主管要求你把一份包含同事私人資料的內部紀錄直接轉發給客戶，但你還未確認資料是否可以對外發送。",
                        Dialogue = "阿姐：『你直接將份紀錄轉俾客戶啦，佢等緊。』",
                        EvidenceItems = new List<string>
                        {
                            "對方要求你把內部資料轉給外部人士。",
                            "資料包含同事私人內容，但沒有說明已獲得對外分享的許可。",
                            "情況重點是先停一停，確認資料權限和安全做法。"
                        }
                    },
                    CorrectSignalType: SignalShiftSignalType.RedLight,
                    TransferSuccessResponseOptionId: "confirm-priority",
                    TransferRule: "轉移成功 = 看見可能傷害 + 先停下來確認權限和安全做法。",
                    RevealCoaching: "這不只是工作優先次序，而是涉及私人資料能否對外分享。先停一停，確認權限和安全做法，才可以保護自己和其他人。",
                    FollowUpPrompt: "現在選擇一個回應。留意哪個選項能先保護資料，再把下一步問清楚。",
                    ResponseOptions: BuildSteadyGroundResponseOptions()
                );
            }

            if (levelId != SignalDetourLevelId)
            {
                throw new InvalidOperationException("Unknown level.");
            }

            return (
                Scenario: new SignalShiftScenarioDto
                {
                    ScenarioId = SuddenPlanChangeScenarioId,
                    ScenarioTitle = "突然改計劃",
                    SceneLabel = "會議室外",
                    CharacterName = "阿琪",
                    CharacterRole = "同事",
                    SceneContext = "你剛剛準備交今天要做的報告，同事突然走過來通知你，主管想你立即改做另一份簡報。",
                    Dialogue = "阿琪：『喂，而家個次序改咗喇。阿姐話你先搞份簡報，份報告晏啲先。』",
                    EvidenceItems = new List<string>
                    {
                        "原本安排好咗，但而家臨時改次序。",
                        "新指示只講咗先做邊樣，未講清楚報告係咪延後到幾時。",
                        "情況重點是確認新的優先次序，而不是猜測對方語氣。"
                    }
                },
                CorrectSignalType: SignalShiftSignalType.DetourSign,
                TransferSuccessResponseOptionId: "confirm-priority",
                TransferRule: "轉移成功 = 正確辨認訊號 + 選擇能確認新優先次序的回應。",
                RevealCoaching: "這一刻的重點不是猜測對方是否不滿，而是看見計劃突然改變。最有用的下一步，是確認現在哪項工作優先、何時交付，以及原本安排是否暫停。",
                FollowUpPrompt: "現在選擇一個回應。留意哪個選項最能幫你確認新目標，同時保持冷靜。",
                ResponseOptions: BuildResponseOptions()
            );
        }

        private static (SignalShiftScenarioDto Scenario, SignalShiftSignalType CorrectSignalType, string TransferSuccessResponseOptionId, string TransferRule, string RevealCoaching, string FollowUpPrompt, List<SignalShiftResponseOptionDto> ResponseOptions) BuildScenarioForScenarioId(string scenarioId)
        {
            return scenarioId switch
            {
                SuddenPlanChangeScenarioId => BuildScenario(SignalDetourLevelId),
                UnclearBriefScenarioId => BuildScenario(ClearTheAirLevelId),
                BoundaryPressureScenarioId => BuildScenario(SteadyGroundLevelId),
                _ => throw new InvalidOperationException("Unknown scenario.")
            };
        }

        private static int GetLevelNumber(string levelId)
        {
            return levelId switch
            {
                SignalDetourLevelId => 1,
                ClearTheAirLevelId => 2,
                SteadyGroundLevelId => 3,
                _ => throw new InvalidOperationException("Unknown level.")
            };
        }

        private static List<SignalShiftTutorialStepDto> BuildTutorialSteps()
        {
            return new List<SignalShiftTutorialStepDto>
            {
                new() { StepNumber = 1, Title = "先看訊號", Body = "閱讀場景和證據，先判斷發生了甚麼，不急著猜對方的心情。" },
                new() { StepNumber = 2, Title = "再問清楚", Body = "選擇能確認下一步的回應，把新目標、優先次序和時間問清楚。" },
                new() { StepNumber = 3, Title = "把方法帶走", Body = "完成一關後，你會看到這個方法是否能轉移到下一個職場情境。" }
            };
        }

        private static List<SignalShiftResponseOptionDto> BuildResponseOptions()
        {
            return new List<SignalShiftResponseOptionDto>
            {
                new() { ResponseOptionId = "confirm-priority", Label = "A", ResponseText = "明白，我而家先改做簡報。想確認一下：原本份報告係暫停住，定係今日稍後再交？" },
                new() { ResponseOptionId = "accept-without-checking", Label = "B", ResponseText = "好，我而家轉去改簡報。" },
                new() { ResponseOptionId = "push-back", Label = "C", ResponseText = "你成日都臨時先改，我都唔知點做先啱。" }
            };
        }

        private static List<SignalShiftResponseOptionDto> BuildClearTheAirResponseOptions()
        {
            return new List<SignalShiftResponseOptionDto>
            {
                new() { ResponseOptionId = "confirm-priority", Label = "A", ResponseText = "可以，我想先確認一下：你想我重點睇內容定係格式？最遲幾點要俾你？" },
                new() { ResponseOptionId = "accept-without-checking", Label = "B", ResponseText = "好，我今日得閒就睇。" },
                new() { ResponseOptionId = "push-back", Label = "C", ResponseText = "你自己都講唔清楚，我點幫你？" }
            };
        }

        private static List<SignalShiftResponseOptionDto> BuildSteadyGroundResponseOptions()
        {
            return new List<SignalShiftResponseOptionDto>
            {
                new() { ResponseOptionId = "confirm-priority", Label = "A", ResponseText = "我可以幫手整理公開版本，但想先確認一下：呢份資料係咪已經可以對外發送？" },
                new() { ResponseOptionId = "accept-without-checking", Label = "B", ResponseText = "好，我而家直接轉發。" },
                new() { ResponseOptionId = "push-back", Label = "C", ResponseText = "呢啲資料好私隱，你自己處理啦。" }
            };
        }

        private static SignalShiftImpactDto CreateImpact(string label, SignalShiftImpactLevel level, string summary)
        {
            return new SignalShiftImpactDto
            {
                Label = label,
                Level = level,
                Summary = summary
            };
        }

        private static void EnsureScenario(string requestScenarioId, string expectedScenarioId)
        {
            if (!string.Equals(requestScenarioId, expectedScenarioId, StringComparison.Ordinal))
            {
                throw new InvalidOperationException("Unknown scenario.");
            }
        }
    }
}
