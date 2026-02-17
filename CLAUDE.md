# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Novelizer is a cross-platform desktop application built with **Tauri 2** (Rust backend) and **React 19 + TypeScript** (frontend), using **Vite** as the build tool and **pnpm** as the package manager.

## Common Commands

```bash
# Full desktop app development (starts Vite + compiles Rust + hot reload)
pnpm tauri dev

# Build native app bundle (.dmg, .exe, .AppImage)
pnpm tauri build

# Frontend only
pnpm dev              # Vite dev server on localhost:1420
pnpm build            # TypeScript check + Vite production build

# Type checking
npx tsc
```

## Architecture

- **`src/`** — React/TypeScript frontend. Entry point is `main.tsx` → `App.tsx`.
- **`src-tauri/`** — Rust backend. Entry point is `main.rs`, business logic in `lib.rs`.
- Frontend invokes Rust commands via `invoke()` from `@tauri-apps/api/core` (e.g., `invoke("greet", { name })`).
- Rust commands are registered in `lib.rs` using `#[tauri::command]` and wired up in `run()`.
- **Capabilities** (`src-tauri/capabilities/default.json`) control what permissions the app has at runtime.
- Tauri config (`src-tauri/tauri.conf.json`) defines the build pipeline: Vite builds to `dist/`, Tauri bundles it with the Rust binary.

## Design System

UI design is available in Figma: https://www.figma.com/design/tEa3hRr3j8T4lWGAugX8nr/Novelizer

The design includes:

- Desktop layout (1440x1082) and iPad layout (834x1194)
- Component system: Tree elements, Block editor, Status bar, Left sidebar, Header, Footer
- Novel/story writing editor with hierarchical file navigation, numbered block-based editing, and timeline/chapter view

**Styling**: Use **Tailwind CSS** for all styling. Use **Lucide Icons** for iconography.

## TypeScript Config

Strict mode is enabled with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`.

## Obsidian Vault

Obsidian vault path: /Volumes/External/Novelizer-obsidian
Project note default path: /Volumes/External/Novelizer-obsidian/Novelizer
