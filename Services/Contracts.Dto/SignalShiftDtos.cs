using Contracts.Domain.Enums;

namespace Contracts.Dto
{
    public class SignalShiftSessionDto
    {
        public SignalShiftEntryMode Mode { get; set; }

        public string LevelId { get; set; } = string.Empty;

        public int LevelNumber { get; set; }

        public bool RequiresTutorial { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Subtitle { get; set; } = string.Empty;

        public string IntroText { get; set; } = string.Empty;

        public string EndPromptTitle { get; set; } = string.Empty;

        public string EndPromptText { get; set; } = string.Empty;

        public string ContinueLabel { get; set; } = string.Empty;

        public List<SignalShiftTutorialStepDto> TutorialSteps { get; set; } = new();

        public List<SignalShiftSignalOptionDto> SignalCatalog { get; set; } = new();

        public SignalShiftScenarioDto Scenario { get; set; } = new();
    }

    public class SignalShiftTutorialStepDto
    {
        public int StepNumber { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Body { get; set; } = string.Empty;
    }

    public class SignalShiftSignalOptionDto
    {
        public SignalShiftSignalType SignalType { get; set; }

        public string Label { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Shape { get; set; } = string.Empty;

        public string AccentToken { get; set; } = string.Empty;
    }

    public class SignalShiftScenarioDto
    {
        public string ScenarioId { get; set; } = string.Empty;

        public string ScenarioTitle { get; set; } = string.Empty;

        public string SceneLabel { get; set; } = string.Empty;

        public string CharacterName { get; set; } = string.Empty;

        public string CharacterRole { get; set; } = string.Empty;

        public string SceneContext { get; set; } = string.Empty;

        public string Dialogue { get; set; } = string.Empty;

        public List<string> EvidenceItems { get; set; } = new();
    }

    public class SignalShiftClassificationResultDto
    {
        public string ScenarioId { get; set; } = string.Empty;

        public SignalShiftSignalType SelectedSignalType { get; set; }

        public SignalShiftSignalType CorrectSignalType { get; set; }

        public bool IsCorrect { get; set; }

        public string RevealTitle { get; set; } = string.Empty;

        public string RevealCoaching { get; set; } = string.Empty;

        public string FollowUpPrompt { get; set; } = string.Empty;

        public List<SignalShiftResponseOptionDto> ResponseOptions { get; set; } = new();
    }

    public class SignalShiftResponseOptionDto
    {
        public string ResponseOptionId { get; set; } = string.Empty;

        public string Label { get; set; } = string.Empty;

        public string ResponseText { get; set; } = string.Empty;
    }

    public class SignalShiftResponseResultDto
    {
        public string ScenarioId { get; set; } = string.Empty;

        public string ResponseOptionId { get; set; } = string.Empty;

        public string ResponseLabel { get; set; } = string.Empty;

        public string ResponseText { get; set; } = string.Empty;

        public string FeedbackTitle { get; set; } = string.Empty;

        public string FeedbackCoaching { get; set; } = string.Empty;

        public SignalShiftImpactDto RelationshipImpact { get; set; } = new();

        public SignalShiftImpactDto StressImpact { get; set; } = new();

        public SignalShiftImpactDto PerformanceImpact { get; set; } = new();
    }

    public class SignalShiftImpactDto
    {
        public string Label { get; set; } = string.Empty;

        public SignalShiftImpactLevel Level { get; set; }

        public string Summary { get; set; } = string.Empty;
    }

    public class GetSignalShiftSummaryRequestDto
    {
        public string ScenarioId { get; set; } = string.Empty;

        public SignalShiftSignalType SelectedSignalType { get; set; }

        public string ResponseOptionId { get; set; } = string.Empty;
    }

    public class SignalShiftSummaryDto
    {
        public string ScenarioId { get; set; } = string.Empty;

        public SignalShiftSignalType SelectedSignalType { get; set; }

        public SignalShiftSignalType CorrectSignalType { get; set; }

        public bool IsClassificationCorrect { get; set; }

        public string SelectedSignalLabel { get; set; } = string.Empty;

        public string CorrectSignalLabel { get; set; } = string.Empty;

        public string ResponseOptionId { get; set; } = string.Empty;

        public string ResponseLabel { get; set; } = string.Empty;

        public bool IsTransferSuccessful { get; set; }

        public string TransferTitle { get; set; } = string.Empty;

        public string TransferCoaching { get; set; } = string.Empty;

        public string TransferRule { get; set; } = string.Empty;
    }
}
