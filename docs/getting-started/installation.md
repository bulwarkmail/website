---
title: Installation
description: How to install and run Bulwark locally.
order: 2
---

# Installation

This guide walks you through setting up Bulwark for local development or production deployment.

## Prerequisites

- **Node.js** 18 or later
- **npm** (included with Node.js)
- A running **Stalwart Mail Server** instance with JMAP enabled (or use the built-in mock server for development). If you don't have Stalwart installed yet, follow the [official installation guide](https://stalw.art/docs/category/installation) and then see [Stalwart Setup](/docs/getting-started/configuration/stalwart-setup) for Bulwark-specific configuration.

## Script Install

The fastest way to get Bulwark up and running:

```bash
curl -fsSL https://bulwarkmail.org/install | bash
```

This downloads and runs the interactive setup script, which handles cloning, dependencies, environment configuration (JMAP server, OAuth, branding, logging), and deployment method selection.

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

### 3. Configure Environment

Copy the example environment file and update it with your Stalwart server details:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Your JMAP server URL (required)
JMAP_SERVER_URL=https://your-stalwart-server.com

# App name displayed in the UI
APP_NAME=Bulwark
```

These are runtime environment variables, read at request time. Docker deployments can be configured without rebuilding.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Without a Mail Server

To develop UI without an external mail server, use the built-in demo mode:

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
