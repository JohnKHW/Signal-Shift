using Contracts.Domain.Enums;

namespace Contracts.Dto
{
    public class EvaluateSignalShiftClassificationRequestDto
    {
        public string ScenarioId { get; set; } = string.Empty;

        public SignalShiftSignalType SelectedSignalType { get; set; }
    }
}
