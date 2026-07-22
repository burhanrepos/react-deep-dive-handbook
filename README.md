# React Deep Dive Handbook

A React + Vite handbook app with interactive topic navigation, search filtering, and light/dark mode.

The project is built with:

- React 19
- TypeScript
- Vite
- Tailwind CSS
- lucide-react icons

## Local development

**Prerequisite:** Node.js

1. Install dependencies:
   `npm install`
2. Start development server:
   `npm run dev`
3. Open the URL shown in the terminal (default `http://localhost:3000`).

## Build and preview

- Build for production:
  `npm run build`
- Preview the production build locally:
  `npm run preview`

## Quality

- Run TypeScript checks:
  `npm run lint`

## Deployment

A GitHub Actions workflow is included at `.github/workflows/deploy.yml` to build the app and deploy the `dist` folder to GitHub Pages.

## Notes

- No runtime API key is required to run this app locally.
- The app is fully client-side and does not depend on a backend server for the UI.
