---
title: Configuration
description: Configure Bulwark for your environment.
order: 3
---

# Configuration

Bulwark is configured through environment variables and an optional configuration file.

## Environment Variables

| Variable               | Required | Default   | Description                                   |
| ---------------------- | -------- | --------- | --------------------------------------------- |
| `NEXT_PUBLIC_JMAP_URL` | Yes      | —         | The JMAP endpoint URL of your Stalwart server |
| `NEXT_PUBLIC_APP_NAME` | No       | `Bulwark` | Application name shown in the UI              |
| `NEXT_PUBLIC_APP_LOGO` | No       | —         | URL to a custom logo                          |
| `PORT`                 | No       | `3000`    | Port to run the server on                     |

## Stalwart Server Setup

Bulwark requires a Stalwart Mail Server with JMAP enabled. Make sure your Stalwart configuration includes:

```toml
[server.listener.jmap]
bind = ["0.0.0.0:8080"]
protocol = "jmap"
```

### CORS Configuration

If Bulwark and Stalwart are on different domains, configure CORS in Stalwart:

```toml
[server.http]
allowed-origins = ["https://your-bulwark-domain.com"]
```

## Authentication

Bulwark uses JMAP's built-in authentication. Users log in with their email credentials configured in Stalwart. Supported authentication methods:

- **Basic Auth** — Username and password
- **OAuth 2.0** — If configured in Stalwart

## Theming

Bulwark supports light and dark themes out of the box. The theme preference is stored in the browser's local storage and respects the system preference by default.

To set a default theme, you can customize the CSS variables in your deployment. See the [Customization](/docs/guides/customization) page for details.
