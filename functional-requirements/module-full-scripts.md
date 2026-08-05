# Module: Full Dialogue & Coaching Scripts (MVP)

## Script Rules

- Character dialogue uses natural Hong Kong Cantonese.
- Instructions, controls, and coaching use plain, direct Hong Kong Traditional Chinese.
- Each scenario has exactly three response options: one **Preferred**, one other **Acceptable**, and one **Harmful**.
- Coaching explains evidence, trade-offs, safety, and the next useful action. It does not shame the player or call every non-preferred response “wrong”.
- Impact feedback is qualitative and directional. Internal numeric deltas, if used by the engine, are not player-facing.

The implementation data for each scenario SHALL include, at minimum: `scene`, `dialogue`, `signalEvidence`, `primarySignalType`, optional `supportingCues`, three response records with a validity tier, qualitative `impactFeedback`, and classification/response coaching. This markdown file is the human-readable source of truth for those records.

## Tutorial – Signal Introduction

The tutorial is the only place where the signal meaning is taught before classification.

**Green Light**
- Display: Green circular light
- Teaching text: 「綠燈 = 清晰指示。對方已說明要做的事情，可以直接執行。」
- Player action: 選擇 Green Light 以確認理解。

**Yellow Light**
- Display: Yellow circular light
- Teaching text: 「黃燈 = 模糊訊號。對方未說明細節，需要先追問或觀察。」
- Player action: 選擇 Yellow Light。

**Red Light**
- Display: Red circular light
- Teaching text: 「紅燈 = 警告或衝突風險。先暫停、降低衝突，必要時尋求支援。」
- Player action: 選擇 Red Light。

**Detour Sign**
- Display: Yellow triangle with arrow
- Teaching text: 「改道標誌 = 計劃突然改變。先確認新目標，再詢問優先次序及截止日期。」
- Player action: 選擇 Detour Sign。

**Joke Sign**
- Display: Speech bubble with smile
- Teaching text: 「玩笑標誌 = 低風險、非字面意思的幽默。可以輕鬆回應，但不需要忍受令人不安的說話。」
- Player action: 選擇 Joke Sign。

---

## Level 2 – Boss Vague Feedback

**Scene setup**: 你啱啱交咗一份報告，老闆行過嚟。

**Boss dialogue**: 「再睇下，有啲地方可以更好。」

**Signal Evidence before classification**:
- Feedback is vague.
- No priority area or concrete change is stated.

**Primary Signal Type after classification**: Yellow Light

**Response options**:

1. **Preferred**: 「好呀，請問你想我優先調整邊一部分？」
   - Impact feedback: 「關係：改善｜壓力：下降｜表現：改善」
   - Coaching: 「你先確認優先次序，將模糊要求變成下一步行動。」

2. **Acceptable**: 「我先整理現有內容，之後再同你確認最需要改善嘅部分，可以嗎？」
   - Impact feedback: 「關係：穩定｜壓力：輕微下降｜表現：改善」
   - Coaching: 「這個方向合理；如果即時確認重點，會更容易避免改錯。」

3. **Harmful**: 「我已經好認真做㗎喇，究竟邊度唔好？」
   - Impact feedback: 「關係：惡化｜壓力：上升｜表現：受影響」
   - Coaching: 「這個回應令對方需要先處理防衛情緒，未能幫助你取得具體要求。」

---

## Level 3 – Colleague Joke

**Scene setup**: 下晝較晏，你仲喺度工作。同事笑住行過。

**Colleague dialogue**: 「你又加班啊，係咪想搶我個位？」（帶笑）

**Signal Evidence before classification**:
- The remark is non-literal in this context.
- The colleague's tone is light and there is no sign of repeated targeting or discomfort.

**Primary Signal Type after classification**: Joke Sign

**Response options**:

1. **Preferred**: 「哈哈，我只係想早啲做完，聽日可以輕鬆啲啫。」
   - Impact feedback: 「關係：改善｜壓力：下降｜表現：穩定」
   - Coaching: 「你留意到這是低風險玩笑，並用輕鬆方式回應，保持氣氛自然。」

2. **Acceptable**: 「哈哈，我先完成手頭份工作先。」
   - Impact feedback: 「關係：穩定｜壓力：穩定｜表現：穩定」
   - Coaching: 「簡短、中性的回應也可以；你沒有將玩笑當成字面指控。」

3. **Harmful**: 「我先冇諗過搶你個位！你點解咁講？」
   - Impact feedback: 「關係：惡化｜壓力：上升｜表現：受影響」
   - Coaching: 「過度認真或防衛性回應，可能令低風險玩笑升級成衝突。」

**Joke-to-Red boundary**:
如果說話針對身份或弱點、令人明顯不舒服、重複發生，或者對方喺你表達界線後仍然繼續，就唔再係 Joke Sign，而係 Red Light。

---

## Level 4 – Sudden Plan Change (Demo Primary)

**Scene setup**: 會議中途，你已經為方向 A 準備好資料。

**Boss dialogue**: 「呢個方向先放低，我哋改做另一個。」

**Signal Evidence before classification**:
- The current plan is explicitly changed.
- The new goal, priority order, and deadline are not yet clear.

**Primary Signal Type after classification**: Detour Sign
**Supporting cue**: Mild Yellow Light because the new details are incomplete.

**Response options**:

1. **Preferred**: 「明白，咁新目標係乜嘢？另外優先次序同截止日期有冇更新？」
   - Impact feedback: 「關係：改善｜壓力：下降｜表現：改善」
   - Coaching: 「你先確認新目標，再釐清優先次序及時間，將改道變成可執行的計劃。」

2. **Acceptable**: 「明白，我先停低方向 A；可唔可以之後將新要求發畀我？」
   - Impact feedback: 「關係：穩定｜壓力：輕微下降｜表現：改善」
   - Coaching: 「你接受了改變，亦保留了跟進確認的空間；如果即場問清截止日期，會更穩妥。」

3. **Harmful**: 「但我已經為呢個方向準備咗好多資料……」
   - Impact feedback: 「關係：受影響｜壓力：上升｜表現：受影響」
   - Coaching: 「表達已投入的時間是可以理解的，但如果先抗拒改變，容易錯過確認新方向的機會。」

---

## Transfer Check – Red Boundary

This scene is unseen before the player reaches it. The signal answer remains hidden until classification.

**Scene setup**: 你之前已經同一位同事講過，唔想再聽呢類說話。第二日，佢喺其他同事面前又講：

**Colleague dialogue**: 「又開始扮專業啦？唔好咁玻璃心喎。」

**Signal Evidence before classification**:
- The remark targets a personal vulnerability.
- It happens publicly and repeats after a stated boundary.
- The speaker dismisses the boundary instead of checking in.

**Primary Signal Type after classification**: Red Light

**Response options**:

1. **Preferred / Safety Response**: 「我之前已經講過呢類說話令我唔舒服，請停止。如果再發生，我會記低情況，搵主管或者可信任嘅人一齊跟進。」
   - Impact feedback: 「安全同自主：受到保護｜壓力：有機會下降｜關係：視乎對方反應」
   - Coaching: 「這個情況已經越過 Joke-to-Red boundary。你不需要判斷對方是否真心講笑；先保護界線、記錄事實，再尋求適當支援。」

2. **Acceptable / Safety Response**: 「我而家唔想繼續呢個對話，我會先離開，之後搵可信任嘅人商量。」
   - Impact feedback: 「安全同自主：受到保護｜壓力：可能下降｜表現：暫時未定」
   - Coaching: 「先離開及尋求支援是安全可行的做法。之後可以補充記錄發生的事情，以及你已經表達過的界線。」

3. **Harmful**: 「你再講一次試下，我就當眾講返你啲秘密！」
   - Impact feedback: 「安全：未有改善｜壓力：大幅上升｜關係：惡化」
   - Coaching: 「以威脅回應可能令情況升級，亦令後續求助更困難。你可以離開現場、記錄事實，或尋求可信任人士協助。」

---

## Pattern Summary Logic

The Pattern Summary SHALL use the player's session pattern rather than a thresholded overall score. It should include messages such as:

- 「你今次成功辨認 Yellow Light 和 Detour Sign，亦能用問題確認下一步。」
- 「你較常混淆 Joke 和 Red；下次先留意對方有沒有尊重你已經表達的界線。」
- 「Transfer Check：你成功將『分類 → 確認 → 回應』應用到未見過的情境。」
- 「下一步：遇到模糊要求時，先問清楚優先次序及截止日期。」
