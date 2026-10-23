# Five Day React Challenge: case study site (Day 0)

The case study site for the Five Day React Challenge: five React projects in five days, each built from a blank project without a code assistant, timed from git commits, deployed by pushing to a repository, and checked for accessibility before it counts.

This repository is Day 0. It builds the live page and the push-to-deploy pipeline that the other days reuse. The challenge plan itself is the page this site renders.

- Live site: TODO: Netlify URL
- Repository: TODO: GitHub URL

## Stack

- Next.js 16.4.2, App Router, JavaScript, built with Turbopack
- Bootstrap 5.3, stylesheet only (no Bootstrap JavaScript bundle)
- react-markdown with remark-gfm (tables, task lists)
- Netlify, deployed from Git

## Run locally

```sh
npm install
npm run dev          # development server, http://localhost:3000
npm run build        # production build
npm start            # serve the production build
```

`netlify dev` also works. For performance measurements, use the production build (`npm run build`, then `npm start`) and not the development server, because the development server is unminified and inflates every metric.

## How it works

| File | Role |
| --- | --- |
| `app/content/case-study.md` | The case study. Source of truth for all content. |
| `app/page.js` | Server component. Reads the Markdown with `fs` at build time and renders it with react-markdown. |
| `app/layout.js` | Root layout: `lang`, metadata, Bootstrap import, skip link, footer, color-theme script. |
| `app/globals.css` | Project overrides: skip link and the completed-task style. Bootstrap provides everything else. |

The page is prerendered as static HTML (`next build` reports `/` as static). There is no client-side fetch, and the content is present in the HTML without JavaScript.

Markdown is rendered without raw HTML. react-markdown does not parse HTML, so an HTML comment in `case-study.md` would print as visible text.

Overrides passed to react-markdown through the `components` prop, so the Markdown file stays plain:

- `table`: wrapped in Bootstrap's `table-responsive` so wide tables scroll inside their own box.
- Task list items: content wrapped in a `label`, so each checkbox has an accessible name.

Dark mode: Bootstrap 5.3 switches themes with a `data-bs-theme` attribute on `<html>`, not with `prefers-color-scheme`. A small inline script in `layout.js` sets the attribute from the OS preference before first paint and updates it when the preference changes.

## Pipeline

TODO: complete after the Netlify connection is made.

- A push to `main` builds and deploys the production site on Netlify.
- A pull request produces a deploy preview.
- Netlify detects Next.js and runs `npm run build`. Node version: TODO.
- Days 1 to 4 use a Vite template with this `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The redirect makes a direct visit to a client-side route serve the app and not a 404.

Pipeline test: a throwaway Vite React project in its own repository and Netlify site. TODO: URL, and the result of visiting a nonexistent path directly.

## Timing

The clock is the git history. Day 0 started with an empty `start: day 0` commit, each step is a `core:` commit, and the end is `core: done` plus the tag `core-done`.

Breaks are recorded as empty `pause` and `resume` commits, and the gap is subtracted by hand. Timestamps are not rewritten.

```sh
# time per step, from the first commit
git log --reverse --format='%at|%s' | awk -F'|' 'NR==1{t0=$1} {d=$1-t0; printf "%3d min %02d s  %s\n", d/60, d%60, $2}'

# core time, start to tag
echo "$(( ( $(git log -1 --format=%at core-done) - $(git log --reverse --format=%at | head -1) ) / 60 )) min"
```

| | |
| --- | --- |
| Target | 2.5 h |
| Elapsed, start to `core-done` | TODO |
| Paused (subtracted) | TODO: 565 min logged earlier, plus the overnight gap |
| Core time | TODO |

Per-step output: TODO: paste the first command's output.

## Accessibility gate

| Check | Result |
| --- | --- |
| `lang`, unique `title`, one `h1`, `main` and `footer` landmarks | Pass (verified in the raw HTML with `curl`) |
| Heading levels do not skip (`h1`, `h2`, `h3`) | Pass |
| Content present without JavaScript | Pass (static prerender) |
| Lighthouse accessibility | 100 (production build, Brave) |
| WAVE | TODO: re-run on the final page (0 errors before the content trim) |
| Keyboard-only pass, visible focus, skip link | TODO |
| Overflowing code blocks and tables reachable by keyboard | TODO |
| 200% zoom | TODO |
| Light and dark themes, skip link in both | TODO |
| Reduced motion | TODO |
| NVDA spot check (skip link, landmarks, headings, table headers) | TODO |

### Findings and fixes

- **Task list checkboxes had no accessible name.** WAVE reported 25 missing form labels. `remark-gfm` renders `- [ ] text` as an input next to loose text. Wrapping the item content in a `label` through the react-markdown `components` prop fixed it, with no change to the Markdown.
- **Skip link was not keyboard reachable.** The first version used `visibility: hidden`, which removes an element from the tab order. It is now moved off-screen with `translate` and revealed on `:focus-visible`, and its transition is disabled under `prefers-reduced-motion`.
- **Bold lines acting as headings.** Stand-alone bold lines such as "Done when" were not headings, so heading navigation skipped them. They are now `###` headings.
- **Bootstrap dark mode did not follow the OS.** See "How it works".
- **HTML comments printed on the page.** See "How it works".

### Decisions

- The page has no navigation, so there is no `nav` landmark and no placeholder links. A link is added when its target exists.
- Checkboxes in the plan are interactive but their state is not saved. A reload restores the defaults from the Markdown. The only state with meaning on a public page is the author's progress, which is recorded by editing the Markdown and pushing.

## Performance

Lighthouse, mobile preset, production build served locally, run in Brave.

| Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- |
| 93 | 100 | 100 | 100 |

Run in Chrome on the same machine, the scores were 83 and 81 for Performance and Best Practices. A Kaspersky script injected into Chrome pages (an unminified, plain-HTTP `main.js`) caused the difference, so the Brave figures are the ones to read.

Remaining findings are the full Bootstrap stylesheet (render-blocking, about 29 KiB unused) and the Next.js client runtime. Neither is a Day 0 item.

Deployed site, measured with PageSpeed Insights: TODO.

## Known issues

- `npm audit` reports high-severity findings in a development-only dependency chain (`braces`). `npm audit --omit=dev` reports 0. `npm audit fix --force` is not used, because it proposes breaking downgrades.
- On Windows, git prints CRLF line-ending warnings. They are harmless.
- Import paths are case-sensitive on Netlify's Linux build and not on Windows, so a mismatched case in an import works locally and fails in the deploy.
- Checkbox state is not persisted (see Decisions).