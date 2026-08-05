# How to Use This Pack

## For Product / Design
- Start with `prd/signal-shift-why.md` to stay aligned on the problem.
- Read `CONTEXT.md` before adding or renaming domain terms.
- Check the relevant ADR in `docs/adr/` before reversing an accepted product boundary.
- Use `module-full-scripts.md` as the single source of truth for all dialogue and coaching text.
- Use `assets/prompts/00-shared-style-guide.md` together with exactly one asset prompt file when generating visuals. Do not change the palette, outline, camera language, or export rules between assets.
- Treat the numbered FR- and NFR- IDs as the contract with engineering.

## For Engineering
- Implement the core loop exactly as described in FR-CORE-001: Signal Evidence → classify → Signal Reveal → Confirm/Respond → qualitative impact → coaching.
- Signal system is non-negotiable (FR-SIGNAL-001 to 007).
- Levels must appear in the fixed order defined in FR-LEVEL-001.
- New teammate owns FR-PROG-* (visual unlock + Pattern Summary + optional recap).
- Use the Gherkin files as your acceptance test checklist.

## For Demo Preparation
- Demo Mode should open directly on Level 4 or a representative Transfer Check variant.
- Let judges experience hidden Signal Evidence, classify, choose a response, see the Signal Reveal and coaching, then close with the tool statement.
- Keep the 60–90 second Demo Slice distinct from the 4–5 minute Start Learning path.

## Updating the Pack
If scope changes (new level, new signal type, scoring formula change, or data boundary), update the relevant FR file first, then adjust Gherkin, then scripts and README. Keep the glossary, ADRs, requirements, acceptance tests, and scripts consistent.
