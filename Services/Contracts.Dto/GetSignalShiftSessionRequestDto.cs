using Contracts.Domain.Enums;

namespace Contracts.Dto
{
    public class GetSignalShiftSessionRequestDto
    {
        public SignalShiftEntryMode Mode { get; set; }

        public string LevelId { get; set; } = "signal-detour";
    }
}
