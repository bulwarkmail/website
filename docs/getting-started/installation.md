---
title: Installation
description: How to install and run Bulwark locally.
order: 2
---

# Installation

This guide walks you through setting up Bulwark for local development or production deployment.

## Prerequisites

- **Node.js** 20 or later
- **npm**, **yarn**, or **pnpm**
- A running **Stalwart Mail Server** instance with JMAP enabled

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/root-fr/jmap-webmail.git
cd jmap-webmail
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
NEXT_PUBLIC_JMAP_URL=https://your-stalwart-server.com/jmap
NEXT_PUBLIC_APP_NAME=Bulwark
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
