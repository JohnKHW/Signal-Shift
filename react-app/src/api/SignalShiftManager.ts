import { GetSignalShiftSessionRequestDto, SignalShiftSessionDto, EvaluateSignalShiftClassificationRequestDto, SignalShiftClassificationResultDto, EvaluateSignalShiftResponseRequestDto, SignalShiftResponseResultDto, GetSignalShiftSummaryRequestDto, SignalShiftSummaryDto } from "./AppDtos";
import ApiClient, { ApiClientRequestOptions } from "./ApiClient";

const GetSession = (request: GetSignalShiftSessionRequestDto, options?: ApiClientRequestOptions): Promise<SignalShiftSessionDto> =>
  ApiClient.invokeMethod<SignalShiftSessionDto>("Api", "SignalShiftManager", "GetSession", request, options);

const EvaluateClassification = (request: EvaluateSignalShiftClassificationRequestDto, options?: ApiClientRequestOptions): Promise<SignalShiftClassificationResultDto> =>
  ApiClient.invokeMethod<SignalShiftClassificationResultDto>("Api", "SignalShiftManager", "EvaluateClassification", request, options);

const EvaluateResponse = (request: EvaluateSignalShiftResponseRequestDto, options?: ApiClientRequestOptions): Promise<SignalShiftResponseResultDto> =>
  ApiClient.invokeMethod<SignalShiftResponseResultDto>("Api", "SignalShiftManager", "EvaluateResponse", request, options);

const GetSummary = (request: GetSignalShiftSummaryRequestDto, options?: ApiClientRequestOptions): Promise<SignalShiftSummaryDto> =>
  ApiClient.invokeMethod<SignalShiftSummaryDto>("Api", "SignalShiftManager", "GetSummary", request, options);

export default {
  GetSession,
  EvaluateClassification,
  EvaluateResponse,
  GetSummary
};
