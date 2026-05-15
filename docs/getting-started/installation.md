---
title: Installation
description: How to install and run Bulwark.
order: 2
---

# Installation

This guide walks you through running Bulwark, either via the **web setup wizard** (recommended for fresh installs) or with a fully env-driven configuration for read-only / immutable deployments.

## Prerequisites

- **Node.js** 18 or later (manual install only - the Docker image bundles its own runtime).
- A running **Stalwart Mail Server** instance with JMAP enabled (or use the built-in demo backend for development). If you don't have Stalwart installed yet, follow the [official installation guide](https://stalw.art/docs/category/installation) and then see [Stalwart Setup](/docs/getting-started/configuration/stalwart-setup) for Bulwark-specific configuration.

## Quickest path: Docker + setup wizard

The fastest way to a working webmail is the published Docker image. New in 1.6.4, you do **not** need to write `.env.local` first.

```bash
docker run -d -p 3000:3000 --name bulwark \
  -v bulwark-config:/app/data/admin \
  -v bulwark-state:/app/data/admin-state \
  ghcr.io/bulwarkmail/webmail:latest
```

Open `http://localhost:3000` and the web setup wizard guides you through:

- **Server** - probe one or more JMAP endpoints, optional auto-pick by email domain, Stalwart feature toggle
- **Auth** - OAuth2 / OIDC discovery and validation, or basic-auth fallback
- **Security** - generate or paste a `SESSION_SECRET`, opt into settings sync
- **Logging** - text or JSON, log level
- **Branding** - upload favicon, app logos, login logos, and company / legal URLs
- **Review** - grouped summary with an advanced toggle for the full config
- **Admin** - set the initial admin password and optionally drop a `.config-locked` marker so the config volume can be remounted read-only

The wizard writes to `ADMIN_CONFIG_DIR` (`/app/data/admin` in the container). Setting `JMAP_SERVER_URL` in the environment **skips the wizard** and uses env-managed configuration.

## Script Install

The legacy interactive setup script is still available if you prefer guided installation outside Docker:

```bash
curl -fsSL https://bulwarkmail.org/install | bash
```

You can also run it in preview mode:

```bash
bash setup.sh --dry-run
```

## Manual Install

### 1. Clone the Repository

```bash
git clone https://github.com/bulwarkmail/webmail.git
cd webmail
```

### 2. Install Dependencies

```bash
npm install
```

### 3. (Optional) Pre-seed Environment

You can skip this step and let the setup wizard configure the install on first launch. Only set environment variables when you want env-driven, immutable configuration:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set at minimum:

```env
JMAP_SERVER_URL=https://your-stalwart-server.com
APP_NAME=Bulwark
```

Environment variables are read at runtime, so you can reconfigure Docker deployments without rebuilding. When `JMAP_SERVER_URL` is set, the setup wizard is hidden.

### 4. Start the Server

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. If no `JMAP_SERVER_URL` is set, the setup wizard will walk you through the rest.

### Development Without a Mail Server

To develop the UI without an external mail server, use the built-in demo mode:

```bash
cp .env.dev.example .env.local
npm run dev
```

Log in with any username and password. Demo mode includes fixture data for emails, calendars, contacts, files, filters, identities, mailboxes, and vacation responses, providing a full-featured experience without a real JMAP server.

## Production Build

```bash
npm run build
npm start
```

The production server starts on port 3000 by default. Use the `PORT` environment variable to change it:

```bash
PORT=8080 npm start
```

## Updating

To update to the latest version:

```bash
git pull origin main
npm install
npm run build
```

Bulwark performs a server-side update check on startup and surfaces a non-dismissible update notice in-app when a new release is available.
