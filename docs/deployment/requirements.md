---
title: Requirements and sizing
description: What Bulwark and Bulwark Lite need to run, which architectures are built, and how much memory they used in a measured setup.
order: 1
---

# Requirements and sizing

Bulwark is a mail client, so it needs a Stalwart mail server to talk to and somewhere to run. This page lists both, what the release images and files weigh, how much memory Bulwark used in one measured setup, and which connections have to work between the browser, Bulwark and Stalwart.

## What you need

| | Bulwark | Bulwark Lite |
| --- | --- | --- |
| Mail server | Stalwart 0.16.6 or later, or Stalwart 1.0 | the same |
| Bulwark version for Stalwart 1.0 | {{BULWARK_VERSION}} or later | the same |
| Where it runs | Docker on `linux/amd64` or `linux/arm64`, or Node.js 20.9 or later for the standalone build | any web server that serves static files, the Lite container image, or Stalwart itself |
| A server process | yes, one Node.js process | none |

Bulwark and Bulwark Lite share version numbers, so the Stalwart versions apply to both. [Supported versions](/docs/getting-started/stalwart-setup#supported-versions) lists which Stalwart release adds what. Before you move a running server to Stalwart 1.0, read [Upgrading to Stalwart 1.0](/docs/deployment/updating/stalwart-1-0).

The ways to install are on [Docker deployment](/docs/deployment/docker), [Manual deployment](/docs/deployment/manual) (Node.js), [Static hosting](/docs/deployment/static) and [Install on Stalwart](/docs/deployment/stalwart-app) (both Lite).

## Architectures

Every release publishes these, each for `linux/amd64` and `linux/arm64`:

- the image `ghcr.io/bulwarkmail/webmail`
- the Lite image `ghcr.io/bulwarkmail/webmail-lite`
- the standalone tarballs `bulwark-standalone-<version>-linux-amd64.tar.gz` and `-linux-arm64.tar.gz`

There is no 32-bit ARM build (`arm/v7`) of any of them. A Raspberry Pi needs a 64-bit operating system: `uname -m` has to print `aarch64`. The Lite zips are plain HTML, JavaScript and CSS, so they don't depend on the architecture at all.

`docker pull` picks the right architecture on its own. The images are on GitHub Container Registry only, not on Docker Hub.

## Download and disk size

Measured for 1.19.1. The numbers move a little from release to release.

| Image | Download (compressed) | On disk after the pull (amd64) |
| --- | --- | --- |
| `ghcr.io/bulwarkmail/webmail:1.19.1` | 110.5 MB (amd64), 110.3 MB (arm64) | 445 MB |
| `ghcr.io/bulwarkmail/webmail-lite:1.19.1` | 23.1 MB (amd64), 23.8 MB (arm64) | 116 MB |

| Release file | Size |
| --- | --- |
| `bulwark-standalone-1.19.1-linux-amd64.tar.gz` | 60.0 MB |
| `bulwark-standalone-1.19.1-linux-arm64.tar.gz` | 59.7 MB |
| `bulwark-lite-1.19.1.zip` | 18.8 MB |
| `bulwark-lite-stalwart.zip` | 18.8 MB |

Bulwark keeps no mail. What it writes under `/app/data` is its config, its runtime state and, if you turn settings sync on, users' settings.

## Memory and CPU

These figures come from one measured setup. Read how it was measured before you size a machine with them.

| | Bulwark | Bulwark Lite (container) |
| --- | --- | --- |
| Memory right after start | 73 MiB | 7.6 MiB |
| Memory while idle, 2 minutes | 62 to 74 MiB | 7.6 to 7.8 MiB |
| CPU while idle | 0.00 % (at most 0.02 %) | 0.00 % |
| Memory during the load | 269 MiB on average, 321 MiB at most | 9.3 MiB on average, 9.9 MiB at most |
| CPU during the load, in % of one core | 252 % on average, 289 % at most | 290 % on average, 293 % at most |
| Memory 60 seconds after the load | 95.8 MiB | 8.2 MiB |

How it was measured:

- On the project's benchmark VM: 8 virtual CPUs (Intel Xeon E5-2680 v4), 5.9 GiB of RAM, amd64, Docker 29.8.
- The `webmail:1.19.1` and `webmail-lite:1.19.1` images, one container at a time, with no volumes, pointed at the Stalwart server on the same VM. The admin console was off.
- Nobody signed in. Idle means 2 minutes with no requests, with `docker stats` read every 10 seconds.
- The load was 200 cold page loads, 10 at a time. Each one fetched the login page, every script and stylesheet it references, and the runtime config, with no browser cache. `curl` sent them from the same VM, so it shared the CPU with the container. `docker stats` was read every second.
- A cold page load moved about 1.2 to 1.3 MB for either edition. Browsers cache the scripts and stylesheets, so later visits fetch much less.

What this doesn't cover:

- **Signed-in use was not measured.** Mail sync, search and everything else a signed-in user makes Bulwark's server do are not in these numbers.
- **Nothing was measured on ARM.** The arm64 images are the same code, but no board was tested.

For comparison, Stalwart 0.16.22 on the same VM used about 170 MiB after running for nine days. Leave room above the load figure when you pick a machine; the figures above are not a recommendation for any number of users.

## HTTPS

Bulwark works over plain HTTP, for example at `http://192.168.1.10:3000` on a home network. These things need HTTPS:

- **More than 5 accounts in one browser:** each signed-in account keeps one push connection open. Over HTTP/1.1 a browser allows about six connections per site, so Bulwark stops at 5 accounts. Once it sees HTTP/2 or HTTP/3 it allows 50. Browsers speak HTTP/2 only over TLS, so this needs a proxy that serves HTTPS with HTTP/2, which [Caddy](/docs/deployment/docker/reverse-proxy#caddy) does by default and nginx does with `http2 on`.
- **Installing Bulwark as an app, and web push:** browsers allow both only on a secure page: HTTPS, or `http://localhost`. See [Progressive web app](/docs/features/pwa). Web push also needs Bulwark (not Lite).
- **Embedding Bulwark in another site:** [Embedded SSO](/docs/guides/embedded-sso) needs cross-site cookies, which browsers send only over HTTPS.

Once Bulwark is on HTTPS, Stalwart's JMAP address has to be HTTPS too. A page served over HTTPS can't load from an `http://` address; the browser blocks it.

## Files and the app user

The Bulwark image runs as the user `nextjs`, uid 1001 and gid 1001. A named Docker volume on `/app/data` gets the right owner by itself. A bind mount to a folder on the host, such as a NAS share, has to be writable by uid 1001, or Bulwark can't save its config and session secret:

```bash
sudo mkdir -p /srv/bulwark/data
sudo chown -R 1001:1001 /srv/bulwark/data
```

The Lite image runs as uid 101 and listens on port 8080. It only reads the `config.json` (and `policy.json`) you mount into it, read-only is fine, and it writes nothing you need to keep.

The standalone build runs as whatever user your service file names. Its data folders have to be writable by that user; [Manual deployment](/docs/deployment/manual) shows the systemd unit.

## What has to reach what

The browser loads mail, calendars, contacts and files straight from Stalwart, in both editions. Bulwark's server doesn't pass the mail through. So the browser needs Stalwart's JMAP address as much as it needs Bulwark's.

| From | To | What for |
| --- | --- | --- |
| Browser | Bulwark's web address (Lite: the web host) | the app itself |
| Browser | Stalwart's JMAP address | the mail, calendars, contacts and files. Stalwart needs its [CORS setting](/docs/getting-started/stalwart-setup#cors-configuration) on unless both share one origin |
| Bulwark's server | Stalwart's JMAP address (`JMAP_SERVER_URL`) | sign-in, OAuth discovery, the admin console's Stalwart features. Lite has no server, so this row doesn't apply |
| Bulwark's server | `version.telemetry.bulwarkmail.org` | the hourly [update check](/docs/deployment/security-updates#the-update-notice-in-bulwark). Off with `BULWARK_UPDATE_CHECK=off` |
| Browser | the push relay, over HTTPS | registering for web push |
| Stalwart | the push relay, over public HTTPS | telling the relay that new mail arrived |
| Phone app | Stalwart's JMAP address | the mail, the same as the browser |

For push, nothing has to come in from the internet. Stalwart sends each change out to the relay, the relay wakes the browser or phone, and the device then fetches the mail from Stalwart itself. The default relay is `https://notifications.relay.bulwarkmail.org`. If you run your own relay, Stalwart has to reach it over HTTPS at a public name: Stalwart refuses push addresses on private IPs, and Stalwart 1.0 also refuses names that resolve to one. A relay on your LAN doesn't work.

The other outside services Bulwark can contact, and the No third-party traffic switch that turns them all off, are on [Third-party traffic](/docs/guides/organisation/third-party-traffic).

## Next step

Pick an install: [Docker Compose](/docs/deployment/docker/compose) runs Bulwark next to Stalwart, [Run Bulwark at home](/docs/deployment/home-server) covers a home server or NAS, and [Static hosting](/docs/deployment/static) puts Lite on any web server.
