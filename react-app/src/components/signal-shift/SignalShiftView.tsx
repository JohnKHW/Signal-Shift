import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpenCheck, CheckCircle2, ChevronRight, Compass, LockKeyhole, Map as MapIcon, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import SignalShiftManager from '@/api/SignalShiftManager';
import type {
  EvaluateSignalShiftClassificationRequestDto,
  EvaluateSignalShiftResponseRequestDto,
  SignalShiftClassificationResultDto,
  SignalShiftImpactDto,
  SignalShiftResponseResultDto,
  SignalShiftSessionDto,
  SignalShiftSignalOptionDto,
  SignalShiftSummaryDto,
} from '@/api/AppDtos';
import { SignalShiftEntryMode, SignalShiftImpactLevel, SignalShiftSignalType } from '@/api/Enums';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SignalShiftPhase = 'home' | 'tutorial' | 'classify' | 'reveal' | 'respond' | 'feedback' | 'summary';

type AdventureLevel = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  unlocked: boolean;
  accent: 'sky' | 'mint' | 'amber';
};

const adventureLevels: AdventureLevel[] = [
  {
    id: 'signal-detour',
    number: '01',
    title: '改道小徑',
    subtitle: '計劃突然改變',
    description: '學識先看證據，再確認新方向。',
    unlocked: true,
    accent: 'sky',
  },
  {
    id: 'clear-the-air',
    number: '02',
    title: '澄清碼頭',
    subtitle: '把意思問清楚',
    description: '用一個好問題，為對話留出空間。',
    unlocked: false,
    accent: 'mint',
  },
  {
    id: 'steady-ground',
    number: '03',
    title: '穩陣高地',
    subtitle: '保持界線與合作',
    description: '把方法帶到更複雜的工作場景。',
    unlocked: false,
    accent: 'amber',
  },
];

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
  const [activeLevelId, setActiveLevelId] = useState('signal-detour');
  const [completedLevelIds, setCompletedLevelIds] = useState<string[]>([]);
  const [sessionRunId, setSessionRunId] = useState(0);
  const [session, setSession] = useState<SignalShiftSessionDto | null>(null);
  const [classification, setClassification] = useState<SignalShiftClassificationResultDto | null>(null);
  const [responseResult, setResponseResult] = useState<SignalShiftResponseResultDto | null>(null);
  const [summary, setSummary] = useState<SignalShiftSummaryDto | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<SignalShiftSignalType | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signalMap = useMemo(() => {
    return new Map(session?.SignalCatalog.map((signal) => [signal.SignalType, signal]) ?? []);
  }, [session]);
  const activeLevelIndex = adventureLevels.findIndex((level) => level.id === activeLevelId);
  const nextAdventureLevel = adventureLevels[activeLevelIndex + 1] ?? null;

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
      setSummary(null);
      setSelectedSignal(null);
      setTutorialStep(0);

      try {
        const loadedSession = await SignalShiftManager.GetSession({ Mode: mode, LevelId: activeLevelId });
        if (cancelled) {
          return;
        }

        setSession(loadedSession);
        setPhase(loadedSession.RequiresTutorial && loadedSession.TutorialSteps.length > 0 ? 'tutorial' : 'classify');
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
  }, [activeLevelId, mode, sessionRunId]);

  const startMode = (nextMode: SignalShiftEntryMode, nextLevelId = activeLevelId) => {
    setActiveLevelId(nextLevelId);
    setSession(null);
    setClassification(null);
    setResponseResult(null);
    setSummary(null);
    setSelectedSignal(null);
    setTutorialStep(0);
    setError(null);
    setLoading(true);
    setMode(nextMode);
    setSessionRunId((currentRunId) => currentRunId + 1);
  };

  const startLevel = (levelId: string) => {
    const levelIndex = adventureLevels.findIndex((level) => level.id === levelId);
    const isUnlocked = levelIndex === 0 || completedLevelIds.includes(adventureLevels[levelIndex - 1].id);
    if (!isUnlocked) {
      return;
    }

    startMode(SignalShiftEntryMode.Learning, levelId);
  };

  const restartSession = () => {
    if (mode !== null) {
      startMode(mode);
    }
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
    setSummary(null);
    setSelectedSignal(null);
    setTutorialStep(0);
    setError(null);
    setLoading(false);
    setPhase('home');
    onReturnHome?.();
  };

  const goToResponses = () => setPhase('respond');

  const goToSummary = async () => {
    if (!session || selectedSignal === null || !responseResult) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await SignalShiftManager.GetSummary({
        ScenarioId: session.Scenario.ScenarioId,
        SelectedSignalType: selectedSignal,
        ResponseOptionId: responseResult.ResponseOptionId,
      });
      setSummary(result);
      setPhase('summary');
    } catch (summaryError: any) {
      setError(summaryError?.message ?? '未能載入總結，請再試一次。');
    } finally {
      setLoading(false);
    }
  };

  const advanceTutorial = () => {
    if (!session) {
      return;
    }

    if (tutorialStep < session.TutorialSteps.length - 1) {
      setTutorialStep((currentStep) => currentStep + 1);
      return;
    }

    setPhase('classify');
  };

  const continueFromSummary = () => {
    if (summary?.IsTransferSuccessful && mode === SignalShiftEntryMode.Learning) {
      setCompletedLevelIds((current) => current.includes(activeLevelId) ? current : [...current, activeLevelId]);

      if (nextAdventureLevel) {
        startMode(SignalShiftEntryMode.Learning, nextAdventureLevel.id);
        return;
      }
    }

    returnHome();
  };

  if (phase === 'home') {
    return (
      <main className="signal-shift-shell signal-adventure-shell min-h-screen px-5 py-6 text-foreground sm:px-8 lg:px-10">
        <section className="mx-auto max-w-6xl">
          <div className="adventure-topbar">
            <div className="flex items-center gap-3">
              <div className="adventure-mark"><Compass className="size-5" /></div>
              <div>
                <p className="adventure-eyebrow">Signal Shift</p>
                <p className="adventure-topbar-title">職場訊號探險</p>
              </div>
            </div>
            <div className="adventure-stats" aria-label="學習進度">
              <span><Sparkles className="size-4" /> 1 個方法</span>
              <span><Trophy className="size-4" /> {completedLevelIds.length} 關完成</span>
            </div>
          </div>

          <div className="adventure-hero mt-8">
            <div className="max-w-xl">
              <p className="adventure-eyebrow">你的學習世界 · 第 1 季</p>
              <h1 className="adventure-title mt-3">沿住訊號小徑，<span>自由選擇下一站。</span></h1>
              <p className="adventure-copy mt-5">每一關都是一個短短的職場場景。你可以從已開放的路線開始，完成後再解鎖更遠的地方。</p>
              <div className="mt-6 flex flex-wrap gap-3">
                  <Button size="lg" className="adventure-primary-button" onClick={() => startLevel('signal-detour')}>
                  <BookOpenCheck className="size-5" /> 開始學習
                </Button>
                <Button size="lg" variant="outline" className="adventure-secondary-button" onClick={() => startMode(SignalShiftEntryMode.Demo, 'signal-detour')}>
                  直接試玩 Demo <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
            <div className="adventure-hero-art" aria-hidden="true">
              <div className="adventure-art-glow" />
              <img src={homeBackgroundPath} alt="" />
              <div className="adventure-art-badge"><MapIcon className="size-4" /> 你的世界地圖</div>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <p className="adventure-eyebrow">探索路線</p>
              <h2 className="adventure-section-title mt-2">由第一個訊號開始</h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-6 text-[color:var(--signal-ink-soft)] sm:block">每一個節點都會練習同一套核心方法：分類 → 確認 → 回應。</p>
          </div>

          <div className="adventure-map mt-5">
            <div className="adventure-map-sky" />
            <div className="adventure-map-ridge adventure-map-ridge-back" />
            <div className="adventure-map-ridge adventure-map-ridge-front" />
            <div className="adventure-map-path" aria-hidden="true" />
            <div className="adventure-map-nodes">
              {adventureLevels.map((level, index) => {
                const isUnlocked = index === 0 || completedLevelIds.includes(adventureLevels[index - 1].id);
                return <AdventureLevelNode key={level.id} level={{ ...level, unlocked: isUnlocked }} onSelect={() => startLevel(level.id)} />;
              })}
            </div>
            <div className="adventure-map-caption"><span className="adventure-caption-dot" /> 完成上一關，下一關就會亮起</div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[color:var(--signal-map-border)] bg-white/60 px-4 py-3 text-sm text-[color:var(--signal-ink-soft)] shadow-sm">
            <img src={playerAvatarPath} alt="" className="size-10 rounded-xl bg-[color:var(--signal-sky-bg)] object-cover" />
            <p><span className="font-semibold text-[color:var(--signal-ink)]">小提示：</span>你不需要一次走完整張地圖，今日行一小步就已經算前進。</p>
          </div>
        </section>
      </main>
    );
  }

  if (!session) {
    return <LoadingState onReturnHome={returnHome} error={error} />;
  }

  const correctSignalOption = classification ? signalMap.get(classification.CorrectSignalType) ?? null : null;
  const characterAvatarPath = session.Scenario.CharacterRole === '主管' ? bossAvatarPath : colleagueAvatarPath;
  const conversationBeats = [
    {
      id: 'context',
      speaker: '你',
      role: '先看到情境',
      text: session.Scenario.SceneContext,
      imagePath: playerAvatarPath,
      tone: 'player',
    },
    {
      id: 'dialogue',
      speaker: session.Scenario.CharacterName,
      role: session.Scenario.CharacterRole,
      text: session.Scenario.Dialogue,
      imagePath: characterAvatarPath,
      tone: 'character',
    },
    {
      id: 'clue',
      speaker: '場景提示',
      role: '留意下一步',
      text: session.Scenario.EvidenceItems[2] ?? session.Scenario.EvidenceItems[0] ?? '',
      imagePath: null,
      tone: 'clue',
    },
  ] as const;

  return (
    <main className={cn('signal-shift-shell game-screen min-h-screen px-6 py-8 text-foreground sm:px-8 lg:px-10', `game-screen-${phase}`)}>
      <section key={phase} className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <button type="button" className="inline-flex items-center gap-2 text-[color:var(--signal-navy)] transition hover:opacity-75" onClick={returnHome}>
            <ArrowLeft className="size-4" />
            返回首頁
          </button>
          <span>第 {session.LevelNumber} 關 · {session.Title}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="game-panel scene-card border-white/60 bg-card/95 shadow-[0_20px_60px_rgba(34,42,74,0.08)]">
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

                <div className="p-6">
                  <ConversationFlow beats={conversationBeats} />
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
            {phase === 'tutorial' && session.TutorialSteps[tutorialStep] && (
              <Card className="tutorial-card border-white/60 bg-card/95 shadow-[0_20px_60px_rgba(34,42,74,0.08)]">
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-[color:var(--signal-navy)]">
                      <span className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--signal-sky-bg)]"><BookOpenCheck className="size-5" /></span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--signal-navy)]/60">新手教學</p>
                        <p className="text-sm font-medium">出發前先學會三步</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{tutorialStep + 1} / {session.TutorialSteps.length}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="tutorial-progress" aria-hidden="true">
                      {session.TutorialSteps.map((step, index) => <span key={step.StepNumber} className={cn(index <= tutorialStep && 'tutorial-progress-active')} />)}
                    </div>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--signal-sky-fg)]">第 {session.TutorialSteps[tutorialStep].StepNumber} 步</p>
                    <h3 className="text-2xl font-semibold text-[color:var(--signal-navy)]">{session.TutorialSteps[tutorialStep].Title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{session.TutorialSteps[tutorialStep].Body}</p>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--signal-sky-border)] bg-[color:var(--signal-sky-bg)]/70 px-4 py-3 text-sm leading-6 text-[color:var(--signal-navy)]">
                    完成教學後，分類按鈕才會開放。你可以放心慢慢看線索。
                  </div>

                  <Button className="w-full bg-[color:var(--signal-navy)] text-white hover:bg-[color:var(--signal-navy)]/90" onClick={advanceTutorial}>
                    {tutorialStep === session.TutorialSteps.length - 1 ? '開始第一關' : '下一步'} <ChevronRight className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

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
                            'signal-choice flex items-start gap-4 rounded-2xl border px-4 py-4 text-left transition disabled:cursor-default',
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
                        className="response-choice rounded-2xl border border-border bg-background px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--signal-sky-border)] hover:shadow-sm"
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

            {phase === 'summary' && summary && (
              <Card className="border-white/60 bg-card/95 shadow-[0_20px_60px_rgba(34,42,74,0.08)]">
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[color:var(--signal-navy)]/70">完成</p>
                    <h3 className="text-xl font-semibold text-[color:var(--signal-navy)]">{session.EndPromptTitle}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{session.EndPromptText}</p>
                  </div>

                  <div className={cn('summary-result', summary.IsTransferSuccessful ? 'summary-result-success' : 'summary-result-retry')}>
                    <div className="flex items-start gap-3">
                      <span className="summary-result-icon">{summary.IsTransferSuccessful ? <Trophy className="size-5" /> : <RotateCcw className="size-5" />}</span>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em]">{summary.IsClassificationCorrect ? '訊號分析' : '再看一次證據'}</p>
                        <h4 className="text-lg font-semibold">{summary.TransferTitle}</h4>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6">{summary.TransferCoaching}</p>
                  </div>

                  <div className="summary-analysis grid gap-3 sm:grid-cols-2">
                    <div><span>你的分類</span><strong>{summary.SelectedSignalLabel}</strong></div>
                    <div><span>最佳分類</span><strong>{summary.CorrectSignalLabel}</strong></div>
                    <div className="sm:col-span-2"><span>你的回應</span><strong>{summary.ResponseLabel}</strong></div>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--signal-map-border)] bg-white/60 px-4 py-3 text-sm leading-6 text-[color:var(--signal-ink-soft)]">
                    <p className="font-semibold text-[color:var(--signal-ink)]">轉移成功規則</p>
                    <p className="mt-1">{summary.TransferRule}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-[color:var(--signal-navy)] text-white hover:bg-[color:var(--signal-navy)]/90" onClick={restartSession}>
                      <RotateCcw className="size-4" /> 再玩一次
                    </Button>
                    <Button variant="outline" className="border-[color:var(--signal-sky-border)] bg-white/70 text-[color:var(--signal-navy)] hover:bg-[color:var(--signal-sky-bg)]" onClick={continueFromSummary}>
                      {summary.IsTransferSuccessful && mode === SignalShiftEntryMode.Learning && adventureLevels[adventureLevels.findIndex((level) => level.id === activeLevelId) + 1] ? '前往下一關' : session.ContinueLabel}
                    </Button>
                  </div>
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

const AdventureLevelNode = ({ level, onSelect }: { level: AdventureLevel; onSelect: () => void }) => {
  return (
    <button
      type="button"
      className={cn('adventure-level-node', `adventure-level-node-${level.accent}`, !level.unlocked && 'adventure-level-node-locked')}
      onClick={onSelect}
      disabled={!level.unlocked}
      aria-label={level.unlocked ? `開始第 ${level.number} 關：${level.title}` : `${level.title} 尚未解鎖`}
    >
      <span className="adventure-level-node-shadow" aria-hidden="true" />
      <span className="adventure-level-node-face">
        <span className="adventure-level-number">{level.number}</span>
        {level.unlocked ? <Compass className="adventure-level-icon" /> : <LockKeyhole className="adventure-level-icon" />}
      </span>
      <span className="adventure-level-copy">
        <strong>{level.title}</strong>
        <span>{level.subtitle}</span>
        <small>{level.description}</small>
      </span>
    </button>
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

type ConversationBeat = {
  id: string;
  speaker: string;
  role: string;
  text: string;
  imagePath: string | null;
  tone: 'player' | 'character' | 'clue';
};

const ConversationFlow = ({ beats }: { beats: readonly ConversationBeat[] }) => {
  return (
    <div className="conversation-flow">
      <div className="conversation-flow-heading">
        <div>
          <p className="conversation-flow-kicker">CURRENT FLOW</p>
          <p className="mt-1 text-sm font-semibold text-[color:var(--signal-navy)]">對話正在一層層靠近你的判斷</p>
        </div>
        <div className="conversation-flow-steps" aria-hidden="true">
          <span>01 看見</span>
          <span>02 聽見</span>
          <span>03 留意</span>
        </div>
      </div>

      <div className="conversation-stage" role="log" aria-live="polite" aria-label="情境對話流程">
        <div className="conversation-stage-halo" aria-hidden="true" />
        <div className="conversation-stage-path" aria-hidden="true" />
        <div className="conversation-beats">
          {beats.map((beat, index) => (
            <article key={beat.id} className={cn('conversation-beat', `conversation-beat-${beat.tone}`)}>
              <div className="conversation-beat-avatar">
                {beat.imagePath ? (
                  <img src={beat.imagePath} alt="" aria-hidden="true" />
                ) : (
                  <span className="conversation-clue-mark" aria-hidden="true"><Sparkles className="size-5" /></span>
                )}
              </div>
              <div className="conversation-bubble">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="conversation-bubble-speaker">{beat.speaker}</p>
                    <p className="conversation-bubble-role">{beat.role}</p>
                  </div>
                  <span className="conversation-bubble-step">0{index + 1}</span>
                </div>
                <p className="conversation-bubble-text">{beat.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="conversation-stage-status"><span className="conversation-stage-status-dot" /> 等你選擇訊號，將這段流動變成下一步</div>
      </div>
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
