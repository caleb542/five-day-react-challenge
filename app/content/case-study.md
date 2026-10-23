# Five Day React Challenge

Oct 22, 2026

Five React projects in five days, each built from a blank project without a code assistant, deployed through the Day 0 pipeline, and checked for accessibility before it counts.

## Rules: what makes a day count

A day counts only when all four conditions are met.

1. **Blank project.** Each day starts from a new project: `npm create vite@latest` (React, JavaScript) on Days 1 to 4, Next.js on Day 5.
2. **No code assistant during the build.** Documentation (MDN, React, Bootstrap, library docs) is allowed. A review of the finished code afterward is allowed, with every change typed by hand.
3. **Timed core.** The core build has a target time. Elapsed time is measured from git commits (see Timing with git), and a missed target is recorded, not hidden.
4. **Deployed and checked.** The project is deployed by pushing to its repository (Day 0 pipeline), has a README, and has passed the accessibility gate for that day.

**Styling is Bootstrap 5.** The challenge is about React, not CSS. Bootstrap is installed from npm on Day 1 and its stylesheet is imported once. Layout, forms, cards and buttons use Bootstrap classes, with at most one small override file of about 30 lines. Bootstrap's own JavaScript bundle is not used, because it changes the DOM that React renders. Interactive components are written in React (Days 2 and 4) or come from React-Bootstrap (Day 3).

### Accessibility gate, every day
Bootstrap styling does not make a component accessible, so the full gate applies:

- Every feature works with the keyboard alone, with a visible focus indicator.
- An axe DevTools or Lighthouse accessibility run shows no unresolved findings; any left open are listed in the README.
- The page is usable at 200% zoom.
- The main flow is spot-checked with NVDA.
- Each accessibility issue found in Bootstrap output goes in the README, with the fix.

## Timing with git

The clock is the commit history. The start and the end of the core build are commits, so no separate timer is needed.

1. **Start.** Before any scaffolding: `git init`, then `git commit --allow-empty -m "start: day N"`. This commit is the start time. If a scaffolder refuses a non-empty folder, scaffold into a new folder and move the `.git` directory into it.
2. **Steps.** One commit per bullet of the core list, prefixed `core:` (for example `core: fetch with loading and error states`), using `git add .` and `git commit -m "..."`.
3. **End.** When the last core bullet works: `git commit -m "core: done"`, then `git tag core-done`. Later work is prefixed `extend:` and does not count toward the core time.
4. **Time per step**, from the first commit:

```sh
git log --reverse --format='%at|%s' | awk -F'|' 'NR==1{t0=$1} {d=$1-t0; printf "%3d min %02d s  %s\n", d/60, d%60, $2}'
```

5. **Core time**, start to tag:

```sh
echo "$(( ( $(git log -1 --format=%at core-done) - $(git log --reverse --format=%at | head -1) ) / 60 )) min"
```

The per-step output shows where the time went, which is the useful part when a target is missed. Both outputs go in the README, and the core time goes in the scoreboard.

**Limits.** Commit timestamps can be edited, so the record rests on honest use, and history is not rewritten after a run (no `rebase`, no `--amend` on dated commits). A break longer than a few minutes gets an empty `pause` commit and an empty `resume` commit, and the gap is subtracted by hand.

## Scoreboard

Core targets are the timed part. Each day is budgeted at about five hours including polish, deployment and the README, an assumption to adjust to the real schedule.

| Day | Project | Core target | Core actual | Live URL | Accessibility gate |
| --- | --- | --- | --- | --- | --- |
| 0 | Case study site and pipeline | 2.5 h |  |  |  |
| 1 | Searchable list with fetch | 30 min |  |  |  |
| 2 | Accessible form and dialog | 45 min |  |  |  |
| 3 | React-Bootstrap components and audit | 45 min |  |  |  |
| 4 | Routing, shared state, focus management | 60 min |  |  |  |
| 5 | Next.js site on Netlify | 60 min |  |  |  |

## Day 0: Case study site and pipeline

**Goal:** a live page and a push-to-deploy pipeline in place before Day 1, so deployment adds no time and no first-time surprises to Days 1 to 5.

**Project:** `five-day-react-challenge`, the case study site. A Next.js site that renders the case study from Markdown files at build time and grows into the showcase for the week's work.

**Core (2.5 h)**

- A Next.js (App Router) project, `five-day-react-challenge`, with `content/case-study.md`. The Brief section is written from this plan and committed first.
- A landing route that renders `case-study.md` at build time with a Markdown renderer that does not output raw HTML by default (`react-markdown`), and the Bootstrap 5 stylesheet imported in the root layout. No client-side fetch.
- A GitHub repository connected to a Netlify site: a push to `main` deploys, and a pull request gets a deploy preview. Netlify detects Next.js, and the current Netlify docs are the reference for the settings. The first Next deploy happens here, not on Day 5.
- Pipeline test for Days 1 to 4: a throwaway Vite React project in its own repository and Netlify site, with a `netlify.toml` (build command `npm run build`, publish directory `dist`, and a redirect of all paths to `/index.html` with status 200 so direct visits to a route work). This file is the template for Days 1 to 4.

**Repository layout.** One repository per day (Days 1 to 5), each connected to its own Netlify site, keeps every git history self-contained for timing. The portfolio page links to all five. Netlify's current build limits should be checked against six sites plus previews.

**Source of truth.** After Day 0, `content/case-study.md` in the repository is the source for results: scoreboard numbers and per-day notes are added by commit, and the page shows them. This doc stays the plan. The Brief is exported from this doc once and checked against it (tables, task lists, code spans).

**Local testing.** `npm run dev` or `netlify dev`. No separate server is needed.

### Accessibility gate (day-specific)

- The page has `lang`, a `title`, a skip link, landmarks ( `main`, `footer`), and exactly one `h1`, which is the Markdown's first heading.
- Heading levels from the Markdown do not skip.
- Code blocks that overflow are keyboard-scrollable, and tables scroll without breaking the layout.
- The content is present in the HTML without JavaScript.
- Usable at 200% zoom, with an axe run showing no unresolved findings.

### Done when

- [ ] Core build finished and time recorded
- [ ] Gate passed
- [ ] A push to `main` deploys the page, and a pull request produces a deploy preview
- [ ] The throwaway Vite project is live and a direct visit to a route works
- [ ] README written: how the pipeline works

## Day 1: Searchable list with fetch

**Goal:** the React fundamentals in a 30-minute core build.

**Project:** a recipe browser against a public JSON API (TheMealDB's free tier, or any public endpoint).

**Core (30 min)**

- Vite React project with Bootstrap installed and its stylesheet imported.
- Data fetched on mount, with loading and error states.
- Results rendered as Bootstrap cards in a grid, with stable keys.
- A text filter with a debounced input, using a custom `useDebounce` hook.

**Skills exercised:** `useState`, `useEffect` with cleanup and `AbortController`, controlled inputs, derived state, custom hooks.

**Extend (remaining time):** a sort control, an empty state, a detail panel.

### Accessibility gate (day-specific)

- The search input has a visible label.
- The result count and the loading and error states are announced through an `aria-live="polite"` region.
- Card links are keyboard reachable with a visible focus indicator.

### Done when

- [ ] Core build finished and time recorded
- [ ] Gate passed
- [ ] Deployed by pushing to the repository; the Netlify build passes
- [ ] README written: how to run, what was hard

## Day 2: Accessible form and dialog

**Goal:** controlled forms, validation and focus management written by hand.

**Project:** an "Add recipe" form with validation, plus a confirm-delete dialog.

**Core (45 min)**

- Form state held in a `useReducer`, with Bootstrap form classes (`form-control`, `is-invalid`, `invalid-feedback`).
- Validation on blur and on submit.
- An error summary at the top of the form that receives focus after a failed submit and links to each invalid field.
- A dialog component written in React, with no Bootstrap JavaScript: the native `<dialog>` element with `showModal()`, or a custom version with a focus trap.

**Skills exercised:** controlled inputs, `useReducer`, refs, `useEffect` for focus, event handling.

**Extend (remaining time):** a dynamic ingredient list (add and remove rows), a success toast.

### Accessibility gate (day-specific)

- Every input has a programmatic label.
- Errors are tied to their fields with `aria-describedby` and `aria-invalid`. Bootstrap's `invalid-feedback` is styling only and does not create that link.
- Dialog: focus moves in on open, stays inside, Esc closes it, and focus returns to the button that opened it.

### Done when

- [ ] Core build finished and time recorded
- [ ] Gate passed
- [ ] Deployed by pushing to the repository; the Netlify build passes
- [ ] README written, including the dialog's keyboard behavior

## Day 3: React-Bootstrap components and audit

**Goal:** component composition, and a measured comparison between library components and the hand-written Day 2 dialog.

**Project:** a "Collections" page with tabs, an accordion and a modal built from React-Bootstrap.

**Core (45 min)**

- React-Bootstrap installed alongside Bootstrap (one stylesheet import, no Bootstrap JavaScript bundle).
- Tabs for collections, an accordion for recipe details, and a modal for adding to a collection.
- Each component audited against the WAI-ARIA Authoring Practices pattern for it: roles, keyboard keys, focus behavior.
- Findings written in the README as a table: component, expected behavior, what the library does, fix if any.

**Skills exercised:** props and `children`, composition, controlled versus uncontrolled components, `useContext`.

**Extend (remaining time):** wrap the library's tabs in an own `Tabs` component that shares state through context and fixes any gap the audit found.

### Accessibility gate (day-specific)

- Tabs, accordion and modal each pass a keyboard-only run, with the audit table filled in from what was observed, not assumed.
- Modal focus return is compared directly with the Day 2 dialog.

### Done when

- [ ] Core build finished and time recorded
- [ ] Audit table complete for all three components
- [ ] Deployed by pushing to the repository; the Netlify build passes
- [ ] README written

## Day 4: Routing, shared state, focus management

**Goal:** a multi-page React app with shared state and accessible route changes.

**Project:** the recipe browser extended with a detail route and a favourites page.

**Core (60 min)**

- React Router with three routes: list, detail (`/recipe/:id`) and favourites.
- Favourites held in context with a reducer and persisted to `localStorage`.
- A skip link at the top of every page.
- On each route change, focus moves to the page's main heading and the document title updates.
- Bootstrap navbar and cards for layout.

**Skills exercised:** routing, route parameters, `useContext` with `useReducer`, `useEffect` on navigation, `localStorage` persistence.

**Extend (remaining time):** a 404 route, a lazy-loaded route with `Suspense`.

### Accessibility gate (day-specific)

- The skip link works and is visible on focus.
- Each route has a unique document title and one `h1`.
- The favourite toggle uses `aria-pressed`, and adding or removing is announced through a live region.

### Done when

- [ ] Core build finished and time recorded
- [ ] Gate passed
- [ ] Deployed by pushing to the repository; the Netlify build passes
- [ ] README written

## Day 5: Next.js site on Netlify

**Goal:** a three-page Next.js site deployed in 60 minutes, then the week's components gathered into one folder.

**Project:** a small site (home, list, dynamic detail) using the same recipe data, styled with Bootstrap.

**Core (60 min)**

| Step | Budget |
| --- | --- |
| Scaffold with `create-next-app` (JavaScript) and import the Bootstrap stylesheet in the root layout | 5 min |
| Shared layout with navigation, using `Link` | 10 min |
| Three pages, including a dynamic `[slug]` route | 20 min |
| Data fetched in a server component from static JSON or a public API | 15 min |
| `next build` passing, deployed to Netlify by pushing to the repository | 10 min |

Scaffolder prompts and deployment defaults change between releases, so the current Next.js and Netlify quickstarts are the reference at the start of the run.

**Skills exercised:** file-based routing, layouts, server versus client components, data fetching, build and deploy.

### Afternoon: component folder
Move the reusable pieces from Days 1 to 4 (form field, dialog, tabs, live-region announcer, skip link) into one `components` folder, with a README table: component, keyboard behavior, WCAG criteria addressed, tests run. This is the seed of the accessible component library, and it is shown on the case study site after the week (see Showcase).

### Accessibility gate (day-specific)

- Landmarks are present (`header`, `nav`, `main`, `footer`), with one `h1` per page.
- Each page has a unique title.
- The skip link works and a keyboard-only pass covers every page.

### Done when

- [ ] Core build finished and time recorded
- [ ] Gate passed
- [ ] Deployed by pushing to the repository; the Netlify build passes
- [ ] Component README table written

Nuxt is outside this week. It enters the plan only when a posting names Vue or Nuxt.

## Showcase, after the week

After Day 5, the component folder is mounted as live demos on a `/components` route of the case study site. Each demo shows the component, its keyboard behavior, the WCAG criteria addressed, and the tests run. The five projects appear as cards on the landing page, and each Process entry links to that day's repository and live site.

The first version of the site stays minimal: it renders `case-study.md` and the five cards. The frontmatter-driven scoreboard and the screenshots are added after Day 5.

## Pipeline extensions, after the week

Day 0 builds the minimal pipeline: Git deploy and deploy previews. Afterward, checks can be added to it: lint, tests and axe-based accessibility tests run in GitHub Actions before a deploy, and Lighthouse CI scores on each deploy. The goal of a Next or Nuxt site live on Netlify in about 60 minutes stays on the list as a separate timed run, using the same git timing method.

