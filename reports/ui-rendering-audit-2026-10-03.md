# Website UI and Rendering Audit

Date: 3 October 2026 (UTC)

Scope: CSS, layout, usability and rendering across the current Haris Aslam website. Business positioning, URLs, metadata, schema, robots directives, verification tags, GA4, contact routes and advertising systems are outside the change scope and must remain preserved.

## Executive finding

The client screenshot is the `/use-cases` flagship block. The visible text matches `v3UseLibrary()` and does not establish a browser, device model or horizontal-overflow defect.

The blank continuation is not missing content. On the live production release, `.v3-library-browser` contains all 79 public cases but is initially assigned `opacity: 0` by the shared section reveal system. At a 1363 x 936 Chromium viewport it measured about 10,170px tall and remained transparent until a subsequent normal scroll caused the observer to mark it visible. The percentage-based observer threshold becomes increasingly fragile as the section grows on narrow screens.

The repair removes section-level content hiding. Motion can no longer determine whether substantive content is visible.

## Findings and repair status

| Severity | Route or family | Before cause | Repair |
|---|---|---|---|
| Critical | `/use-cases` | `site-ui.js` added `.ui-reveal` to the entire library; duplicated V2/V3 CSS set `opacity: 0` until an observer fired | Removed the section-level reveal observer and the content-hiding CSS |
| High | V3 page family | Page-wide `main { overflow: hidden }` could conceal component defects | Winning V3 rule now leaves page overflow visible; component rules own containment |
| High | Rental flagship | Problem map and market funnel placed minimum width and overflow on the same oversized element | Reflowed the problem map and funnel within their own layouts at tablet/mobile widths |
| High | Rental flagship | AI-control grid used a 720px mobile minimum width without a local scroller | Reflowed controls to one mobile column |
| High | AI Transformation | Agent stack used a 720px minimum inside an ancestor with hidden overflow | Reflowed the architecture rows; removed narrow-width clipping |
| Medium | `/use-cases` | Filter chips had small text and no 44px minimum target | Added 44px minimum targets, larger labels and spacing |
| Medium | `/use-cases` | Flagship journey relied on narrow inline flex/scroll behavior | Reflowed the five meaningful steps into a bounded five-column mobile grid |
| Medium | V4 diagrams | Several explanatory labels rendered around 9-11px | Raised meaningful component labels and line heights without scaling the component |
| Medium | Mobile navigation | Escape worked, but the overlay did not contain keyboard focus | Added an ARIA control relationship and Tab/Shift+Tab containment while open |

## Template inventory

The release contains 119 indexable routes across distinct families, not one shared page layout:

- V3 homepage, use-case index, AI index and insights index
- 66 V3 case/detail routes, including special rental and AI templates
- Pilot track-record index
- Base long-report cases, track-record details, insight articles and standard content pages
- Business Performance and other special entry pages

## Verification boundary

The available cloud browser exposes Chrome only. Local Playwright libraries are present but Chromium, Firefox and WebKit executables are not installed. The earlier blocked data-URL/iframe responsive workaround was not reused.

Therefore:

- Chromium desktop can be verified through ordinary top-level HTTPS rendering.
- Narrow phone, large phone, tablet, Firefox, WebKit and actual Safari/iOS must remain `Not tested` unless a supported native capability becomes available.
- WebKit, if later available, would be relevant approximation evidence only and not proof of actual Safari/iOS behavior.

## Coverage matrix

| Route or family | Engine or evidence | Viewport | Status | Notes |
|---|---|---:|---|---|
| `/use-cases` before | Client still image | 757 x 1600 image pixels | Fail | Large blank continuation after flagship; browser/device unknown |
| `/use-cases` before | Chromium | 1363 x 936 CSS px | Fail | Library DOM present at `opacity: 0` before scroll |
| Representative production routes before | Chromium | 1363 x 936 CSS px | Pass | No document-level desktop overflow on the audited sample |
| Narrow phone | Native engine | 320 x representative height | Not tested | Supported native responsive runner unavailable |
| Larger phone | Native engine | 390 x representative height | Not tested | Supported native responsive runner unavailable |
| Tablet | Native engine | representative tablet width | Not tested | Supported native responsive runner unavailable |
| Firefox | Firefox | representative widths | Not tested | Executable unavailable |
| WebKit | WebKit | representative widths | Not tested | Executable unavailable; would not prove Safari/iOS |
| Safari/iOS | Actual Safari/iOS | representative device | Not tested | Requires a small real-device review |

Preview and final production evidence are added after the protected preview and public release are verified.
