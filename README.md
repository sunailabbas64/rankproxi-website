# Rank Proxi — Website

A fast, dependency-free multi-page marketing site for **Rank Proxi** (Local SEO · GEO · AI SEO),
led by Sunail Abbas. Brand color: **`#01a7a3`**.

## Run it locally

```powershell
node server.js
```

Then open **http://127.0.0.1:4173/**

Use a different port if needed:

```powershell
$env:PORT=8080; node server.js
```

The server supports clean URLs (`/services`, `/pricing`) as well as `.html` paths. You can also open
the `.html` files directly — the site is fully static.

## Pages

| Page | File | What's on it |
| --- | --- | --- |
| **Home** | `index.html` | Hero, founder intro, problem stats, three channels, 9 services preview, AI Trust Framework, what we don't do, 5-stage process, case study preview, testimonials, FAQ preview, CTA |
| **Services** | `services.html` | All 9 services in detail with checklists, what's always included, process, CTA |
| **Case Studies** | `case-studies.html` | Aggregate stat bar, 6 verified case studies, 2 live dashboard snapshots, methodology, guarantee, CTA |
| **Pricing** | `pricing.html` | 4 plan stages ($499 / $799 / $1,199 / Custom), guarantee band, results, comparison table, 7 pricing FAQs, CTA |
| **About** | `about.html` | Founder story + portrait, proven-at-scale stats, values, AI + human layers, experience timeline, skills & languages, education, CTA |
| **Contact Us** | `contact.html` | 5-step "what happens next", audit form, contact tiles, guarantee, testimonial, CTA |
| **FAQs** | `faqs.html` | 10 main FAQs + 4 objection-handling FAQs, all as accessible accordions |

Shared assets: `styles.css`, `script.js`, `images/`, `server.js`.

## Images

All imagery lives in `images/`:

| File | Used for |
| --- | --- |
| `sunail-abbas.jpg` | Sunail's portrait — home hero card, home founder strip, About founder card, About team grid, Contact "Talk to a human" |
| `shokat-alam.jpg` | Shokat's portrait — About team grid (Founder) |
| `Rank Proxi-wordmark.png` | The Rank Proxi wordmark. **Not currently used** — it's yellow/white and clashes with the teal brand. Available if you want it in the header or footer. |

To swap a portrait, drop a new square image in with the same filename. The circular frame, teal ring and
responsive sizing are handled by CSS (`.avatar`, `.avatar-sm`, `.avatar-xs`).

## Structure

```
index.html            home
services.html         services
case-studies.html     case studies
pricing.html          pricing
about.html            about
contact.html          contact us
faqs.html             faqs
styles.css            design system + all components
script.js             theme, nav, reveal, counters, accordion, form
server.js             zero-dependency local static server
images/               portraits and logo
shots/                rendered preview screenshots
```

Every page shares the same header (7-item nav + Free Audit CTA) and footer, with the current page
marked via `class="active"` and `aria-current="page"`.

## Features

- **Brand system** — every accent derives from `#01a7a3` through CSS custom properties.
- **Light & dark mode** — follows the OS preference by default; the toggle remembers the choice in `localStorage`.
- **Responsive** — desktop, tablet and mobile layouts, with a slide-down mobile menu below 1080px.
- **FAQ accordions** — built on native `<details>`/`<summary>`, so they work with JavaScript disabled.
- **Animated counters** — stat numbers count up on scroll and format thousands with commas.
- **Contact form** — inline validation with per-field error messages and a success state.
- **Accessible** — semantic landmarks, skip link, visible focus rings, ARIA state on the menu and theme toggle, breadcrumbs on inner pages.
- **Reduced motion** — all animation is disabled automatically under `prefers-reduced-motion`.
- **No build step, no dependencies** — plain HTML, CSS and JavaScript.

## Editing content

- **Colors:** change `--brand`, `--brand-600`, `--brand-700` and `--brand-rgb` at the top of `styles.css`.
- **Navigation:** the header and footer nav blocks are repeated in each of the 7 HTML files — update all of them together when you add a page.
- **Contact details:** search for `sunailabbas64@gmail.com`, `+92 355 5703941`, `linkedin.com/in/sunail-abbas` and `rankproxi.com`.
- **Pricing:** plan cards live in `pricing.html`; the comparison table is directly below them.
- **Photo:** portraits are in `images/` — see the Images table above.

## Known follow-ups

- **The contact form doesn't send yet.** It validates and shows a success state client-side only. Point
  the `<form>` at a handler (Formspree, Netlify Forms, or your own endpoint) to receive submissions.
- **Replace the placeholder case-study data** if any client figures need updating, and add your
  Privacy and Terms pages if you want them in the footer.

## Dev capture helpers

Inert in normal use — they only activate with a query string, and were used to render `shots/`:

- `?shot=services` — scroll straight to a section on load.
- `?only=services` — render only that section (for screenshots).
