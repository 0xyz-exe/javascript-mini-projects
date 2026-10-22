# NEXUS ARCADE

A free, browser-based arcade with **51 games** built using vanilla HTML, CSS, and JavaScript. No account, paid service, or backend required. Favorites, settings, and personal scores stay in this browser.

> Browser playability smoke checks currently pass for all 51 catalog entries. This verifies that each game opens, renders a visible play area, and accepts a basic interaction. It is not exhaustive verification of every rule, win/loss condition, device, or game edge case; see [Testing](#testing).

## Run locally

Use Python's built-in static server from this directory:

```sh
python -m http.server 8000
```

Open <http://localhost:8000>. Keep the server running while you play. Opening `index.html` via `file://` is not supported consistently by browsers.

## Game collection

| Game | Game | Game |
|---|---|---|
| Snake Classic | Tetris Blocks | Memory Match |
| Tic-Tac-Toe | Rock Paper Scissors | 2048 |
| Breakout | Sky Hopper | Minesweeper |
| Whack-a-Mole | Simon Memory | Reaction Time |
| Neon Pong | Asteroid Drift | Space Invaders |
| Neon Runner | Dodge the Drop | Target Practice |
| Brick Bouncer | Sliding Fifteen | Lights Out |
| Word Guess | Hangman | Code Breaker |
| Four in a Row | Reversi | Nim |
| Number Guess | Math Sprint | Anagram Rush |
| Blackjack | Higher or Lower | Dice Duel |
| Five Dice | Coin Toss Streak | Number Sequence |
| Pattern Recall | Typing Sprint | Click Rush |
| Color Reflex | Grid Chase | Space Miner |
| Mini Sudoku | Word Search | Tower of Hanoi |
| Bubble Pop | Mini Checkers | Key Sequence |
| Color Match | Reaction Duel | Safe Cracker |

## Browse and save

- Search games by title, category, or description; combine search with category filters.
- Sort by featured order, name, or recently played.
- Save favorites. Reopen recently played games.
- View local personal-best scores and achievements.
- Change the theme and sound setting.
- Reset stored data from **Settings → Reset data**; confirmation required.

## Controls

Game controls and instructions appear on each game page. Most canvas games use arrow keys, WASD, Space, mouse, or touch; puzzle and word games use on-screen buttons and form inputs. Press **Escape** to return to the library. Some two-player games are local pass-and-play.

## Project files

```text
16-nexus-arcade/
├── index.html          # Page shell and script/style references
├── styles.css          # Responsive arcade and game styling
├── app.js              # Navigation, catalog shell, storage, original 12 games
├── extra-games.js      # 39 additional game records and implementations
└── tests/
    ├── smoke.test.cjs
    └── playability.test.cjs
```

No framework, build system, remote asset, or runtime package is required by the website. The optional browser QA scripts use Node.js and Playwright; see below.

## Local storage

The app writes a versioned `nexus-arcade-v1` record to `localStorage`. It contains favorites, recent games, scores, and preferences. Storage may be unavailable in private browsing or restricted browser configurations. Data does not sync between browsers or devices and is not a global leaderboard.

## Testing

The app was manually/browser-smoke-checked during development:

- **51 catalog cards**, **51 unique IDs**.
- Each entry navigated to a game screen with a visible game area.
- A browser automation sweep exercised a basic input on each game.
- Browser-side JavaScript errors were checked in targeted browser runs.
- `node --check` passed for `app.js`, `extra-games.js`, and test scripts.

The scripted Playwright sweep is still being stabilized; do not treat `tests/playability.test.cjs` as a passing test yet. Its current navigation/error-capture behavior can produce a stale or cross-navigation error result. The individual games have not had exhaustive rules, scoring, touch, responsive, or win/loss testing. Fix and run that test before describing full automated game QA as passing.

Optional test dependency and browser setup (run at the repository root):

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node projects/16-nexus-arcade/tests/playability.test.cjs
```

The existing repository test script does not include the `.cjs` arcade tests. No npm script is provided here; run the command above directly. The test assumes `playwright` is resolvable from the repository root.

## Known limitations

- Local-only scores; no accounts, online play, or shared leaderboard.
- Several games are compact casual implementations, not feature-identical versions of commercial arcade games.
- Some games need deeper rules and lifecycle QA. The catalog smoke pass verifies basic loading/input, not comprehensive correctness.
- Keyboard/gameplay controls may not be supported identically on every mobile browser. Use visible touch controls when provided.
- The standalone project is under `projects/16-nexus-arcade/`; serve that folder as the document root.

## Publish on GitHub Pages

1. Push the repository to GitHub through your normal review workflow.
2. In repository **Settings → Pages**, choose **Deploy from a branch**.
3. Choose the branch, then set the publishing folder to `/ (root)` or `/docs`.
4. Because this arcade lives under `projects/16-nexus-arcade/`, the straightforward option is GitHub Pages publishing from the repository root; then visit:
   `https://<owner>.github.io/<repository>/projects/16-nexus-arcade/`
5. Confirm the page and game assets load from that URL. This project has not been published or deployed by this change.

For a dedicated project-root Pages site, copy the contents of this folder into the repository root (or configure a deployment workflow to publish this directory). Do not add an unnecessary build step.

## Adding a game

1. Add a unique ID, title, category, instructions, description, icon, and two CSS colors to `EXTRA_GAMES` in `extra-games.js`.
2. Add its gameplay/lifecycle case to `playExtra()`.
3. Check it opens from the library, accepts its documented input, cleans up after navigation, and has meaningful completion/restart behavior.
4. Run the catalog/playability checks and manually verify the specific rules and mobile layout.

## License

The parent repository is MIT-licensed. Refer to its root `LICENSE` for the applicable license terms.
