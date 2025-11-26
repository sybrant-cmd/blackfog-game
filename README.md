# BlackFog TTX — Linear, Non-AI Build

This build includes:
- Linear scenarios and injects (no branching logic in the UI)
- Modernised dark UI for facilitator and players
- BroadcastChannel-based multiplayer
- Improved AAR (pattern-based summary, no AI calls)
- News ticker in facilitator view (scenario and inject events)
- More tolerant player presence (avoids marking players offline too aggressively)

## Files

- index.html       — Facilitator UI
- player.html      — Player UI
- engine.mjs       — Core engine (session, channel, votes, AAR)
- scenarios.mjs    — Static scenario pack (5 scenarios)
- favicon.ico      — Empty placeholder
- README.md        — This file

## Running

For local testing, serve files via a static web server (module imports require http://, not file://).

Example (Python 3):

```bash
python -m http.server 8000
```

Then open:

- Facilitator: http://localhost:8000/index.html?s=test
- Player:      http://localhost:8000/player.html?s=test

For GitHub Pages, upload all files to the repo root and enable Pages.
