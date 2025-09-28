# Sparkpad

## A minimal MDX editor & demo consumer of AlmaProtoKit Design System

**Sparkpad** is a lightweight playground project built to demonstrate how the AlmaProtoKit design system
can be consumed in a real application.
It provides a simple MDX editor with live preview, using components, tokens, and theming from the design system.

### ✨ Features

- 📝 MDX editing with live preview
- 🎨 Design system integration — tokens, SCSS core, and Vue 3 components
- ⚡ Vite dev server with instant HMR
- 🧩 Example of monorepo consumer app (works alongside client, server, log-server)

### 🚀 Getting Started

```bash
# Clone the monorepo
git clone https://github.com/yamogoo/alma-proto-kit.git

# Go to Sparkpad client
cd alma-proto-kit/apps/sparkpad/client

# Install dependencies (workspace-aware)
pnpm install

# Start dev server
pnpm dev
```

Then open http://localhost:5041
in your browser.

### 🛠 Tech Stack

- Vue 3 + TypeScript
- Vite for dev/build
- MDX parsing & preview
- Pinia for state
- AlmaProtoKit Design System for UI foundation

### 📖 About

Sparkpad is not meant to be a full-featured editor — it’s a demo consumer app to validate:

- 💡 How a design system integrates into real products
- 🧪 How tokens and SCSS core flow into apps
- 🔍 How components behave in a working environment

### 📜 License

MIT — see [LICENSE](./LICENSE)
