# ProjectMatch

A team-building prototype for hackathons. Give it a project and a team, then simulate adding a teammate to see which gaps they cover and how the team score changes.

## Try the guided demo

The sample project is a 24-hour **AI Campus Assistant**. The starting team covers machine learning and frontend development. Compare a backend/cloud candidate with a cloud/DevOps candidate, then open the score breakdown. Both can help with infrastructure, but only one has an explicit backend domain in the sample data.

To explore a different project, switch to the custom workflow and enter your own brief. The scoring engine uses the same rules in both workflows.

## Run locally

Use Node.js 22.12 or newer and npm. From the repository root, run

```sh
npm install
npm run dev
```

Open **http://localhost:3000**. The Express server runs the API and Vite development middleware together. The guided demo and rule-based project extraction work without an API key. To enable Gemini-assisted extraction, set `GEMINI_API_KEY` in a local `.env` file and restart the server.

## How a score is produced

1. A project blueprint defines required capabilities and their priorities.
2. The engine compares the current team’s declared domains, skills, availability and interests with the blueprint.
3. Adding a candidate in a simulation recalculates the team score and identifies which gaps would close. A skill name by itself cannot establish a missing domain. The scores express the assumptions built into the demo.

| Start here | What it contains |
| --- | --- |
| [Scoring engine](src/engine/scoring.ts) | Team scoring, capability coverage and before/after comparisons |
| [Sample project and team](src/engine/seedData.ts) | The blueprint, teammates and candidates used by the guided demo |
| [Application](src/App.tsx) | Guided and custom workflows, simulations and score details |
| [Server](server.ts) | Project extraction endpoint, Gemini integration and rule-based fallback |

Run `npm run lint` to type-check the project and `npm run build` to bundle the client and server.
