# End-to-End Testing in a Next.js Monorepo with Playwright and Turborepo

End-to-end (E2E) testing is a crucial part of ensuring a web application functions correctly. If you’re using **Next.js inside a monorepo managed with Turborepo and pnpm**, integrating **Playwright** for E2E testing can be incredibly powerful. This guide walks through the best practices for setting up Playwright in such an environment, ensuring a clean test environment each time.

---

![checklist-image](https://images.pexels.com/photos/8850706/pexels-photo-8850706.jpeg?auto=compress&cs=tinysrgb&w=600&dpr=1)

---

## **Project Setup**

To keep things modular, place the **Playwright tests in a separate package** within your monorepo. Your project structure might look like this:

```
/apps
  /web  (Next.js app)
/packages
  /e2e-tests  (Playwright tests)
/turbo.json
/pnpm-workspace.yaml
```

Inside `/packages/e2e-tests/package.json`, define dependencies:

```json
{
  "name": "e2e-tests",
  "private": true,
  "devDependencies": {
    "@playwright/test": "^1.x"
  },
  "scripts": {
    "test": "playwright test"
  }
}
```

Ensure `pnpm-workspace.yaml` includes the package:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## **Configuring Playwright to Start Next.js**

In `playwright.config.ts`, define how Playwright launches the Next.js app:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm --filter web dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

For testing **built** Next.js apps, modify:

```ts
webServer: {
  command: "pnpm --filter web start",
  url: "http://localhost:3000",
  reuseExistingServer: !process.env.CI,
},
```

---

## **Ensuring a Clean Test Environment**

If your tests depend on a database, always start with a **clean state**. Use a script to teardown, migrate, and seed your database before each test.

Modify `package.json` inside `e2e-tests`:

```json
{
  "scripts": {
    "pretest": "pnpm db:reset",
    "test": "playwright test"
  }
}
```

Example reset script (`scripts/db-reset.sh`):

```sh
pnpm db:teardown && pnpm db:migrate && pnpm db:seed
```

Then, define the script in `package.json`:

```json
{
  "scripts": {
    "db:reset": "sh ./scripts/db-reset.sh"
  }
}
```

Run the reset script before each test:

```ts
import { test } from "@playwright/test";
import { execSync } from "child_process";

test.beforeEach(() => {
  execSync("pnpm db:reset", { stdio: "inherit" });
});
```

---

## **Running E2E Tests in CI/CD (GitHub Actions)**

To automate tests, add `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  e2e:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Install pnpm
        run: corepack enable && corepack prepare pnpm@latest --activate

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build the app
        run: pnpm --filter web build

      - name: Run E2E tests
        run: pnpm --filter e2e-tests test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```

Adjust your **environment variables** accordingly.

---

## **Debugging with Traces**

Enable Playwright tracing to debug test failures. Update `playwright.config.ts`:

```ts
use: {
  trace: process.env.CI ? "retain-on-failure" : "on",
  video: "retain-on-failure",
  screenshot: "only-on-failure",
},
```

To inspect traces after a failed test:

```sh
npx playwright show-trace trace.zip
```

---

## **Running Tests Locally**

Run **Playwright UI mode** for interactive debugging:

```sh
pnpm --filter e2e-tests exec playwright test --ui
```

Run tests **headless**:

```sh
pnpm --filter e2e-tests test
```

---

## **Final Thoughts**

✅ **Keep Playwright tests in a separate package** within your monorepo  
✅ **Start Next.js automatically before tests**  
✅ **Reset the database before each test** to maintain data integrity  
✅ **Run E2E tests in CI/CD** with GitHub Actions  
✅ **Use Playwright’s trace debugging** to investigate failures  

Following these best practices ensures **reliable and reproducible** E2E tests in a Next.js monorepo setup with Turborepo and pnpm. 🚀

Are you using a similar setup? Let’s discuss your experience in the comments! 🔥

