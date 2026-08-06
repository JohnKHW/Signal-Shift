using App.ServiceInvoker.Interfaces;
using Contracts.Domain.Enums;
using Contracts.Dto;

namespace App.Api.Managers
{
    public class SignalShiftManager : IManagerService
    {
        private const string SuddenPlanChangeScenarioId = "sudden-plan-change";

        public Task<SignalShiftSessionDto> GetSession(GetSignalShiftSessionRequestDto request)
        {
            var mode = request.Mode;
            var scenario = BuildScenario();

            return Task.FromResult(new SignalShiftSessionDto
            {
                Mode = mode,
                Title = mode == SignalShiftEntryMode.Demo ? "直接試玩 Demo" : "開始學習",
                Subtitle = "Classify → Confirm → Respond",
                IntroText = mode == SignalShiftEntryMode.Demo
                    ? "你會直接進入一個代表性情境。先看線索，分辨訊號，再選擇一個回應。"
                    : "這次先用一個情境練習核心步驟：先分類，再確認，最後回應。",
                EndPromptTitle = mode == SignalShiftEntryMode.Demo ? "你已經完成 Demo" : "你已完成今次練習",
                EndPromptText = mode == SignalShiftEntryMode.Demo
                    ? "你剛剛完成一次完整流程：先按證據分類，再用確認問題弄清楚下一步。準備好時，可以返回主頁開始完整學習。"
                    : "你已經完成第一個核心流程。之後的學習版會用同一套方法，帶你逐步練習更多職場訊號。",
                ContinueLabel = mode == SignalShiftEntryMode.Demo ? "返回首頁" : "返回首頁",
                SignalCatalog = BuildSignalCatalog(),
                Scenario = scenario
            });
        }

        public Task<SignalShiftClassificationResultDto> EvaluateClassification(EvaluateSignalShiftClassificationRequestDto request)
        {
            var scenario = BuildScenario();
            EnsureScenario(request.ScenarioId, scenario.ScenarioId);

            return Task.FromResult(new SignalShiftClassificationResultDto
            {
                ScenarioId = scenario.ScenarioId,
                SelectedSignalType = request.SelectedSignalType,
                CorrectSignalType = SignalShiftSignalType.DetourSign,
                IsCorrect = request.SelectedSignalType == SignalShiftSignalType.DetourSign,
                RevealTitle = "最佳分類：改道標誌",
                RevealCoaching = "這一刻的重點不是猜測對方是否不滿，而是看見計劃突然改變。最有用的下一步，是確認現在哪項工作優先、何時交付，以及原本安排是否暫停。",
                FollowUpPrompt = "現在選擇一個回應。留意哪個選項最能幫你確認新目標，同時保持冷靜。",
                ResponseOptions = BuildResponseOptions()
            });
        }

        public Task<SignalShiftResponseResultDto> EvaluateResponse(EvaluateSignalShiftResponseRequestDto request)
        {
            var scenario = BuildScenario();
            EnsureScenario(request.ScenarioId, scenario.ScenarioId);

            if (request.ClassifiedSignalType != SignalShiftSignalType.DetourSign)
            {
                throw new InvalidOperationException("Response evaluation requires the scenario to be classified first using the revealed signal.");
            }

            var result = request.ResponseOptionId switch
            {
                "confirm-priority" => new SignalShiftResponseResultDto
                {
                    ScenarioId = scenario.ScenarioId,
                    ResponseOptionId = "confirm-priority",
                    ResponseLabel = "較佳回應",
                    ResponseText = "明白，我而家先改做簡報。想確認一下：原本份報告係暫停住，定係今日稍後再交？",
                    FeedbackTitle = "你先確認新安排，令下一步更清晰。",
                    FeedbackCoaching = "這個回應先接住改動，再問清楚優先次序和原本任務如何處理，最能減少誤會。它保護到你的清晰度和主動性，也有助維持合作。",
                    RelationshipImpact = CreateImpact("關係", SignalShiftImpactLevel.SmallRise, "關係稍為改善"),
                    StressImpact = CreateImpact("壓力", SignalShiftImpactLevel.SmallDrop, "壓力稍為下降"),
                    PerformanceImpact = CreateImpact("工作進度", SignalShiftImpactLevel.ClearRise, "工作進度明顯改善")
                },
                "accept-without-checking" => new SignalShiftResponseResultDto
                {
                    ScenarioId = scenario.ScenarioId,
                    ResponseOptionId = "accept-without-checking",
                    ResponseLabel = "可接受回應",
                    ResponseText = "好，我而家轉去改簡報。",
                    FeedbackTitle = "你有跟到指示，但仍然欠少少確認。",
                    FeedbackCoaching = "你即時配合，關係通常不會受損。不過你未問清楚報告是否延後，以及簡報何時交付，之後仍然可能出現混亂。",
                    RelationshipImpact = CreateImpact("關係", SignalShiftImpactLevel.SmallRise, "關係稍為改善"),
                    StressImpact = CreateImpact("壓力", SignalShiftImpactLevel.SmallRise, "壓力稍為上升"),
                    PerformanceImpact = CreateImpact("工作進度", SignalShiftImpactLevel.SmallRise, "工作進度稍為改善")
                },
                "push-back" => new SignalShiftResponseResultDto
                {
                    ScenarioId = scenario.ScenarioId,
                    ResponseOptionId = "push-back",
                    ResponseLabel = "有風險回應",
                    ResponseText = "你成日都臨時先改，我都唔知點做先啱。",
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

        private static SignalShiftScenarioDto BuildScenario()
        {
            return new SignalShiftScenarioDto
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
