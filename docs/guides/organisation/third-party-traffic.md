---
title: Third-party traffic
description: Stop Bulwark and your users' browsers from contacting any service outside your own servers, and check what stays reachable.
order: 6
edition: both
---

# Third-party traffic

Out of the box, Bulwark talks to a few services that aren't yours: a push relay for new-mail notifications, an icon service for sender logos, the extension directory, and so on. One switch turns all of them off.

## Turn it on

Set the environment variable and restart Bulwark:

```bash
NO_THIRD_PARTY_TRAFFIC=true
```

Or turn on **No third-party traffic** on **Admin > Organisation > Security**. The server stops at once; browsers follow the next time Bulwark loads in them.

<img class="theme-light-only" src="/screenshots/light-admin-third-party.webp" alt="Organisation, Security in the admin console: No third-party traffic turned on, with the list of hosts that stay reachable" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-third-party.webp" alt="Organisation, Security in the admin console: No third-party traffic turned on, with the list of hosts that stay reachable" width="5120" height="2880" />

The switch is for the whole server, not per domain or group: most of what it stops, such as telemetry and the version check, runs for no particular user. The **Applies to** bar on the page doesn't change it.

The Security page of the admin console shows where the value comes from. When `NO_THIRD_PARTY_TRAFFIC` is `true`, `1`, `yes` or `on` in the environment, the switch is on and the admin console can't turn it off. With `ADMIN_CONFIG_READONLY` set, the admin console can't change it at all; set it in `config.json` instead. A string works there too (`"true"`, `"1"`, `"yes"`, `"on"`):

```json
{
  "noThirdPartyTraffic": true
}
```

The mode fails closed:

- The server routes that would reach an outside service refuse the request (403) before making it, and an empty or missing URL setting can't bring a built-in default back.
- Until a browser has read the configuration, it behaves as if the switch were on.
- The page's Content-Security-Policy lists only your Bulwark and the hosts under [What still works](#what-still-works), so the browser itself refuses anything the switches above miss.

## What it turns off

Every outside host Bulwark knows about, and what happens to it:

| Host | Used for | Without the switch, turn it off with | With the switch on |
| --- | --- | --- | --- |
| `telemetry.bulwarkmail.org` | Anonymous daily heartbeat, sent only after an admin turned telemetry on (server) | Off by default; `BULWARK_TELEMETRY=off` or **Admin > System > Usage stats** | Never sent, whatever the telemetry setting says |
| `version.telemetry.bulwarkmail.org` | Hourly check for a newer release, shown to admins (server) | `BULWARK_UPDATE_CHECK=off` | Not checked; checks resume when you turn the switch off again |
| `notifications.relay.bulwarkmail.org` | Built-in Web Push relay that wakes the browser for new mail (browser) | Your own relays under **User policy > Push relays**, choice locked | Not offered; push needs a relay you run |
| `extensions.bulwarkmail.org` | Marketplace, installs and update checks in the admin console (server) | `EXTENSION_DIRECTORY_URL` pointing at your own directory | Off, unless `EXTENSION_DIRECTORY_URL` points at another host |
| `connector.bulwarkmail.org` | Links in the docs and the directory that open your instance; the connector asks your server what it can open | `CONNECTOR_ENABLED=false` | The capabilities endpoint answers 404 |
| `icons.duckduckgo.com` | Sender logos next to messages, fetched by your server | Users can turn sender icons off in **Settings > Message list** | Avatars show initials; `/api/favicon` answers 403 |
| `<sender domain>` (BIMI) | Brand logos for messages that pass DMARC: DNS records at the sender's domain, then the logo and certificate they name (server) | Users can turn sender icons off in **Settings > Message list** | Avatars show no brand logos; `/api/bimi` answers 403 |
| `api.mymemory.translated.net` | Default provider of the Translate plugin (server) | Set `LIBRETRANSLATE_URL` and pick LibreTranslate in the plugin | Refused with 403; your LibreTranslate still works |
| `www.google.com` | Tapping the address of a calendar event opens Google Maps (browser) | Nothing; it's a link the user taps | The address is plain text with a copy button |
| `openpgpkey.<recipient domain>` | OpenPGP key lookup (WKD) for PGP plugins (browser) | Don't install a PGP plugin that looks keys up | The lookup is refused |
| `randomuser.me`, `img.freepik.com` | Sample photos with the built-in mock server only (`DEV_MOCK_JMAP=true`) | Don't run the mock server | Not shown |

**Plugins** that declare network access don't run: those with the `http:fetch` or `http:proxy` permission, or with any entry in `httpOrigins` or `frameOrigins`. Plugins you installed aren't sent to browsers, the credential proxy refuses requests, and no plugin frame origins go into the page's security policy. A plugin a user installed in their own browser shows "Not started" with the reason in **Settings > Add-ons**. Every other plugin runs as before. The Security page names the plugins it keeps off.

Avatar plugins such as Gravatar or Libravatar don't declare network access: they hand Bulwark an image address. With the switch on, Bulwark doesn't show an avatar from another host, so those senders get initials. The same goes for a contact card whose photo is a link to another host.

**Push registrations** that users made before you turned the switch on are checked the next time Bulwark loads in their browser. Bulwark remembers which relay each registration points at. If you configured a relay of your own, it makes a new registration on the mail server that points there and removes the old one. Without a relay of your own, it removes the registration, so Stalwart stops sending to the built-in relay. The same happens when you change the relays in the list later.

## What still works

Everything you configured yourself stays reachable. **Admin > Organisation > Security** lists it under **Still reachable**, and the page's security policy allows exactly these hosts:

- JMAP servers (`JMAP_SERVER_URL`, `JMAP_SERVERS`)
- the OAuth issuer and its logout URL (`OAUTH_ISSUER_URL`, per-server `oauth.issuerUrl`)
- push relays you added under **User policy > Push relays**, and the relay the image was built with (`NEXT_PUBLIC_PUSH_RELAY_URL` at build time; a different value set only at runtime is flagged, because browsers keep using the built-in one)
- a self-hosted extension directory (`EXTENSION_DIRECTORY_URL`)
- default sidebar apps
- the WOPI document editor (`WOPI_CLIENT_URL`)
- LibreTranslate (`LIBRETRANSLATE_URL`)
- branding images on other hosts

The list also shows what users enter themselves, which stays allowed:

- **Custom JMAP servers**, when `ALLOW_CUSTOM_JMAP_ENDPOINT` is on. Users can then sign in to any server, so the page's policy lets the browser connect to any `https:` host (images, fonts and media stay limited to the list).
- **Calendar subscriptions**: users can subscribe to any feed URL, and your server fetches it. Turn off the calendar under **Features** to stop that.
- **Sidebar apps users add**. Turn off **Sidebar apps** under **Features** to stop that.

The same page lists the built-in hosts above, so you can compare.

Links users click, in mail or anywhere else, open in a new tab as usual.

**Remote images in mail don't load at all with the switch on.** They are the usual way senders track who opened a message. Instead of the button to load them, the message says that your organisation blocks content from other servers, and there is no option to always load them from a sender. **External content** in **Settings > Reading** shows as blocked and "Set by your organisation". The page's security policy refuses those images as well. Images attached to the message still show.

Fonts are part of the Bulwark image: they are downloaded when the image is built, never when it runs.

## Checking it

Bulwark's own tests fail when the source gains an outside host that isn't in this list, and an end-to-end test signs in, reads mail, writes a message, opens settings and the admin console, and runs the Gravatar plugin with the switch on, and fails on any request to a host other than your Bulwark and your JMAP server.

To check your own deployment, open the browser's developer tools on the Network tab and filter out your hosts. Requests the security policy refused show up in the Console.

## Bulwark Lite

Lite reads the switch from `config.json` next to `index.html`:

```json
{
  "noThirdPartyTraffic": true
}
```

If `config.json` is missing or can't be read, Lite behaves as if the switch were on.

Lite has no server, so most of the table doesn't apply: there is no telemetry, version check, marketplace, sender icons, translation route or push. The switch turns off the map links in Lite. Plugins don't run in Lite at all.

A static build made with `LITE_NO_THIRD_PARTY_TRAFFIC=true` ships with the switch on, and every page carries a security policy that allows only its own origin and the JMAP server from `LITE_JMAP_SERVER_URL`; the `_headers`, nginx and Caddy examples in the zip carry the same policy. Without a server URL, or with custom servers allowed, the policy lets the browser connect to any host, while images, fonts and media stay limited to the page's own origin. The bundle for installing Lite as a Stalwart Application doesn't get the per-page policy.

If you turn the switch on in `config.json` of a build made without it, Lite relies on its in-app checks. Add the policy in your web server to get the browser's backstop too, for example in nginx (replace the JMAP server with yours):

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://mail.example.com; font-src 'self' data:; connect-src 'self' https://mail.example.com; media-src 'self' blob:; frame-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'" always;
```

## What isn't possible

- **Per domain or group.** The server's own requests belong to no user, so the switch can't follow the domain and group entries. Settings users can change, like external content, can be locked per domain or group as usual.
- **Remote images in mail with the switch on.** See above: loading them would contact the sender's servers, which is what the switch stops.
- **Network-level enforcement.** Bulwark stops its own requests and tells the browser what to refuse; it doesn't filter the network. If you need a guarantee against anything Bulwark doesn't know about, add an egress firewall that lets the server reach only your mail server and lets browsers reach only Bulwark and the mail server.

## Next step

Go on to [Shared tags](/docs/guides/organisation/shared-tags).
