# Signal Shift — Shared Asset Style Guide

Use this style block at the start of every Signal Shift image-generation prompt. Do not change the palette, line treatment, camera language, or accessibility rules between assets.

## Shared style block

```text
Create a warm, calm 2D vector editorial illustration for Signal Shift, a neurodiversity-friendly Hong Kong workplace communication training game. Use clean geometric shapes, rounded corners, a restrained high-contrast palette, and a polished modern educational-game look. Use a consistent 3 px deep-navy outline, soft 1–2 px shadow only where it improves separation, simple flat fills, minimal texture, and no photorealism. The mood is respectful, practical, calm, and non-judgmental.

Palette: deep navy #1F2A44 for outlines and key text areas; warm cream #FFF8EE for backgrounds; mint #BFE7D1 for positive/Green Light accents; amber #F5C451 for Yellow Light and Detour accents; coral #E76F51 for Red Light accents; sky blue #A8DADC for secondary accents; charcoal #27313C for neutral details. Keep contrast strong and never rely on colour alone: every signal must also have a distinct shape and visual motif.

Use inclusive Hong Kong workplace context without stereotypes. Keep faces and body language readable but understated. Avoid exaggerated emotion, shame, villain coding, disability stereotypes, medical imagery, childish nursery styling, and visual clutter. Do not include any legible words, UI, logos, watermarks, captions, speech bubbles with text, or brand marks in generated artwork unless the asset prompt explicitly asks for a non-text shape such as a blank speech bubble.
```

## Shared negative prompt

```text
photorealistic, 3D render, anime, manga, glossy mascot style, childish cartoon, horror, angry caricature, exaggerated facial expression, disability stereotype, medical symbol, cluttered background, tiny unreadable details, low contrast, colour-only meaning, gradients everywhere, text, letters, numbers, logo, watermark, brand mark, UI overlay, border crop, cut-off subject
```

## Export rules

- Character and icon assets: transparent PNG, square 2048 × 2048, centred subject, generous padding.
- Scene backgrounds: PNG or WebP, 16:9, 1920 × 1080, no characters and no UI overlay.
- Keep the same apparent outline weight and lighting direction across every asset.
- Generate one clean master asset first; derive locked/grey states in code by applying opacity and desaturation rather than generating a second illustration.
