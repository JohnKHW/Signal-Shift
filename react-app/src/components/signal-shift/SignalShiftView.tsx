import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import SignalShiftManager from '@/api/SignalShiftManager';
import type {
  EvaluateSignalShiftClassificationRequestDto,
  EvaluateSignalShiftResponseRequestDto,
  SignalShiftClassificationResultDto,
  SignalShiftImpactDto,
  SignalShiftResponseResultDto,
  SignalShiftSessionDto,
  SignalShiftSignalOptionDto,
} from '@/api/AppDtos';
import { SignalShiftEntryMode, SignalShiftImpactLevel, SignalShiftSignalType } from '@/api/Enums';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SignalShiftPhase = 'home' | 'classify' | 'reveal' | 'respond' | 'feedback' | 'summary';

const signalAssetPaths: Record<SignalShiftSignalType, string> = {
  [SignalShiftSignalType.GreenLight]: '/img/signal-shift/signal-green-light.svg',
  [SignalShiftSignalType.YellowLight]: '/img/signal-shift/signal-yellow-light.svg',
  [SignalShiftSignalType.RedLight]: '/img/signal-shift/signal-red-light.svg',
  [SignalShiftSignalType.DetourSign]: '/img/signal-shift/signal-detour-sign.svg',
  [SignalShiftSignalType.JokeSign]: '/img/signal-shift/signal-joke-sign.svg',
};

const homeBackgroundPath = '/img/signal-shift/home-background.svg';
const scenarioBackgroundPath = '/img/signal-shift/meeting-room-scene.svg';
const playerAvatarPath = '/img/signal-shift/avatar-player.svg';
const colleagueAvatarPath = '/img/signal-shift/avatar-colleague.svg';
const bossAvatarPath = '/img/signal-shift/avatar-boss.svg';

const accentClassNames: Record<string, string> = {
  mint: 'border-[color:var(--signal-mint-border)] bg-[color:var(--signal-mint-bg)] text-[color:var(--signal-mint-fg)]',
  amber: 'border-[color:var(--signal-amber-border)] bg-[color:var(--signal-amber-bg)] text-[color:var(--signal-amber-fg)]',
  coral: 'border-[color:var(--signal-coral-border)] bg-[color:var(--signal-coral-bg)] text-[color:var(--signal-coral-fg)]',
  sky: 'border-[color:var(--signal-sky-border)] bg-[color:var(--signal-sky-bg)] text-[color:var(--signal-sky-fg)]',
  plum: 'border-[color:var(--signal-plum-border)] bg-[color:var(--signal-plum-bg)] text-[color:var(--signal-plum-fg)]',
};

const impactToneClassNames: Record<SignalShiftImpactLevel, string> = {
  [SignalShiftImpactLevel.None]: 'border-border bg-card text-foreground',
  [SignalShiftImpactLevel.SmallRise]: 'border-[color:var(--signal-mint-border)] bg-[color:var(--signal-mint-bg)] text-[color:var(--signal-mint-fg)]',
  [SignalShiftImpactLevel.ClearRise]: 'border-[color:var(--signal-sky-border)] bg-[color:var(--signal-sky-bg)] text-[color:var(--signal-sky-fg)]',
  [SignalShiftImpactLevel.SmallDrop]: 'border-[color:var(--signal-amber-border)] bg-[color:var(--signal-amber-bg)] text-[color:var(--signal-amber-fg)]',
  [SignalShiftImpactLevel.ClearDrop]: 'border-[color:var(--signal-coral-border)] bg-[color:var(--signal-coral-bg)] text-[color:var(--signal-coral-fg)]',
};

interface SignalShiftViewProps {
  onReturnHome?: () => void;
}

const SignalShiftView = ({ onReturnHome }: SignalShiftViewProps) => {
  const [phase, setPhase] = useState<SignalShiftPhase>('home');
  const [mode, setMode] = useState<SignalShiftEntryMode | null>(null);
  const [session, setSession] = useState<SignalShiftSessionDto | null>(null);
  const [classification, setClassification] = useState<SignalShiftClassificationResultDto | null>(null);
  const [responseResult, setResponseResult] = useState<SignalShiftResponseResultDto | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<SignalShiftSignalType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signalMap = useMemo(() => {
    return new Map(session?.SignalCatalog.map((signal) => [signal.SignalType, signal]) ?? []);
  }, [session]);

  useEffect(() => {
    if (mode === null) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setClassification(null);
      setResponseResult(null);
      setSelectedSignal(null);

      try {
        const loadedSession = await SignalShiftManager.GetSession({ Mode: mode });
        if (cancelled) {
          return;
        }

        setSession(loadedSession);
        setPhase('classify');
      } catch (loadError: any) {
        if (!cancelled) {
          setError(loadError?.message ?? '未能載入情境，請再試一次。');
          setPhase('home');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const startMode = (nextMode: SignalShiftEntryMode) => {
    setMode(nextMode);
  };

  const handleSelectSignal = async (signalType: SignalShiftSignalType) => {
    if (!session) {
      return;
    }

    setSelectedSignal(signalType);
    setLoading(true);
    setError(null);

    const request: EvaluateSignalShiftClassificationRequestDto = {
      ScenarioId: session.Scenario.ScenarioId,
      SelectedSignalType: signalType,
    };

    try {
      const result = await SignalShiftManager.EvaluateClassification(request);
      setClassification(result);
      setPhase('reveal');
    } catch (classificationError: any) {
      setError(classificationError?.message ?? '未能評估分類，請再試一次。');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResponse = async (responseOptionId: string) => {
    if (!session) {
      return;
    }

    setLoading(true);
    setError(null);

    const request: EvaluateSignalShiftResponseRequestDto = {
      ScenarioId: session.Scenario.ScenarioId,
      ClassifiedSignalType: classification?.CorrectSignalType ?? SignalShiftSignalType.DetourSign,
      ResponseOptionId: responseOptionId,
    };

    try {
      const result = await SignalShiftManager.EvaluateResponse(request);
      setResponseResult(result);
      setPhase('feedback');
    } catch (responseError: any) {
      setError(responseError?.message ?? '未能載入回應結果，請再試一次。');
    } finally {
      setLoading(false);
    }
  };

  const returnHome = () => {
    setMode(null);
    setSession(null);
    setClassification(null);
    setResponseResult(null);
    setSelectedSignal(null);
    setError(null);
    setLoading(false);
    setPhase('home');
    onReturnHome?.();
  };

  const goToResponses = () => setPhase('respond');
  const goToSummary = () => setPhase('summary');

  if (phase === 'home') {
    return (
      <main className="signal-shift-shell min-h-screen px-6 py-10 text-foreground sm:px-8 lg:px-10">
        <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
          <Card className="w-full overflow-hidden border-white/50 bg-card/95 shadow-[0_20px_60px_rgba(34,42,74,0.12)]">
            <CardContent className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:p-14">
              <div className="space-y-6 lg:pr-4">
                <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-sm lg:hidden">
                  <img src={homeBackgroundPath} alt="Signal Shift calm workplace illustration" className="h-52 w-full object-cover" />
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--signal-navy)]/70">Signal Shift</p>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--signal-navy)] sm:text-5xl">將職場訊號分清楚，一步一步回應。</h1>
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                    這個練習會用一個短情境，帶你試一次核心方法：先按證據分類，再確認意思，最後選擇一個可行回應。
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="min-w-36 bg-[color:var(--signal-navy)] text-white hover:bg-[color:var(--signal-navy)]/90" onClick={() => startMode(SignalShiftEntryMode.Learning)}>
                    開始學習
                  </Button>
                  <Button size="lg" variant="outline" className="min-w-36 border-[color:var(--signal-sky-border)] bg-white/70 text-[color:var(--signal-navy)] hover:bg-[color:var(--signal-sky-bg)]" onClick={() => startMode(SignalShiftEntryMode.Demo)}>
                    直接試玩 Demo
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/60 bg-[linear-gradient(180deg,rgba(233,243,251,0.95),rgba(255,251,244,0.95))]">
                <img src={homeBackgroundPath} alt="Calm workplace illustration with soft colors" className="hidden h-56 w-full object-cover lg:block" />
                <div className="space-y-4 p-6">
                  <p className="text-sm font-medium text-[color:var(--signal-navy)]">核心步驟</p>
                  <ol className="space-y-3 text-sm leading-6 text-[color:var(--signal-navy)]/80"><li><span className="font-semibold text-[color:var(--signal-navy)]">1. 分類</span>：先看見到甚麼線索。</li><li><span className="font-semibold text-[color:var(--signal-navy)]">2. 確認</span>：問清楚下一步要做甚麼。</li><li><span className="font-semibold text-[color:var(--signal-navy)]">3. 回應</span>：選擇一個安全、清楚、做得到的做法。</li></ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  if (!session) {
    return <LoadingState onReturnHome={returnHome} error={error} />;
  }

  const selectedSignalOption = selectedSignal ? signalMap.get(selectedSignal) ?? null : null;
  const correctSignalOption = classification ? signalMap.get(classification.CorrectSignalType) ?? null : null;

  return (
    <main className="signal-shift-shell min-h-screen px-6 py-8 text-foreground sm:px-8 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <button type="button" className="inline-flex items-center gap-2 text-[color:var(--signal-navy)] transition hover:opacity-75" onClick={returnHome}>
            <ArrowLeft className="size-4" />
            返回首頁
          </button>
          <span>{session.Title}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/60 bg-card/95 shadow-[0_20px_60px_rgba(34,42,74,0.08)]">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--signal-navy)]/65">{session.Subtitle}</p>
                <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--signal-navy)]">{session.Scenario.ScenarioTitle}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{session.IntroText}</p>
              </div>

              <div className="overflow-hidden rounded-3xl border border-[color:var(--signal-sky-border)]/70 bg-[linear-gradient(180deg,rgba(232,243,250,0.9),rgba(255,251,244,0.95))]">
                <div className="relative border-b border-white/70 bg-white/50">
                  <img src={scenarioBackgroundPath} alt={session.Scenario.SceneLabel} className="h-60 w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(34,42,74,0.68)] to-transparent px-6 pb-5 pt-10 text-white">
                    <p className="text-sm font-medium">{session.Scenario.SceneLabel}</p>
                    <p className="mt-1 text-sm text-white/85">{session.Scenario.CharacterRole} · {session.Scenario.CharacterName}</p>
                  </div>
                </div>

                <div className="grid gap-5 p-6 md:grid-cols-[0.75fr_1.25fr] md:items-start">
                  <div className="space-y-4">
                    <CharacterCard
                      imagePath={playerAvatarPath}
                      name="你"
                      role="玩家"
                      accentClassName="bg-[color:var(--signal-sky-bg)]"
                    />
                    <CharacterCard
                      imagePath={colleagueAvatarPath}
                      name={session.Scenario.CharacterName}
                      role={session.Scenario.CharacterRole}
                      accentClassName="bg-[color:var(--signal-mint-bg)]"
                    />
                    <CharacterCard
                      imagePath={bossAvatarPath}
                      name="阿姐"
                      role="主管"
                      accentClassName="bg-[color:var(--signal-amber-bg)]"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/70 bg-white/82 px-4 py-3 text-sm text-[color:var(--signal-navy)] shadow-sm">
                      <p className="font-medium">人物位置</p>
                      <p className="mt-2 leading-6 text-[color:var(--signal-navy)]/80">你正在準備交報告；同事阿琪帶來主管的新安排，要求你先改做簡報。</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[color:var(--signal-navy)]">情境</p>
                      <p className="mt-2 text-base leading-7 text-[color:var(--signal-navy)]/85">{session.Scenario.SceneContext}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[color:var(--signal-navy)]">對話</p>
                      <p className="mt-2 rounded-2xl bg-white/80 px-4 py-4 text-base leading-7 text-[color:var(--signal-navy)] shadow-sm">{session.Scenario.Dialogue}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[color:var(--signal-navy)]">你目前見到的線索</h3>
                <ul className="space-y-3">
                  {session.Scenario.EvidenceItems.map((item) => (
                    <li key={item} className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm leading-6 text-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {(phase === 'classify' || phase === 'reveal') && (
              <Card className="border-white/60 bg-card/95 shadow-[0_20px_60px_rgba(34,42,74,0.08)]">
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[color:var(--signal-navy)]">{phase === 'classify' ? '先選擇一個訊號分類' : classification?.RevealTitle}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {phase === 'classify'
                        ? '答案現在未公開。請按目前證據，選擇最能代表下一步要怎樣做的分類。'
                        : classification?.RevealCoaching}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {session.SignalCatalog.map((signal) => {
                      const isSelected = selectedSignal === signal.SignalType;
                      const isCorrect = classification?.CorrectSignalType === signal.SignalType;

                      return (
                        <button
                          key={signal.SignalType}
                          type="button"
                          disabled={loading || phase === 'reveal'}
                          onClick={() => handleSelectSignal(signal.SignalType)}
                          className={cn(
                            'flex items-start gap-4 rounded-2xl border px-4 py-4 text-left transition disabled:cursor-default',
                            accentClassNames[signal.AccentToken],
                            isSelected && 'ring-2 ring-[color:var(--signal-navy)]/40',
                            phase === 'classify' && 'hover:-translate-y-0.5 hover:shadow-sm',
                            phase === 'reveal' && !isCorrect && 'opacity-70',
                          )}
                        >
                          <SignalGlyph signal={signal} />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{signal.Label}</span>
                              {isCorrect && <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium">最佳答案</span>}
                            </div>
                            <p className="text-sm leading-6 opacity-85">{signal.Description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {phase === 'reveal' && classification && correctSignalOption && (
                    <div className="space-y-4 rounded-2xl border border-[color:var(--signal-sky-border)] bg-[color:var(--signal-sky-bg)] px-4 py-4 text-[color:var(--signal-navy)]">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5" />
                        <div className="space-y-2">
                          <p className="font-medium">今次最佳分類是「{correctSignalOption.Label}」</p>
                          <p className="text-sm leading-6">{classification.FollowUpPrompt}</p>
                        </div>
                      </div>
                      <Button className="bg-[color:var(--signal-navy)] text-white hover:bg-[color:var(--signal-navy)]/90" onClick={goToResponses}>
                        繼續選擇回應
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {phase === 'respond' && classification && (
              <Card className="border-white/60 bg-card/95 shadow-[0_20px_60px_rgba(34,42,74,0.08)]">
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[color:var(--signal-navy)]">選擇一個回應</h3>
                    <p className="text-sm leading-6 text-muted-foreground">情境已經顯示最佳分類。現在請選擇一個你會講出口的回應。</p>
                  </div>

                  <div className="grid gap-3">
                    {classification.ResponseOptions.map((option) => (
                      <button
                        key={option.ResponseOptionId}
                        type="button"
                        disabled={loading}
                        onClick={() => handleSelectResponse(option.ResponseOptionId)}
                        className="rounded-2xl border border-border bg-background px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--signal-sky-border)] hover:shadow-sm"
                      >
                        <div className="space-y-2">
                          <span className="inline-flex size-7 items-center justify-center rounded-full bg-[color:var(--signal-sky-bg)] text-sm font-semibold text-[color:var(--signal-navy)]">{option.Label}</span>
                          <p className="text-sm leading-6 text-foreground">{option.ResponseText}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {phase === 'feedback' && responseResult && (
              <Card className="border-white/60 bg-card/95 shadow-[0_20px_60px_rgba(34,42,74,0.08)]">
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[color:var(--signal-navy)]/70">{responseResult.ResponseLabel}</p>
                    <h3 className="text-xl font-semibold text-[color:var(--signal-navy)]">{responseResult.FeedbackTitle}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{responseResult.FeedbackCoaching}</p>
                  </div>

                  <div className="space-y-3">
                    <ImpactPill impact={responseResult.RelationshipImpact} />
                    <ImpactPill impact={responseResult.StressImpact} />
                    <ImpactPill impact={responseResult.PerformanceImpact} />
                  </div>

                  <div className="rounded-2xl border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground">
                    <p className="font-medium text-[color:var(--signal-navy)]">你選擇了：</p>
                    <p className="mt-2">{responseResult.ResponseText}</p>
                  </div>

                  <Button className="bg-[color:var(--signal-navy)] text-white hover:bg-[color:var(--signal-navy)]/90" onClick={goToSummary}>
                    查看總結
                  </Button>
                </CardContent>
              </Card>
            )}

            {phase === 'summary' && (
              <Card className="border-white/60 bg-card/95 shadow-[0_20px_60px_rgba(34,42,74,0.08)]">
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[color:var(--signal-navy)]/70">完成</p>
                    <h3 className="text-xl font-semibold text-[color:var(--signal-navy)]">{session.EndPromptTitle}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{session.EndPromptText}</p>
                  </div>

                  {selectedSignalOption && (
                    <div className="rounded-2xl border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground">
                      <p><span className="font-medium text-[color:var(--signal-navy)]">你分類為：</span>{selectedSignalOption.Label}</p>
                      {responseResult && <p className="mt-2"><span className="font-medium text-[color:var(--signal-navy)]">你最後選擇了：</span>{responseResult.ResponseLabel}</p>}
                    </div>
                  )}

                  <Button className="bg-[color:var(--signal-navy)] text-white hover:bg-[color:var(--signal-navy)]/90" onClick={returnHome}>
                    {session.ContinueLabel}
                  </Button>
                </CardContent>
              </Card>
            )}

            {loading && (
              <Card className="border-white/60 bg-card/95">
                <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
                  <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-[color:var(--signal-navy)]" />
                  載入中…
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="border-[color:var(--signal-coral-border)] bg-[color:var(--signal-coral-bg)] text-[color:var(--signal-coral-fg)]">
                <CardContent className="space-y-3 p-4">
                  <p className="text-sm leading-6">{error}</p>
                  <Button variant="outline" className="border-current bg-transparent text-current hover:bg-white/40" onClick={returnHome}>
                    返回首頁
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

const LoadingState = ({ error, onReturnHome }: { error: string | null; onReturnHome: () => void }) => {
  return (
    <main className="signal-shift-shell flex min-h-screen items-center justify-center px-6 py-10">
      <Card className="w-full max-w-md border-white/60 bg-card/95">
        <CardContent className="space-y-4 p-6 text-center">
          {error ? (
            <>
              <p className="text-sm leading-6 text-[color:var(--signal-coral-fg)]">{error}</p>
              <Button onClick={onReturnHome}>返回首頁</Button>
            </>
          ) : (
            <>
              <div className="mx-auto size-8 animate-spin rounded-full border-2 border-muted border-t-[color:var(--signal-navy)]" />
              <p className="text-sm text-muted-foreground">載入中…</p>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

const SignalGlyph = ({ signal }: { signal: SignalShiftSignalOptionDto }) => {
  return (
    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-sm">
      <img src={signalAssetPaths[signal.SignalType]} alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
    </span>
  );
};

const CharacterCard = ({ imagePath, name, role, accentClassName }: { imagePath: string; name: string; role: string; accentClassName: string }) => {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/72 p-4 text-center shadow-sm">
      <div className={cn('rounded-3xl p-2', accentClassName)}>
        <img src={imagePath} alt={name} className="mx-auto h-32 w-32 rounded-3xl object-cover sm:h-36 sm:w-36" />
      </div>
      <p className="mt-4 text-sm font-medium text-[color:var(--signal-navy)]">{name}</p>
      <p className="mt-1 text-xs text-[color:var(--signal-navy)]/70">{role}</p>
    </div>
  );
};

const ImpactPill = ({ impact }: { impact: SignalShiftImpactDto }) => {
  return (
    <div className={cn('rounded-2xl border px-4 py-3 text-sm', impactToneClassNames[impact.Level])}>
      <p className="font-medium">{impact.Label}</p>
      <p className="mt-1 leading-6">{impact.Summary}</p>
    </div>
  );
};

export default SignalShiftView;
