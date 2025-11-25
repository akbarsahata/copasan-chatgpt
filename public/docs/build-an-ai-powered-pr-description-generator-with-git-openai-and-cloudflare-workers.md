# Build an AI-Powered PR Description Generator with Git, OpenAI, and Cloudflare Workers

---
![artificial-intelligence](https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1)
---

If you've ever stared at a GitHub PR wondering how to summarize your recent commits, this project is for you. In this post, I'll walk you through how I built **pr-desc-ai** — an AI-powered tool that takes your Git commit messages and turns them into high-quality, human-friendly pull request descriptions.

The best part? It's built with a modern stack: TypeScript, Cloudflare Workers, OpenAI, and even comes with a VSCode extension. It's also structured as a monorepo managed by Turborepo.

---

## 🏛 Project Overview

**pr-desc-ai** helps you:

* Parse Git commits from your local repository
* Send them to a Cloudflare Worker that uses LLMs (like OpenAI's GPT)
* Get back a concise and meaningful PR description
* Use it via CLI or directly inside VSCode

### Monorepo Structure

```bash
pr-desc-ai/
├── git-parser/          # Node.js CLI tool
├── inference-worker/    # Cloudflare Worker as backend API
└── vscode-extension/    # Optional VSCode integration
```

---

## 🤝 Step-by-Step Guide

### 1. Scaffold the Monorepo with Turbo

```bash
mkdir pr-desc-ai && cd pr-desc-ai
pnpm init -y
pnpm add -D turbo
```

Then add a `turbo.json` in the root:

```json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": []
    }
  }
}
```

Update your `package.json` to enable workspaces:

```json
{
  "name": "pr-desc-ai",
  "private": true,
  "workspaces": ["git-parser", "inference-worker", "vscode-extension"],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev"
  }
}
```

---

### 2. Create the Git Parser CLI

In `/git-parser`, write a script that runs this:

```bash
git log origin/main..HEAD --pretty=format:"%s"
```

Then send the commits to the backend using `fetch` or `axios`.

Key tools:

* `execa` to run git commands
* `clipboardy` to copy result
* `commander` for CLI flags

---

### 3. Build the Cloudflare Worker

In `/inference-worker`:

```bash
npm create cloudflare@latest
# Choose 'hello world' template
```

Then:

* Install `Hono.js` for routing (optional)
* Create `/generate` POST endpoint
* Accept `{ commits: string[] }`
* Generate prompt and send it to OpenAI

```ts
const prompt = `Write a PR description for these commits:\n\n${commits.join('\n')}`
```

Deploy with:

```bash
wrangler publish
```

Don't forget:

```bash
wrangler secret put OPENAI_API_KEY
```

---

### 4. Optional: Add a VSCode Extension

Use `yo code` to bootstrap:

```bash
npm install -g yo generator-code
yo code
```

In `src/extension.ts`:

* Read git commits (from workspace folder)
* Send them to the inference-worker
* Show the response in an input box or paste it directly

Make it configurable:

```json
{
  "prGen.apiEndpoint": "https://your-cloudflare-endpoint",
  "prGen.apiKey": "your-api-key"
}
```

---

## 🌐 Hosting & Deployment

Use Cloudflare Workers and Pages (optional) to host your API and docs.

---

## 🚀 Final Thoughts

This was a fun and practical weekend project that helped me:

* Learn Cloudflare Workers and Wrangler
* Build and deploy an OpenAI-powered microservice
* Use Turborepo for real-world monorepo dev
* Create tools I can use daily as a developer

If you're curious about building AI-native developer tools, this kind of project is a fantastic place to start.

Happy shipping!

*Repo: [github.com/akbarsahata/pr-desc-ai](https://github.com/akbarsahata/pr-desc-ai)*
