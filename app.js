const SIGNALS = {
  green: {
    label: 'Green Light',
    chinese: '綠燈',
    symbol: '↗',
    shape: 'circle',
    tone: 'green',
    short: '清晰指示',
    meaning: '對方已說明要做的事情，可以直接執行。',
  },
  yellow: {
    label: 'Yellow Light',
    chinese: '黃燈',
    symbol: '!',
    shape: 'circle',
    tone: 'yellow',
    short: '模糊訊號',
    meaning: '對方未說明細節，需要先追問或觀察。',
  },
  red: {
    label: 'Red Light',
    chinese: '紅燈',
    symbol: '—',
    shape: 'octagon',
    tone: 'red',
    short: '警告或衝突風險',
    meaning: '先暫停、降低衝突，必要時尋求支援。',
  },
  detour: {
    label: 'Detour Sign',
    chinese: '改道標誌',
    symbol: '↝',
    shape: 'diamond',
    tone: 'detour',
    short: '計劃突然改變',
    meaning: '先確認新目標，再詢問優先次序及截止日期。',
  },
  joke: {
    label: 'Joke Sign',
    chinese: '玩笑標誌',
    symbol: '✦',
    shape: 'bubble',
    tone: 'joke',
    short: '低風險幽默',
    meaning: '可以輕鬆回應，但不需要忍受令人不安的說話。',
  },
};

const SIGNAL_ORDER = ['green', 'yellow', 'red', 'detour', 'joke'];

const TUTORIAL_STEPS = [
  {
    id: 'tutorial-green',
    eyebrow: '第一個訊號',
    title: '先認識綠燈',
    scene: '辦公室入口',
    context: '你剛剛到達工作地點。主管已經說明今天的第一步。',
    dialogue: '「早晨！今日先整理呢一疊文件，完成後放喺我張枱。」',
    evidence: ['動作已經說明', '下一步清楚', '不需要猜測未說出口的意思'],
    signal: 'green',
    teaching: '綠燈 = 清晰指示。對方已說明要做的事情，可以直接執行。',
  },
  {
    id: 'tutorial-yellow',
    eyebrow: '第二個訊號',
    title: '留意黃燈',
    scene: '工作站',
    context: '你完成了手上的任務，主管看過你的工作。',
    dialogue: '「整體唔錯，不過仲可以再好少少。」',
    evidence: ['有正面評語', '沒有指出哪一部分', '下一步仍然不完整'],
    signal: 'yellow',
    teaching: '黃燈 = 模糊訊號。對方未說明細節，需要先追問或觀察。',
  },
  {
    id: 'tutorial-red',
    eyebrow: '第三個訊號',
    title: '紅燈叫你先停一停',
    scene: '會議室外',
    context: '對方的說話令你感到不安全。你可以先離開現場。',
    dialogue: '「你唔好咁敏感啦，大家都係咁講㗎。」',
    evidence: ['你的不舒服被輕視', '對方沒有確認你的界線', '先保護自己比立即解釋更重要'],
    signal: 'red',
    teaching: '紅燈 = 警告或衝突風險。先暫停、降低衝突，必要時尋求支援。',
  },
  {
    id: 'tutorial-detour',
    eyebrow: '第四個訊號',
    title: '計劃改變就是改道',
    scene: '會議桌',
    context: '原本的工作方向突然改變。新的細節稍後才會提供。',
    dialogue: '「等陣先，個方向要轉一轉。」',
    evidence: ['原本計劃被改變', '新的目標還未完整', '需要確認接下來怎樣走'],
    signal: 'detour',
    teaching: '改道標誌 = 計劃突然改變。先確認新目標，再詢問優先次序及截止日期。',
  },
  {
    id: 'tutorial-joke',
    eyebrow: '第五個訊號',
    title: '玩笑也要看界線',
    scene: '茶水間',
    context: '同事面帶笑容，說話沒有針對你的身份、弱點或已表達的界線。',
    dialogue: '「今日咁早食飯，係咪偷偷哋提早收工呀？」',
    evidence: ['語氣輕鬆', '說話不是字面指控', '沒有造成明顯不舒服'],
    signal: 'joke',
    teaching: '玩笑標誌 = 低風險、非字面意思的幽默。可以輕鬆回應，但不需要忍受令人不安的說話。',
  },
];

const WORKPLACE_SCENARIOS = [
  {
    id: 'boss-feedback',
    level: 2,
    eyebrow: 'LEVEL 02 · 模糊要求',
    title: '老闆的回饋',
    scene: '辦公室 · 14:10',
    sceneType: 'boss',
    setup: '你啱啱交咗一份報告，老闆行過嚟。',
    dialogue: '「再睇下，有啲地方可以更好。」',
    dialogueSpeaker: 'Boss / 老闆',
    evidence: ['回饋是模糊的', '沒有指出哪一部分要改', '對方沒有說明優先次序'],
    signal: 'yellow',
    classificationCoaching: '這是黃燈：你知道需要留意，但還不知道哪一個改動最重要。先把模糊要求變成具體問題。',
    responses: [
      {
        label: '「好呀，請問你想我優先調整邊一部分？」',
        tier: 'preferred',
        tierLabel: '最直接',
        impact: { relationship: 'improved', stress: 'down', performance: 'improved' },
        coaching: '你先確認優先次序，將模糊要求變成下一步行動。',
      },
      {
        label: '「我先整理現有內容，之後再同你確認最需要改善嘅部分，可以嗎？」',
        tier: 'acceptable',
        tierLabel: '可行選擇',
        impact: { relationship: 'steady', stress: 'downSmall', performance: 'improved' },
        coaching: '這個方向合理；如果即時確認重點，會更容易避免改錯。',
      },
      {
        label: '「我已經好認真做㗎喇，究竟邊度唔好？」',
        tier: 'harmful',
        tierLabel: '可能令情況變差',
        impact: { relationship: 'worse', stress: 'up', performance: 'affected' },
        coaching: '這個回應令對方需要先處理防衛情緒，未能幫助你取得具體要求。',
      },
    ],
  },
  {
    id: 'colleague-joke',
    level: 3,
    eyebrow: 'LEVEL 03 · 低風險玩笑',
    title: '同事的玩笑',
    scene: '工作站 · 17:35',
    sceneType: 'colleague',
    setup: '下晝較晏，你仲喺度工作。同事笑住行過。',
    dialogue: '「你又加班啊，係咪想搶我個位？」',
    dialogueSpeaker: 'Colleague / 同事',
    dialogueNote: '帶笑 · 沒有重複針對你',
    evidence: ['這個情境的說話不是字面意思', '對方語氣輕鬆', '沒有重複針對你的弱點或界線'],
    signal: 'joke',
    classificationCoaching: '這是玩笑標誌：目前沒有越過界線的證據。你可以輕鬆回應，也可以保持簡短和中性。',
    boundary: '如果說話針對身份或弱點、令人明顯不舒服、重複發生，或者對方在你表達界線後仍然繼續，就不再是玩笑，而是紅燈。',
    responses: [
      {
        label: '「哈哈，我只係想早啲做完，聽日可以輕鬆啲啫。」',
        tier: 'preferred',
        tierLabel: '最直接',
        impact: { relationship: 'improved', stress: 'down', performance: 'steady' },
        coaching: '你留意到這是低風險玩笑，並用輕鬆方式回應，保持氣氛自然。',
      },
      {
        label: '「哈哈，我先完成手頭份工作先。」',
        tier: 'acceptable',
        tierLabel: '可行選擇',
        impact: { relationship: 'steady', stress: 'steady', performance: 'steady' },
        coaching: '簡短、中性的回應也可以；你沒有將玩笑當成字面指控。',
      },
      {
        label: '「我先冇諗過搶你個位！你點解咁講？」',
        tier: 'harmful',
        tierLabel: '可能令情況變差',
        impact: { relationship: 'worse', stress: 'up', performance: 'affected' },
        coaching: '過度認真或防衛性回應，可能令低風險玩笑升級成衝突。',
      },
    ],
  },
  {
    id: 'plan-change',
    level: 4,
    eyebrow: 'LEVEL 04 · 方向改變',
    title: '會議中途轉向',
    scene: '會議室 · 15:20',
    sceneType: 'change',
    setup: '會議中途，你已經為方向 A 準備好資料。',
    dialogue: '「呢個方向先放低，我哋改做另一個。」',
    dialogueSpeaker: 'Boss / 老闆',
    evidence: ['目前的計劃被明確改變', '新的目標還未說清楚', '優先次序和截止日期仍然未知'],
    signal: 'detour',
    supportingCue: 'Supporting cue · 新細節未完整，因此同時有一點黃燈。',
    classificationCoaching: '這是改道標誌：最重要的下一步不是捍衛舊計劃，而是確認新方向怎樣落地。',
    responses: [
      {
        label: '「明白，咁新目標係乜嘢？另外優先次序同截止日期有冇更新？」',
        tier: 'preferred',
        tierLabel: '最直接',
        impact: { relationship: 'improved', stress: 'down', performance: 'improved' },
        coaching: '你先確認新目標，再釐清優先次序及時間，將改道變成可執行的計劃。',
      },
      {
        label: '「明白，我先停低方向 A；可唔可以之後將新要求發畀我？」',
        tier: 'acceptable',
        tierLabel: '可行選擇',
        impact: { relationship: 'steady', stress: 'downSmall', performance: 'improved' },
        coaching: '你接受了改變，亦保留了跟進確認的空間；如果即場問清截止日期，會更穩妥。',
      },
      {
        label: '「但我已經為呢個方向準備咗好多資料……」',
        tier: 'harmful',
        tierLabel: '可能令情況變差',
        impact: { relationship: 'affected', stress: 'up', performance: 'affected' },
        coaching: '表達已投入的時間是可以理解的，但如果先抗拒改變，容易錯過確認新方向的機會。',
      },
    ],
  },
];

const TRANSFER_SCENARIO = {
  id: 'transfer-red-boundary',
  level: 'TRANSFER CHECK',
  eyebrow: 'TRANSFER CHECK · 未見過的情境',
  title: '界線被再次越過',
  scene: '開放工作區 · 11:45',
  sceneType: 'transfer',
  setup: '你之前已經同一位同事講過，不想再聽這類說話。第二日，他在其他同事面前又講：',
  dialogue: '「又開始扮專業啦？唔好咁玻璃心喎。」',
  dialogueSpeaker: 'Colleague / 同事',
  dialogueNote: '公開場合 · 在你表達界線後再次發生',
  evidence: ['說話針對個人弱點', '在公開場合重複發生', '對方以「玻璃心」輕視你已表達的界線'],
  signal: 'red',
  classificationCoaching: '這是紅燈。你不需要判斷對方是否真心講笑；先保護界線、記錄事實，再尋求適當支援。',
  responses: [
    {
      label: '「我之前已經講過呢類說話令我唔舒服，請停止。如果再發生，我會記低情況，搵主管或者可信任嘅人一齊跟進。」',
      tier: 'preferred',
      tierLabel: '安全回應',
      impact: { safety: 'protected', stress: 'downMaybe', relationship: 'variable' },
      coaching: '這個情況已經越過 Joke-to-Red boundary。你不需要判斷對方是否真心講笑；先保護界線、記錄事實，再尋求適當支援。',
    },
    {
      label: '「我而家唔想繼續呢個對話，我會先離開，之後搵可信任嘅人商量。」',
      tier: 'acceptable',
      tierLabel: '安全回應',
      impact: { safety: 'protected', stress: 'downMaybe', relationship: 'variable' },
      coaching: '先離開及尋求支援是安全可行的做法。之後可以補充記錄發生的事情，以及你已經表達過的界線。',
    },
    {
      label: '「你再講一次試下，我就當眾講返你啲秘密！」',
      tier: 'harmful',
      tierLabel: '可能令情況升級',
      impact: { safety: 'notImproved', stress: 'upBig', relationship: 'worse' },
      coaching: '以威脅回應可能令情況升級，亦令後續求助更困難。你可以離開現場、記錄事實，或尋求可信任人士協助。',
    },
  ],
};

const IMPACT_LABELS = {
  relationship: '關係',
  stress: '壓力',
  performance: '表現',
  safety: '安全與自主',
};

const IMPACT_STYLES = {
  improved: { label: '改善', direction: 'up', className: 'positive' },
  down: { label: '下降', direction: 'down', className: 'positive' },
  downSmall: { label: '輕微下降', direction: 'down', className: 'positive' },
  steady: { label: '穩定', direction: 'steady', className: 'neutral' },
  affected: { label: '受影響', direction: 'down', className: 'negative' },
  worse: { label: '惡化', direction: 'down', className: 'negative' },
  up: { label: '上升', direction: 'up', className: 'negative' },
  upBig: { label: '大幅上升', direction: 'up', className: 'negative' },
  downMaybe: { label: '有機會下降', direction: 'down', className: 'positive' },
  protected: { label: '受到保護', direction: 'steady', className: 'positive' },
  notImproved: { label: '未有改善', direction: 'steady', className: 'negative' },
  variable: { label: '視乎對方反應', direction: 'steady', className: 'neutral' },
};

const app = document.querySelector('#app');

const state = {
  view: 'home',
  mode: null,
  phase: 'classify',
  currentScenario: null,
  currentIndex: 0,
  selectedSignal: null,
  selectedResponse: null,
  unlocked: [],
  recognized: [],
  confusions: {},
  transferPassed: null,
  transferClassified: false,
  meters: { relationship: 50, stress: 30, performance: 50 },
};

function resetSession(mode) {
  state.view = 'game';
  state.mode = mode;
  state.phase = 'classify';
  state.currentScenario = null;
  state.currentIndex = 0;
  state.selectedSignal = null;
  state.selectedResponse = null;
  state.unlocked = [];
  state.recognized = [];
  state.confusions = {};
  state.transferPassed = null;
  state.transferClassified = false;
  state.meters = { relationship: 50, stress: 30, performance: 50 };
  if (mode === 'demo') {
    loadScenario(WORKPLACE_SCENARIOS[2]);
  } else {
    loadTutorialStep(0);
  }
}

function loadTutorialStep(index) {
  const step = TUTORIAL_STEPS[index];
  state.currentIndex = index;
  state.currentScenario = { ...step, kind: 'tutorial' };
  state.phase = 'classify';
  state.selectedSignal = null;
  state.selectedResponse = null;
}

function loadScenario(scenario) {
  state.currentScenario = { ...scenario, kind: 'scenario' };
  state.phase = 'classify';
  state.selectedSignal = null;
  state.selectedResponse = null;
}

function loadTransfer() {
  state.currentScenario = { ...TRANSFER_SCENARIO, kind: 'transfer' };
  state.phase = 'classify';
  state.selectedSignal = null;
  state.selectedResponse = null;
  state.transferClassified = false;
}

function iconMarkup(signalId, extraClass = '') {
  const signal = SIGNALS[signalId];
  return `<span class="signal-icon signal-icon--${signal.tone} signal-icon--${signal.shape} ${extraClass}" aria-hidden="true"><span>${signal.symbol}</span></span>`;
}

function signalLabel(signalId) {
  const signal = SIGNALS[signalId];
  return `${signal.label} · ${signal.chinese}`;
}

function arrow(direction) {
  return direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderSignalButton(signalId, { locked = false, selected = false, answer = false } = {}) {
  const signal = SIGNALS[signalId];
  const isCorrect = answer && signalId === state.currentScenario?.signal;
  const isIncorrect = answer && signalId !== state.currentScenario?.signal;
  const classes = [
    'signal-choice',
    `signal-choice--${signal.tone}`,
    selected ? 'is-selected' : '',
    locked ? 'is-locked' : '',
    isCorrect ? 'is-correct' : '',
    isIncorrect ? 'is-incorrect' : '',
  ].filter(Boolean).join(' ');
  const disabled = state.phase !== 'classify' || locked;
  return `<button class="${classes}" data-signal="${signalId}" onclick="window.SignalShift?.classify('${signalId}')" ${disabled ? 'disabled' : ''} aria-pressed="${selected}" aria-label="${signal.label} · ${signal.chinese}">
    ${iconMarkup(signalId)}
    <span class="signal-choice__text"><strong>${signal.label}</strong><small>${signal.chinese} · ${signal.short}</small></span>
    <span class="signal-choice__mark">${isCorrect ? '✓' : isIncorrect ? '·' : locked ? '?' : ''}</span>
  </button>`;
}

function metersMarkup() {
  const meterCopy = [
    ['relationship', '關係', 'R'],
    ['stress', '壓力', 'S'],
    ['performance', '表現', 'P'],
  ];
  return `<div class="meters" aria-label="情境影響">
    <div class="meters__head"><span>情境影響</span><small>只描述目前情況</small></div>
    <div class="meter-list">
      ${meterCopy.map(([key, label, initial]) => `<div class="meter-row">
        <div class="meter-row__label"><span class="meter-initial meter-initial--${key}">${initial}</span><span>${label}</span></div>
        <div class="meter-track" aria-hidden="true"><span style="width:${state.meters[key]}%"></span></div>
        <span class="meter-value">${state.meters[key] >= 66 ? '穩步' : state.meters[key] <= 34 ? '緊張' : '平衡'}</span>
      </div>`).join('')}
    </div>
  </div>`;
}

function headerMarkup({ game = false } = {}) {
  if (!game) {
    return `<header class="topbar topbar--home">
      <button class="brand" data-action="home" aria-label="返回 Signal Shift 首頁"><span class="brand__mark">SS</span><span><b>SIGNAL</b><b>SHIFT</b></span></button>
      <div class="topbar__meta"><span class="status-dot"></span><span>本地練習 · 不儲存資料</span><span class="topbar__slash">/</span><span>CODEBUDDY MVP</span></div>
    </header>`;
  }
  const scenario = state.currentScenario;
  const progressDisplay = state.mode === 'demo'
    ? 'DEMO'
    : `${String(scenario.kind === 'tutorial' ? state.currentIndex + 1 : scenario.kind === 'transfer' ? 5 : scenario.level).padStart(2, '0')} / 05`;
  return `<header class="topbar topbar--game">
    <button class="brand" data-action="home" aria-label="離開練習並返回首頁"><span class="brand__mark">SS</span><span><b>SIGNAL</b><b>SHIFT</b></span></button>
    <div class="game-progress"><span>${scenario.kind === 'tutorial' ? '訊號入門' : scenario.kind === 'transfer' ? '轉移應用' : '核心練習'}</span><div class="game-progress__line"><i style="width:${sessionProgress()}%"></i></div><strong>${progressDisplay}</strong></div>
    <div class="topbar__meta"><span class="status-dot"></span><span>${state.mode === 'demo' ? 'DEMO MODE' : 'LEARNING MODE'}</span></div>
  </header>`;
}

function homeView() {
  return `${headerMarkup()}<main class="home-shell">
    <section class="home-hero">
      <div class="hero-copy">
        <div class="eyebrow eyebrow--lime"><span class="eyebrow__line"></span>WORKPLACE SIGNAL TRAINING</div>
        <h1>讓下一步<br /><em>清晰可見。</em></h1>
        <p class="hero-lede">工作上的一句話，有時未必等於你要做的事。Signal Shift 將模糊輸入變成可以行動的訊號。</p>
        <div class="hero-actions">
          <button class="button button--primary" data-action="start"><span>開始學習</span><span class="button__arrow">↗</span></button>
          <button class="button button--ghost" data-action="demo"><span class="button__play">▶</span><span>直接試玩 Demo</span></button>
        </div>
        <p class="hero-note"><span class="note-dot"></span>約 4–5 分鐘 · 不設時限 · 由你決定節奏</p>
      </div>
      <div class="hero-console" aria-label="Signal Shift 的三步決策流程示意">
        <div class="console-top"><span>LIVE SIGNAL MAP</span><span>01 — 05</span></div>
        <div class="console-orbit">
          <div class="orbit-line orbit-line--one"></div><div class="orbit-line orbit-line--two"></div>
          <div class="orbit-node orbit-node--green"><span>↗</span><small>CLEAR</small></div>
          <div class="orbit-node orbit-node--yellow"><span>!</span><small>PAUSE</small></div>
          <div class="orbit-node orbit-node--red"><span>—</span><small>PROTECT</small></div>
          <div class="orbit-node orbit-node--detour"><span>↝</span><small>SHIFT</small></div>
          <div class="orbit-node orbit-node--joke"><span>✦</span><small>LIGHT</small></div>
          <div class="console-center"><span class="console-center__ring">SS</span><b>READ<br />THE<br />SHIFT</b><small>看清改變</small></div>
        </div>
        <div class="console-footer"><span>每一個訊號，都是下一步的線索。</span><span class="console-footer__pulse"></span></div>
      </div>
    </section>

    <section class="home-lower">
      <div class="process-card">
        <div class="section-kicker">THE DECISION LOOP <span>— 你會練習的三步</span></div>
        <div class="process-steps">
          <div class="process-step"><span class="process-step__number">01</span><div><h2>分類</h2><p>這個訊號支持你做哪一件事？</p></div><span class="process-step__symbol">◌</span></div>
          <div class="process-step"><span class="process-step__number">02</span><div><h2>確認</h2><p>把缺少的目標、次序或界線問清楚。</p></div><span class="process-step__symbol">⌁</span></div>
          <div class="process-step"><span class="process-step__number">03</span><div><h2>回應</h2><p>選擇保護自己、又能推進事情的做法。</p></div><span class="process-step__symbol">↗</span></div>
        </div>
      </div>
      <aside class="home-aside">
        <div class="aside-label">SESSION SIGNALS</div>
        <p>五種訊號會在學習途中逐一亮起。</p>
        <div class="signal-mini-row">${SIGNAL_ORDER.map((id) => `<span title="${signalLabel(id)}">${iconMarkup(id, 'signal-icon--mini')}<small>${SIGNALS[id].chinese}</small></span>`).join('')}</div>
        <div class="aside-rule"></div>
        <div class="aside-foot"><span>你的答案不會被評分。</span><span>→</span></div>
      </aside>
    </section>
  </main>`;
}

function progressRail() {
  const items = [
    ['tutorial', '訊號入門', state.mode !== 'demo' && state.currentScenario?.kind === 'tutorial'],
    ['practice', '工作練習', state.currentScenario?.kind === 'scenario'],
    ['transfer', '轉移應用', state.currentScenario?.kind === 'transfer'],
    ['summary', '模式總結', false],
  ];
  return `<aside class="progress-rail" aria-label="學習進度">
    <div class="rail-label">YOUR ROUTE</div>
    <div class="rail-items">${items.map(([id, label, active], index) => `<div class="rail-item ${active ? 'is-active' : ''} ${index < 1 && state.currentScenario?.kind !== 'tutorial' ? 'is-done' : ''}"><span class="rail-item__dot">${active ? '●' : index < 1 && state.currentScenario?.kind !== 'tutorial' ? '✓' : '·'}</span><span>${label}</span></div>`).join('')}</div>
    <div class="rail-progress"><span>SESSION PROGRESS</span><div class="rail-progress__track"><i style="height:${sessionProgress()}%"></i></div><strong>${String(Math.round(sessionProgress())).padStart(2, '0')}%</strong></div>
  </aside>`;
}

function sessionProgress() {
  if (state.mode === 'demo') return state.phase === 'feedback' ? 100 : 65;
  if (!state.currentScenario) return 0;
  if (state.currentScenario.kind === 'tutorial') return Math.round((state.currentIndex / 8) * 100);
  if (state.currentScenario.kind === 'scenario') return 62 + ((state.currentScenario.level - 2) / 3) * 20;
  return state.phase === 'feedback' ? 100 : 90;
}

function sceneMarkup(scenario) {
  const personClass = scenario.sceneType === 'colleague' ? 'person--colleague' : scenario.sceneType === 'transfer' ? 'person--transfer' : 'person--boss';
  return `<div class="scene-card">
    <div class="scene-card__top"><span class="scene-card__location"><span class="scene-card__pin">+</span>${escapeHtml(scenario.scene)}</span><span class="scene-card__tag">OBSERVE</span></div>
    <div class="scene-art scene-art--${scenario.sceneType}">
      <div class="scene-art__window"><span></span><span></span><span></span><i></i><i></i><i></i></div>
      <div class="scene-art__shelf"><span></span><span></span><span></span><span></span></div>
      <div class="scene-art__desk"><span class="desk-screen"></span><span class="desk-paper"></span><span class="desk-cup"></span></div>
      <div class="scene-art__person ${personClass}"><span class="person__hair"></span><span class="person__head"></span><span class="person__body"></span><span class="person__arm"></span></div>
      <div class="scene-art__signal-glow"></div>
      <div class="scene-art__caption"><span>SCENE ${scenario.kind === 'tutorial' ? 'INTRO' : scenario.kind === 'transfer' ? 'UNSEEN' : `0${scenario.level}`}</span><span>◌</span></div>
    </div>
    <div class="dialogue-card">
      <div class="dialogue-card__speaker"><span class="speaker-avatar">${scenario.sceneType === 'colleague' || scenario.sceneType === 'transfer' ? 'C' : 'B'}</span><span>${escapeHtml(scenario.dialogueSpeaker || 'Scene guide')}</span><small>just now</small></div>
      <p>「${escapeHtml(scenario.dialogue.replace(/^「|」$/g, ''))}」</p>
      ${scenario.dialogueNote ? `<div class="dialogue-card__note">${escapeHtml(scenario.dialogueNote)}</div>` : ''}
    </div>
  </div>`;
}

function evidenceMarkup(scenario) {
  return `<section class="evidence-card" aria-labelledby="evidence-title">
    <div class="card-kicker"><span class="card-kicker__marker"></span><span id="evidence-title">SIGNAL EVIDENCE</span><span class="card-kicker__status">答案尚未顯示</span></div>
    <p class="evidence-lead">先讀證據，再決定這個訊號支持你做什麼。</p>
    <div class="evidence-list">${scenario.evidence.map((item, index) => `<div class="evidence-item"><span>0${index + 1}</span><p>${escapeHtml(item)}</p></div>`).join('')}</div>
    ${scenario.setup ? `<div class="evidence-context"><span class="evidence-context__icon">⌁</span><p>${escapeHtml(scenario.setup)}</p></div>` : ''}
    ${scenario.supportingCue ? `<div class="supporting-cue"><span>SUPPORTING CUE</span><p>${escapeHtml(scenario.supportingCue.replace('Supporting cue · ', ''))}</p></div>` : ''}
  </section>`;
}

function classificationMarkup(scenario) {
  const answered = state.phase !== 'classify';
  return `<section class="decision-card" aria-labelledby="decision-title">
    <div class="decision-card__head"><div><div class="card-kicker"><span class="card-kicker__marker"></span><span>STEP 01 · CLASSIFY</span></div><h2 id="decision-title">這支持你做什麼？</h2></div><span class="step-chip">${answered ? '已分類' : '未分類'}</span></div>
    <p class="decision-card__hint">選擇一個最能決定下一步的訊號。不要猜對方心裡想什麼。</p>
    <div class="signal-grid">${SIGNAL_ORDER.map((id) => renderSignalButton(id, { answer: answered, selected: state.selectedSignal === id })).join('')}</div>
    ${answered ? revealMarkup(scenario) : '<div class="decision-placeholder"><span>?</span><p>分類後，你會看到訊號的意思和下一步提示。</p></div>'}
  </section>`;
}

function revealMarkup(scenario) {
  const signal = SIGNALS[scenario.signal];
  const correct = state.selectedSignal === scenario.signal;
  const coaching = scenario.kind === 'tutorial' ? scenario.teaching : scenario.classificationCoaching;
  return `<div class="reveal-card reveal-card--${signal.tone} ${correct ? 'is-correct' : 'is-missed'}" aria-live="polite">
    <div class="reveal-card__icon">${iconMarkup(scenario.signal)}</div>
    <div class="reveal-card__body"><div class="reveal-card__top"><span class="reveal-card__eyebrow">SIGNAL REVEAL</span><span class="reveal-card__result">${correct ? '你已捕捉到重點' : '再對照一次證據'}</span></div><h3>${signalLabel(scenario.signal)}</h3><p>${escapeHtml(signal.meaning)}</p><div class="reveal-card__coaching"><strong>${correct ? '分類提示' : '看看關鍵'}</strong><span>${escapeHtml(coaching)}</span></div></div>
  </div>
  ${scenario.boundary ? `<div class="boundary-note"><span class="boundary-note__icon">!</span><p><strong>界線提示</strong>${escapeHtml(scenario.boundary)}</p></div>` : ''}
  ${scenario.kind === 'tutorial' ? correct
    ? `<button class="button button--next tutorial-next" data-action="next"><span>${state.currentIndex === TUTORIAL_STEPS.length - 1 ? '進入工作練習' : '下一個訊號'}</span><span>↗</span></button>`
    : `<div class="tutorial-retry"><span>再對照上面的證據，試一次。</span><button class="text-button" data-action="replay">↻ 重新分類</button></div>`
    : ''}`;
}

function responseMarkup(scenario) {
  if (scenario.kind === 'tutorial') return '';
  const canRespond = state.phase === 'respond' || state.phase === 'feedback';
  return `<section class="response-card ${canRespond ? '' : 'is-disabled'}" aria-labelledby="response-title">
    <div class="decision-card__head"><div><div class="card-kicker"><span class="card-kicker__marker card-kicker__marker--lime"></span><span>STEP 02 · CONFIRM / RESPOND</span></div><h2 id="response-title">你會怎樣回應？</h2></div><span class="step-chip">${state.phase === 'feedback' ? '已選擇' : canRespond ? '請選擇' : '先完成分類'}</span></div>
    <p class="decision-card__hint">至少一個選擇會幫你確認缺少的目標、次序、時間或界線。</p>
    <div class="response-list">${scenario.responses.map((response, index) => responseButton(response, index, canRespond)).join('')}</div>
    ${state.phase === 'feedback' ? feedbackMarkup(scenario) : ''}
  </section>`;
}

function responseButton(response, index, canRespond) {
  const selected = state.selectedResponse === index;
  const isChosen = state.phase === 'feedback' && selected;
  return `<button class="response-option response-option--${response.tier} ${selected ? 'is-selected' : ''} ${state.phase === 'feedback' && !selected ? 'is-dimmed' : ''}" data-response="${index}" onclick="window.SignalShift?.chooseResponse(${index})" ${canRespond && state.phase !== 'feedback' ? '' : 'disabled'} aria-pressed="${selected}">
    <span class="response-option__index">0${index + 1}</span><span class="response-option__label">${escapeHtml(response.label)}</span><span class="response-option__meta">${escapeHtml(response.tierLabel)} ${isChosen ? '· 已選' : ''}</span><span class="response-option__arrow">↗</span>
  </button>`;
}

function feedbackMarkup(scenario) {
  const response = scenario.responses[state.selectedResponse];
  const impactEntries = Object.entries(response.impact);
  return `<div class="feedback-card feedback-card--${response.tier}" aria-live="polite">
    <div class="feedback-card__head"><span class="feedback-card__stamp">COACHING NOTE</span><span class="feedback-card__tier">${response.tier === 'preferred' ? '首選做法' : response.tier === 'acceptable' ? '可行做法' : '可以換一個方式'}</span></div>
    <p>${escapeHtml(response.coaching)}</p>
    <div class="feedback-impact">${impactEntries.map(([key, value]) => { const meta = IMPACT_STYLES[value]; return `<div class="feedback-impact__item"><span>${IMPACT_LABELS[key]}</span><strong class="${meta.className}"><i>${arrow(meta.direction)}</i>${meta.label}</strong></div>`; }).join('')}</div>
    <div class="feedback-actions"><button class="text-button" data-action="replay">↻ 重玩這一幕</button><button class="button button--next" data-action="next"><span>${nextLabel(scenario)}</span><span>↗</span></button></div>
  </div>`;
}

function nextLabel(scenario) {
  if (state.mode === 'demo') return '查看 Demo 小結';
  if (scenario.kind === 'tutorial' && state.currentIndex === TUTORIAL_STEPS.length - 1) return '開始工作練習';
  if (scenario.kind === 'scenario' && scenario.level === 4) return '進入 Transfer Check';
  if (scenario.kind === 'transfer') return '查看模式總結';
  return '下一幕';
}

function gameView() {
  const scenario = state.currentScenario;
  return `${headerMarkup({ game: true })}<main class="game-shell">
    ${progressRail()}
    <div class="game-main">
      <div class="game-intro"><div><div class="eyebrow eyebrow--lime"><span class="eyebrow__line"></span>${escapeHtml(scenario.eyebrow)}</div><h1>${escapeHtml(scenario.title)}</h1></div><div class="game-intro__count"><span>NO. ${String(scenario.kind === 'tutorial' ? state.currentIndex + 1 : scenario.kind === 'transfer' ? 5 : scenario.level).padStart(2, '0')}</span><small>無需限時</small></div></div>
      <div class="game-grid">
        <div class="game-left">${sceneMarkup(scenario)}${evidenceMarkup(scenario)}${metersMarkup()}</div>
        <div class="game-right">${classificationMarkup(scenario)}${responseMarkup(scenario)}</div>
      </div>
    </div>
  </main>`;
}

function summaryView() {
  const recognizedLabels = state.recognized.map(signalLabel);
  const mostConfused = Object.entries(state.confusions).sort((a, b) => b[1] - a[1])[0];
  const confusionLabel = mostConfused ? signalLabel(mostConfused[0]) : '暫時沒有明顯混淆';
  const transferSuccess = state.transferPassed === true;
  const nextPractice = mostConfused?.[0] === 'joke' || mostConfused?.[0] === 'red'
    ? '下次先留意：對方有沒有尊重你已經表達的界線。'
    : mostConfused?.[0] === 'detour'
      ? '遇到計劃改變時，先問清楚新目標、優先次序及截止日期。'
      : '遇到模糊要求時，先問清楚優先次序及截止日期。';
  return `${headerMarkup()}<main class="summary-shell">
    <div class="summary-heading"><div class="eyebrow eyebrow--lime"><span class="eyebrow__line"></span>SESSION PATTERN SUMMARY</div><h1>你今次看見了<br /><em>哪些改變？</em></h1><p>這不是分數。這是一張只屬於今次練習的路線圖。</p></div>
    <div class="summary-grid">
      <section class="summary-card summary-card--recognized"><div class="summary-card__top"><span class="summary-card__index">01</span><span>RECOGNISED SIGNALS</span></div><h2>已經亮起的訊號</h2><div class="recognized-list">${SIGNAL_ORDER.map((id) => `<div class="recognized-item ${state.recognized.includes(id) ? 'is-unlocked' : 'is-locked'}">${state.recognized.includes(id) ? iconMarkup(id) : '<span class="locked-icon">?</span>'}<span><b>${SIGNALS[id].label}</b><small>${state.recognized.includes(id) ? '今次成功辨認' : '今次未解鎖'}</small></span>${state.recognized.includes(id) ? '<strong>✓</strong>' : ''}</div>`).join('')}</div></section>
      <section class="summary-card summary-card--pattern"><div class="summary-card__top"><span class="summary-card__index">02</span><span>YOUR PATTERN</span></div><h2>這次的線索</h2><div class="pattern-statement"><span class="pattern-statement__icon">⌁</span><p>你今次成功辨認 ${recognizedLabels.length ? recognizedLabels.map((label) => `<b>${escapeHtml(label.split(' · ')[0])}</b>`).join('、') : '部分訊號'}，並嘗試將訊號變成下一步。</p></div><div class="pattern-confusion"><span>最需要再留意</span><strong>${escapeHtml(confusionLabel)}</strong><p>${mostConfused ? '下次可以慢一點，重新對照說話、行為和界線。' : '你目前沒有重複出現的混淆模式。'}</p></div></section>
      <section class="summary-card summary-card--transfer"><div class="summary-card__top"><span class="summary-card__index">03</span><span>TRANSFER CHECK</span></div><div class="transfer-result"><div class="transfer-result__badge ${transferSuccess ? 'is-success' : 'is-retry'}">${transferSuccess ? '✓' : '↻'}</div><div><h2>${transferSuccess ? '你把方法帶到新情境。' : '新情境仍然可以再試。'}</h2><p>${transferSuccess ? '你成功將「分類 → 確認 → 回應」應用到未見過的情境。' : '這個結果不是分數；它提示你下次可以先對照界線和安全。'}</p></div></div></section>
      <section class="summary-card summary-card--next"><div class="summary-card__top"><span class="summary-card__index">NEXT</span><span>ONE SMALL PRACTICE</span></div><h2>下一步</h2><p>${escapeHtml(nextPractice)}</p><button class="button button--primary" data-action="new-session"><span>再練習一次</span><span class="button__arrow">↗</span></button></section>
    </div>
    <div class="summary-footer"><span>Signal Shift / session complete</span><button class="text-button" data-action="home">← 返回首頁</button></div>
  </main>`;
}

function render() {
  if (state.view === 'home') app.innerHTML = homeView();
  else if (state.view === 'game') app.innerHTML = gameView();
  else app.innerHTML = summaryView();
  bindEvents();
  const focusTarget = state.view === 'game' ? (state.phase === 'classify' ? '.signal-choice:not([disabled])' : state.phase === 'respond' ? '.response-option:not([disabled])' : '[data-action="next"]') : 'h1';
  requestAnimationFrame(() => document.querySelector(focusTarget)?.focus({ preventScroll: true }));
}

function bindEvents() {
  app.querySelectorAll('[data-action]').forEach((button) => {
    button.onclick = () => handleAction(button.dataset.action);
  });
  app.querySelectorAll('[data-signal]').forEach((button) => {
    button.onclick = () => classify(button.dataset.signal);
  });
  app.querySelectorAll('[data-response]').forEach((button) => {
    button.onclick = () => chooseResponse(Number(button.dataset.response));
  });
  app.onclick = (event) => {
    const target = event.target.closest('[data-action], [data-signal], [data-response]');
    if (!target || !app.contains(target)) return;
    if (target.dataset.action) handleAction(target.dataset.action);
    else if (target.dataset.signal) classify(target.dataset.signal);
    else if (target.dataset.response) chooseResponse(Number(target.dataset.response));
  };
}

function handleAction(action) {
  if (action === 'start' || action === 'new-session') resetSession('learning');
  if (action === 'demo') resetSession('demo');
  if (action === 'home') { state.view = 'home'; state.mode = null; }
  if (action === 'replay') replayCurrent();
  if (action === 'next') advance();
  render();
}

function classify(signalId) {
  if (state.phase !== 'classify') return;
  state.selectedSignal = signalId;
  state.phase = state.currentScenario.kind === 'tutorial' ? 'reveal' : 'respond';
  if (signalId === state.currentScenario.signal) {
    if (!state.unlocked.includes(signalId)) state.unlocked.push(signalId);
    if (!state.recognized.includes(signalId)) state.recognized.push(signalId);
  } else {
    state.confusions[signalId] = (state.confusions[signalId] || 0) + 1;
  }
}

function chooseResponse(index) {
  if (state.phase !== 'respond') return;
  state.selectedResponse = index;
  state.phase = 'feedback';
  const response = state.currentScenario.responses[index];
  applyImpact(response.impact);
  if (state.currentScenario.kind === 'transfer') state.transferPassed = state.selectedSignal === state.currentScenario.signal && response.tier !== 'harmful';
}

function applyImpact(impact) {
  const delta = { improved: 10, down: -10, downSmall: -5, steady: 0, affected: -8, worse: -14, up: 12, upBig: 20, downMaybe: -6, protected: 0, notImproved: 10, variable: 0 };
  if (impact.relationship) state.meters.relationship = clamp(state.meters.relationship + (delta[impact.relationship] || 0));
  if (impact.stress) state.meters.stress = clamp(state.meters.stress + (delta[impact.stress] || 0));
  if (impact.performance) state.meters.performance = clamp(state.meters.performance + (delta[impact.performance] || 0));
}

function clamp(value) { return Math.max(0, Math.min(100, value)); }

function replayCurrent() {
  const current = state.currentScenario;
  if (current.kind === 'tutorial') loadTutorialStep(state.currentIndex);
  else if (current.kind === 'transfer') loadTransfer();
  else loadScenario(current);
}

function advance() {
  const current = state.currentScenario;
  if (state.mode === 'demo') { state.view = 'summary'; return; }
  if (current.kind === 'tutorial') {
    if (state.currentIndex < TUTORIAL_STEPS.length - 1) loadTutorialStep(state.currentIndex + 1);
    else loadScenario(WORKPLACE_SCENARIOS[0]);
    return;
  }
  if (current.kind === 'scenario') {
    const scenarioIndex = WORKPLACE_SCENARIOS.findIndex((item) => item.id === current.id);
    if (scenarioIndex < WORKPLACE_SCENARIOS.length - 1) loadScenario(WORKPLACE_SCENARIOS[scenarioIndex + 1]);
    else loadTransfer();
    return;
  }
  state.view = 'summary';
}

window.SignalShift = { classify, chooseResponse, handleAction, advance, replayCurrent };
render();
