using System.Threading.Tasks;
using App.Api.Managers;
using Contracts.Domain.Enums;
using Contracts.Dto;
using Xunit;

namespace App.Api.Tests;

public class SignalShiftFlowTests
{
    [Fact]
    public async Task LearningSessionRequiresTutorialWhileDemoBypassesIt()
    {
        var manager = new SignalShiftManager();

        var learning = await manager.GetSession(new GetSignalShiftSessionRequestDto { Mode = SignalShiftEntryMode.Learning });
        var demo = await manager.GetSession(new GetSignalShiftSessionRequestDto { Mode = SignalShiftEntryMode.Demo });

        Assert.True(learning.RequiresTutorial);
        Assert.NotEmpty(learning.TutorialSteps);
        Assert.False(demo.RequiresTutorial);
        Assert.Empty(demo.TutorialSteps);
    }

    [Fact]
    public async Task SecondLevelLoadsItsOwnAuthoredScenario()
    {
        var manager = new SignalShiftManager();

        var level = await manager.GetSession(new GetSignalShiftSessionRequestDto
        {
            Mode = SignalShiftEntryMode.Learning,
            LevelId = "clear-the-air"
        });

        Assert.Equal("clear-the-air", level.LevelId);
        Assert.Equal(2, level.LevelNumber);
        Assert.Equal("unclear-brief", level.Scenario.ScenarioId);
    }

    [Fact]
    public async Task ResponseEvaluationUsesAuthoredSignalInsteadOfClientSuppliedSignal()
    {
        var manager = new SignalShiftManager();

        var result = await manager.EvaluateResponse(new EvaluateSignalShiftResponseRequestDto
        {
            ScenarioId = "sudden-plan-change",
            ClassifiedSignalType = SignalShiftSignalType.GreenLight,
            ResponseOptionId = "confirm-priority"
        });

        Assert.Equal("confirm-priority", result.ResponseOptionId);
    }

    [Fact]
    public async Task SummaryDerivesCorrectSignalAndTransferRuleFromAuthoredScenario()
    {
        var manager = new SignalShiftManager();

        var summary = await manager.GetSummary(new GetSignalShiftSummaryRequestDto
        {
            ScenarioId = "sudden-plan-change",
            SelectedSignalType = SignalShiftSignalType.DetourSign,
            ResponseOptionId = "confirm-priority"
        });

        Assert.Equal(SignalShiftSignalType.DetourSign, summary.CorrectSignalType);
        Assert.True(summary.IsClassificationCorrect);
        Assert.True(summary.IsTransferSuccessful);
    }

    [Fact]
    public async Task SummaryDoesNotReportTransferSuccessWhenClassificationIsWrong()
    {
        var manager = new SignalShiftManager();

        var summary = await manager.GetSummary(new GetSignalShiftSummaryRequestDto
        {
            ScenarioId = "sudden-plan-change",
            SelectedSignalType = SignalShiftSignalType.GreenLight,
            ResponseOptionId = "confirm-priority"
        });

        Assert.False(summary.IsClassificationCorrect);
        Assert.False(summary.IsTransferSuccessful);
        Assert.Equal("改道標誌", summary.CorrectSignalLabel);
    }
}
