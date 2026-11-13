# KidPool landing page

React 18 + Vite + three.js. Every section has a 3D or interactive moment.

## Run it

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

Build for production with `npm run build`; the site lands in `dist/`.

## Where things live

```
src/
  main.jsx              app entry
  App.jsx               page order
  sections/             one file per page section (Header, Hero, Trust, HowItWorks,
                        Features, Preview, Safety, UseCases, FAQ, FinalCTA, Footer)
  scenes/               three.js scenes (HeroScene, StepsScene, CommunityScene, TurntableScene)
  hooks/useThreeScene.js   renderer setup, resize, pause off-screen, pointer + drag, cleanup
  hooks/useTilt.js         CSS 3D tilt for cards and tiles
  lib/threeKit.js          brand colours and toy-style 3D builders (car, house, school, tree)
  components/ui.jsx        icons, wordmark, placeholder label
  styles/kidpool.css       design tokens and all styles
```

## Before launch

- Swap `--lime` in `src/styles/kidpool.css` (and `C.lime` in `src/lib/threeKit.js`) for the exact Figma colour token.
- Replace every yellow "Placeholder:" label with confirmed product details.
- Point the "Find your school" and "Log in" links at real routes.
- Fonts load from Google Fonts (Bricolage Grotesque and Inter); swap in the Figma font if it differs.
