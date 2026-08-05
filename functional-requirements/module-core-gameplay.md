# Module: Core Gameplay

## FR-CORE-001
The core loop SHALL consist of the following ordered steps for every non-tutorial scenario:
1. Present a short workplace scene, dialogue, and **Signal Evidence** without naming or displaying the answer.
2. Player classifies one **Primary Signal Type** from the five signal categories.
3. System reveals the Primary Signal Type and gives classification coaching.
4. Player selects one of three response options; at least one option SHALL be a **Confirmation Response** where the scenario calls for clarification.
5. System calculates internal Impact Meter changes for Relationship, Stress, and Performance.
6. System shows qualitative impact feedback and supportive coaching, including whether the response protected safety, built clarity, and moved the situation forward.
7. Player proceeds to the next scenario or replays a completed scenario.

## FR-CORE-002
Each Demo Slice scenario SHALL be completable in 60–90 seconds. The complete Start Learning path MAY take approximately 4–5 minutes so it can include active Red Light practice and a Transfer Check.

## FR-CORE-003
The game SHALL maintain three internal Impact Meters across a play session:
- Relationship (starts at 50, range 0–100)
- Stress (starts at 30, range 0–100)
- Performance (starts at 50, range 0–100)

The UI SHALL present these as qualitative direction and broad magnitude, not precise numeric deltas. They describe the current situation, not the player's character, ability, or clinical outcome.

## FR-CORE-004
Preferred and other acceptable responses SHALL produce context-appropriate consequences. Harmful choices SHALL produce clear but recoverable negative consequences and supportive coaching.

When Impact Meters conflict, the system SHALL prioritise safety and wellbeing, then clarity and player agency, then relationship, then short-term performance.

## FR-CORE-005
The player MAY replay any completed scenario. Replay SHALL support a Replay Variant where feasible so repeat play tests the decision principle rather than memorised dialogue. No cross-session account or progress is required for the MVP.

## FR-CORE-006
A Pattern Summary screen SHALL appear after the final scenario, showing:
- signal types unlocked and successfully recognised;
- the signal type or boundary most frequently confused, if any;
- the Transfer Check result;
- one supportive next-practice suggestion.

The summary SHALL NOT use a single overall score or pass/fail threshold.

## FR-CORE-007
The game SHALL not use Game Over or force a restart after a harmful response. The player SHALL continue after seeing the consequence and coaching.

## FR-CORE-008
The game SHALL provide two entry paths over the same gameplay engine:
- **Start Learning**: full tutorial, levels, Red Light practice, Transfer Check, and Pattern Summary;
- **Demo Mode**: direct entry into a representative scenario, followed by Signal Reveal, coaching, and a concise summary.

Demo Mode SHALL preserve hidden-before-classification Signal Evidence and the Classify → Confirm/Respond interaction.
