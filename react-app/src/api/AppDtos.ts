import { SampleEnum, SignalShiftEntryMode, SignalShiftImpactLevel, SignalShiftSignalType } from "./Enums";

export interface ChangePasswordRequestDto {
  NewPassword: string;
}

export interface EvaluateSignalShiftClassificationRequestDto {
  ScenarioId: string;
  SelectedSignalType: SignalShiftSignalType;
}

export interface EvaluateSignalShiftResponseRequestDto {
  ScenarioId: string;
  ClassifiedSignalType: SignalShiftSignalType;
  ResponseOptionId: string;
}

export interface GetSessionRequestDto {
}

export interface GetSignalShiftSessionRequestDto {
  Mode: SignalShiftEntryMode;
}

export interface LoginRequestDto {
  Email: string;
  Password: string;
}

export interface LoginResponseDto {
  IsSuccess: boolean;
  ErrorMessage: string | null;
  AccessToken: string | null;
  RefreshToken: string | null;
  Session: SessionDto | null;
}

export interface OperationResultDto {
  Success: boolean;
  Message: string;
}

export interface SendPasswordResetRequestDto {
  Email: string;
  RedirectUrl: string | null;
}

export interface ServiceInvocationRequestDto {
  ManagerName: string;
  MethodName: string;
  Parameters: (any | null)[] | null;
  AccessToken: string | null;
  RefreshToken: string | null;
}

export interface ServiceInvocationResponseEnvelopeDto {
  Result: any | null;
  AccessToken: string | null;
  RefreshToken: string | null;
  Session: SessionDto | null;
}

export interface ServiceStreamingRequestDto {
  ManagerName: string;
  MethodName: string;
  Parameters: (any | null)[] | null;
  AccessToken: string | null;
  RefreshToken: string | null;
}

export interface SessionDto {
  UserId: string | null;
  Email: string | null;
  Roles: string[];
}

export interface SignalShiftSessionDto {
  Mode: SignalShiftEntryMode;
  Title: string;
  Subtitle: string;
  IntroText: string;
  EndPromptTitle: string;
  EndPromptText: string;
  ContinueLabel: string;
  SignalCatalog: SignalShiftSignalOptionDto[];
  Scenario: SignalShiftScenarioDto;
}

export interface SignalShiftSignalOptionDto {
  SignalType: SignalShiftSignalType;
  Label: string;
  Description: string;
  Shape: string;
  AccentToken: string;
}

export interface SignalShiftScenarioDto {
  ScenarioId: string;
  ScenarioTitle: string;
  SceneLabel: string;
  CharacterName: string;
  CharacterRole: string;
  SceneContext: string;
  Dialogue: string;
  EvidenceItems: string[];
}

export interface SignalShiftClassificationResultDto {
  ScenarioId: string;
  SelectedSignalType: SignalShiftSignalType;
  CorrectSignalType: SignalShiftSignalType;
  IsCorrect: boolean;
  RevealTitle: string;
  RevealCoaching: string;
  FollowUpPrompt: string;
  ResponseOptions: SignalShiftResponseOptionDto[];
}

export interface SignalShiftResponseOptionDto {
  ResponseOptionId: string;
  Label: string;
  ResponseText: string;
}

export interface SignalShiftResponseResultDto {
  ScenarioId: string;
  ResponseOptionId: string;
  ResponseLabel: string;
  ResponseText: string;
  FeedbackTitle: string;
  FeedbackCoaching: string;
  RelationshipImpact: SignalShiftImpactDto;
  StressImpact: SignalShiftImpactDto;
  PerformanceImpact: SignalShiftImpactDto;
}

export interface SignalShiftImpactDto {
  Label: string;
  Level: SignalShiftImpactLevel;
  Summary: string;
}

export interface SignUpRequestDto {
  Email: string;
  Password: string;
  Name: string | null;
}

export interface SignUpResponseDto {
  IsSuccess: boolean;
  ErrorMessage: string | null;
  RequiresFollowUp: boolean;
  AccessToken: string | null;
  RefreshToken: string | null;
  Session: SessionDto | null;
}

export interface StreamingAuthMetaEventDto {
  Type: string;
  AccessToken: string | null;
  RefreshToken: string | null;
  Session: SessionDto | null;
}

export interface UpdateUserEmailDto {
  NewEmail: string;
}

export interface UpdateUserEmailResponseDto {
  Success: boolean;
  Message: string;
}

export interface UpdateUserNameDto {
  NewName: string;
}

export interface UpdateUserNameResponseDto {
  Success: boolean;
  Message: string;
}

export interface UpdateUserPasswordDto {
  NewPassword: string;
}

export interface UpdateUserPasswordResponseDto {
  Success: boolean;
  Message: string;
}

