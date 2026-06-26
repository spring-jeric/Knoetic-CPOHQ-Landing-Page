# CPOHQ — Landing Page

A premium, editorial landing page for **CPOHQ** — the community of the world's top Chief People Officers, plus an AI Chief of Staff that runs the people function on governed data.

Static site (HTML / CSS / vanilla JS) with a WebGL hero and scroll-driven motion. No build step.

## Highlights

- **Editorial art direction** — Fraunces (display) + Hanken Grotesk (body) + JetBrains Mono (labels), light theme with a light-blue brand and alternating white/dark sections.
- **WebGL hero (Three.js)** with a floating version switcher:
  - **Sphere** — a dense globe of member portraits that scatters/dissolves on scroll.
  - **Orbit** — round avatars on dotted concentric orbit paths (a "people network"), with blue/black accent dots.
  - Hover a portrait for a glow + tooltip (name · role · company); hovering highlights its orbit ring.
- **GSAP + Lenis** — smooth scrolling, word-by-word headline reveals, scrub-highlighted manifesto, pinned horizontal members wall, animated counters, magnetic buttons, and a custom cursor.

## Run locally

It's a static site — serve the folder with anything, e.g.:

```bash
python3 -m http.server 4321
# then open http://localhost:4321
```

## Files

- `index.html` — markup for all sections
- `styles.css` — design system + layout
- `main.js` — Three.js hero, GSAP/Lenis interactions, and UI behavior

## Notes

- Portraits are placeholder Unsplash images (CORS-enabled); swap them in the `PEOPLE` / `GLOBE_IDS` lists in `main.js` for real member photos.
- Libraries load from CDN (Three.js r128, GSAP 3.12, Lenis).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
