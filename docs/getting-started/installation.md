---
title: Installation
description: How to install and run Bulwark.
order: 3
edition: full
editionNote: "This page installs Bulwark (not Lite). For static files with no Node process, see Bulwark Lite."
---

# Installation

There are two ways to configure Bulwark: the **web setup wizard**, which is right for a fresh install, or environment variables, which is right when the config has to be immutable or checked into a repository. This page covers getting to the point where either one applies.

If you want no server process at all, skip this page: [Bulwark Lite](/docs/getting-started/lite) is the same client as a folder of static files, and its own install is three steps on the [static hosting](/docs/deployment/static) page.

## Prerequisites

- A running **Stalwart Mail Server** with JMAP enabled, or the built-in demo backend if you're only poking at the UI. Bulwark needs Stalwart 0.16.6 or newer, and Stalwart 1.0 needs Bulwark {{BULWARK_VERSION}} or newer ([supported versions](/docs/getting-started/stalwart-setup#supported-versions)). No Stalwart yet? Follow the [official installation guide](https://stalw.art/docs/install/), then [Stalwart setup](/docs/getting-started/stalwart-setup) for the Bulwark-specific parts.
- **Node.js 20.9 or later**, for a manual install only. The Docker image ships its own Node 24 runtime, so ignore this if you're using the container.

## Quickest path: Docker + setup wizard

<img class="theme-light-only" src="/screenshots/light-setup-server.webp" alt="The setup wizard's server step, with the connection test passed" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-setup-server.webp" alt="The setup wizard's server step, with the connection test passed" width="5120" height="2880" />

The published Docker image is the shortest route to a working inbox, and there is nothing to write to `.env.local` first.

```bash
docker run -d --name bulwark -p 3000:3000 \
  -v bulwark-data:/app/data \
  ghcr.io/bulwarkmail/webmail:latest
```

The one volume keeps everything the app writes under `/app/data`: the admin config, its runtime state (session secret, setup token, audit log), synced user settings, the credentials users connect for plugins, the telemetry id and the update-check state. If you plan to mount the admin config read-only after setup (see Review below), give it a volume of its own from the start by adding `-v bulwark-config:/app/data/admin`. The repository's `docker-compose.yml` mounts the directories one by one instead. Docker fills a new named volume from the image, owned by the app's user. If you use a bind mount to a host directory instead, make that directory writable by uid 1001.

The wizard is locked behind a one-time setup token, which the container prints to its log:

```bash
docker logs bulwark
```

Open the link it prints (`http://<host>:3000/setup#token=…`), or open `http://localhost:3000` and paste the token on the first screen. The token is valid for an hour; restart the container to get a new one. The wizard then takes seven steps:

| Step | What it does |
| --- | --- |
| Welcome | Asks for the setup token from the container log |
| Server | Probes the JMAP server URL, takes optional extra servers with auto-pick by email domain, and toggles the Stalwart-specific features |
| Auth | Turns OAuth2 / OIDC sign-in on or off and takes the client ID, secret and issuer URL; password sign-in stays available unless you make OAuth the only method |
| Security | Generates or accepts a session secret, offers settings sync, and asks whether to send anonymous usage stats (off by default) |
| Logging | Text or JSON, and a log level |
| Branding | Uploads for the favicon, app logos, and login logos, plus company and legal URLs |
| Review | A grouped summary, the admin password, and an option to drop a `.config-locked` marker so the config volume can be remounted read-only |

The wizard writes to `ADMIN_CONFIG_DIR` (`/app/data/admin` in the container). Setting `JMAP_SERVER_URL` in the environment skips the wizard entirely and hands configuration to the environment.

## Script install

An interactive shell installer still ships in the repository. It installs with Node.js, Docker or Docker Compose, whichever you pick. It is no longer the recommended path, and the README no longer documents it, but it works:

```bash
curl -fsSL https://bulwarkmail.org/install | bash
```

Read it before you pipe it into a shell, as you would with any install script. It also has a preview mode that changes nothing:

```bash
curl -fsSL https://bulwarkmail.org/install | bash -s -- --dry-run
```

## Manual install

Every release also attaches a prebuilt standalone tarball (`bulwark-standalone-<version>-linux-amd64.tar.gz` and `-arm64`) to the [GitHub release](https://github.com/bulwarkmail/webmail/releases), which skips the clone and build below: unpack it and run `node server.js`. The [manual deployment](/docs/deployment/manual) page has the service file.

### 1. Clone the repository

```bash
git clone https://github.com/bulwarkmail/webmail.git
cd webmail
```

### 2. Install dependencies

```bash
npm install
```

### 3. Pre-seed the environment (optional)

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

### 4. Start the server

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. If no `JMAP_SERVER_URL` is set, the setup wizard will walk you through the rest.

### Developing without a mail server

To work on the UI with no mail server anywhere in sight, copy the development environment. It starts a built-in mock JMAP server:

```bash
cp .env.dev.example .env.local
npm run dev
```

Log in with any username and password. The mock server has its own test data. For the demo data set instead, set `DEMO_MODE=true`; [Demo mode](/docs/getting-started/demo-mode) covers what's in it and what it deliberately doesn't do.

## Production build

```bash
npm run build
npm start
```

The production server starts on port 3000 by default. Use the `PORT` environment variable to change it:

```bash
PORT=8080 npm start
```

## Updating

For a source install:

```bash
git pull origin main
npm install
npm run build
```

Bulwark checks for a newer release at startup and shows an update notice in the app when one exists; a release that fixes a security advisory is flagged in red. Release channels, container upgrades, and which directories have to persist are on the [Updating](/docs/deployment/updating) page.
