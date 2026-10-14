# INT151 · Frontend Lab

A standalone Thai learning website based on the available INT151 notes and class transcripts. Eight topic modules contain 46 activities, 17 coding exercises, predictions, progressive hints, source references, code completion and browser-local progress.

## Open locally

```sh
npm run serve
# http://127.0.0.1:8151
```

The app is buildless and deployable as static files. It needs HTTP (ES modules and workers do not run correctly from file://). CodeMirror and Acorn are bundled in vendor/: the deployed app does not need npm or a CDN. Existing INT151 files and the INT161 project are separate and untouched.

## Curriculum

| Module | Source topics | Activities |
| --- | --- | --- |
| W1 | JavaScript values, conditions, functions and loops | 5 |
| W3 | References, Date, RegExp and JSON | 5 |
| W4 | Client/server, DOM tree, nodes and selectors | 5 |
| W5 | DOM creation, live/static collections, dataset and classList | 5 |
| W6 | Event listeners, capture/bubble and removal | 5 |
| W7 | Event object, delegation and input | 5 |
| W8 | Form submission, preventDefault and input validation | 5 |
| W9 | Cookies/Web Storage selection, JSON preferences and fallback | 11 |

Labels follow the source topic weeks, not a claim of consecutive sessions. Form/email exercises are teaching adaptations; the email pattern intentionally checks the stated exercise rules rather than every valid email format. Promise/Fetch units are not invented from future items in the course outline.

## Editing and learning

- Continue from the last activity; progress and code use the separate `int151-learning-v1` localStorage key.
- JavaScript and HTML editor tabs support syntax highlighting and completion. Ctrl+Space opens suggestions, Enter/Tab accepts, Esc dismisses, Ctrl/Cmd+Enter runs.
- JavaScript exercises run in disposable module workers with a timeout.
- DOM exercises use a real iframe with sandbox="allow-scripts", no same-origin access, and a CSP blocking network requests and form submissions from that frame. Student HTML is inserted as markup; scripts belong in the JavaScript editor.
- DOM loops and function entry points receive cooperative checkpoints using Acorn. This helps with accidental JS loops/recursion; it is not an adversarial CPU/memory isolation boundary and cannot interrupt every expensive native operation.
- Storage demonstrations use a separate Storage facade with normal string conversion/get/set/remove/clear operations. A marked storage activity saves its simulated local data under its own lesson key; session data is fresh for each sandbox run. These are teaching fixtures, not access to actual browser cookies or unrestricted native local/sessionStorage.
- Checking exercises executes fresh code and displays each Expected/Actual result. DOM checks interact with elements; checking can change the preview state. Run again for a fresh preview.
- Raw transcripts are not published. `docs/sources.json` records the local source filenames and checksums; each activity identifies the relevant source.

## Validate

```sh
npm test
# Open /tests/browser.html and click Run browser checks
```

Node tests cover curriculum, persistence, JS examples and solution/starter grading, Storage semantics and DOM instrumentation. Browser checks execute all examples/solutions, prove starters fail, test iframe isolation and check worker/DOM loop protection. Browser QA also checked completion acceptance, code persistence after reload, event log order and the 390px responsive shell.

The viewport-emulation tool did not paint the opaque sandbox iframe at its simulated size; its DOM and interactions were verified at a native viewport, while the mobile shell/navigation were checked at 390px. The sandbox security settings were retained.

## Rebuild bundled dependencies (maintainers only)

```sh
npm ci
npm run build:editor
npm run build:parser
```

Static hosting needs index.html, lesson.html, css/, js/, engine/, content/ and vendor/. Do not upload node_modules or private course transcripts. GitHub Pages deployment publishes only the static app via the `Deploy Pages` workflow. The repository excludes node_modules and raw transcripts.

The Storage module starts with quiz preparation for 14 October 2026, based on the 7 October transcript: six activities with a comparison, cookie lifecycle/attributes, trace example, cookie parsing exercise and twelve code-based multiple-answer questions with exact-set scoring and explanations for every option. These are study predictions, not actual exam questions.
