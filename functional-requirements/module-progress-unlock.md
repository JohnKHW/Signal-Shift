# Module: Progress & Unlock System (Lightweight)

## FR-PROG-001
The game SHALL maintain a session-level set of unlocked Signal Types.
At the start of a new session all five entries in the progress panel are locked (shown as grey / question mark).

## FR-PROG-002
When the player correctly classifies a signal for the first time in the current session, that signal SHALL become unlocked and remain visually lit for the rest of the session.

## FR-PROG-003
Locked progress entries SHALL hide their detailed meaning. Only the icon silhouette or “?” is visible until unlocked. Classification controls MAY still show the five Signal Type names and distinct icons so the player can make an informed attempt in Demo Mode.

## FR-PROG-004
There is NO persistent storage across browser sessions or days. Progress resets when the page is refreshed or a new session is started. This is intentional for the hackathon MVP.

## FR-PROG-005
After the Transfer Check, a Pattern Summary screen SHALL appear showing:
- Which Signal Types were unlocked and successfully recognised in this session
- Which Signal Type or Joke-to-Red boundary the player most frequently confused, if any
- Whether the player applied the method successfully in the Transfer Check
- One short, supportive next-practice suggestion

The summary SHALL not use a single overall score or pass/fail threshold.

## FR-PROG-006
(Optional – only if core is complete and time remains)
A single “Recap Practice” button may appear on the Pattern Summary.
Clicking it launches 1–2 short Replay Variants drawn only from Signal Types or boundaries the player got wrong in the current session.
No cross-session memory is required.

## FR-PROG-007
Ordinary gameplay SHALL not collect identifiable data or persist results across browser sessions. A future opt-in Measurement Mode for research or treatment evaluation is explicitly outside the MVP and SHALL use separate consent, governance, and validated measures.
