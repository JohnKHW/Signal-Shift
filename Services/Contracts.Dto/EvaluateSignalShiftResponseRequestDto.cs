using Contracts.Domain.Enums;

namespace Contracts.Dto
{
    public class EvaluateSignalShiftResponseRequestDto
    {
        public string ScenarioId { get; set; } = string.Empty;

        public SignalShiftSignalType ClassifiedSignalType { get; set; }

        public string ResponseOptionId { get; set; } = string.Empty;
    }
}
