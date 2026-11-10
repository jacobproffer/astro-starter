# Astro Starter

Made with Astro and Tailwind.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm test`                | Build the site and run all Playwright tests      |
| `npm run test:a11y`       | Run only the accessibility tests                 |
| `npm run test:ui`         | Open Playwright's interactive UI mode            |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## ♿ Accessibility testing

Tests live in `tests/` and run against the production build (`astro build` + `astro preview`) using [Playwright](https://playwright.dev) and [axe-core](https://github.com/dequelabs/axe-core).

- `tests/a11y.spec.ts` scans every page in its `pages` list for WCAG 2.2 A/AA violations in light and dark mode, on desktop and mobile viewports. **Add new routes to that list as you build pages.**
- It also checks that the skip link is the first focusable element and jumps to `#content`.

The first time you run the tests on a new machine, install the browser:

```sh
npx playwright install chromium
```
