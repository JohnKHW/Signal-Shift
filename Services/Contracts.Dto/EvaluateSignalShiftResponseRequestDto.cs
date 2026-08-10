using Contracts.Domain.Enums;

namespace Contracts.Dto
{
    public class EvaluateSignalShiftResponseRequestDto
    {
        public string ScenarioId { get; set; } = string.Empty;

        // Kept for wire compatibility with older clients. The manager deliberately ignores this value
        // and derives correctness from the authored scenario identified by ScenarioId.
        public SignalShiftSignalType ClassifiedSignalType { get; set; }

        public string ResponseOptionId { get; set; } = string.Empty;
    }
}
