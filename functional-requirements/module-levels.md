# Module: Levels & Content

## FR-LEVEL-001
The MVP SHALL contain exactly four levels in this fixed order:

1. Tutorial – Signal Introduction (no scoring, unlocks signals as they are taught)
2. Boss Vague Feedback
3. Colleague Joke
4. Sudden Plan Change (primary demo level)

After Level 4, the player SHALL complete one short unseen Transfer Check before the Pattern Summary (see FR-CORE-006) is shown.

## FR-LEVEL-002
Tutorial level SHALL introduce all five signal types one by one. Player must correctly classify each before proceeding. No response selection is required in tutorial. Each correctly classified signal is immediately unlocked for the rest of the session (FR-PROG-002).

## FR-LEVEL-003
Level 2 (Boss Vague Feedback) dialogue core:
Boss: “再看看，有些地方可以更好。”
Primary signal: Yellow Light
Preferred response: Ask which area should be improved first.
Acceptable alternative: Confirm that you will organise the report first and then follow up on the most important improvement area.
Harmful response: Defend the existing work instead of clarifying the request.

## FR-LEVEL-004
Level 3 (Colleague Joke) dialogue core:
Colleague (smiling): “你又加班啊，是不是想搶我的位置？”
Primary signal: Joke Sign
Preferred response: Give a light, non-defensive acknowledgement.
Acceptable alternative: Keep the reply brief and neutral without treating the remark as a literal accusation.
Boundary note: If the remark targets a vulnerability, causes discomfort, or continues after a boundary, it is a Red Light rather than a Joke Sign.

## FR-LEVEL-005
Level 4 (Sudden Plan Change) dialogue core:
Boss (mid-meeting): “這個方向先放下，我們改做另一個。”
Primary signal: Detour Sign
Supporting cue: The incomplete details also create a mild Yellow Light.
Preferred response: Confirm the new goal, priority order, and deadline.
Acceptable alternative: Acknowledge the change and ask for the new requirements in a follow-up.
Harmful response: Resist the change in the meeting without first confirming the new direction.

## FR-LEVEL-006
Each non-tutorial level SHALL present exactly three response options: one preferred response, one other acceptable response, and one clearly harmful response. Coaching SHALL explain trade-offs rather than label every non-preferred response as wrong.

## FR-LEVEL-007
Full dialogue scripts, including coaching text for every choice, SHALL be stored as structured data so they can be edited without code changes.

## FR-LEVEL-008
The Transfer Check SHALL present a new workplace scene without revealing the signal answer or reusing a taught dialogue script. The player SHALL classify one Primary Signal Type and select a response.

For the MVP, the Transfer Check SHALL use a Red Light boundary scenario so Red Light is practised in active gameplay. The result SHALL be reported separately in the Pattern Summary as evidence of transfer, not as a clinical or overall score.

## FR-LEVEL-009
Start Learning SHALL follow the fixed level order. Demo Mode MAY enter directly into Level 4 or a representative Transfer Check variant, while preserving the same classification and coaching rules.
