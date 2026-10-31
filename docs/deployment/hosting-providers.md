---
title: Running Bulwark for customers
description: "One Bulwark for many customer domains: servers picked by domain, branding per web address, opening a mailbox from your panel, embedding, and several replicas."
order: 8
edition: full
editionNote: "Branding per web address, opening a mailbox from your panel and embedded sign-in need Bulwark (not Lite). Lite can offer the same server list from config.json."
---

# Running Bulwark for customers

This page is for hosters and service providers who run one Bulwark for many customers. The mailboxes live in Stalwart, on one server or several. Bulwark adds the login page that sends each customer to the right server, the branding of each customer's web address, a way into a mailbox from your panel, and sign-in inside your portal. Everything here is configuration: environment variables, or the same settings in the [admin console](/docs/guides/admin).

## One Bulwark, several Stalwart servers

If all your customers are on one Stalwart, `JMAP_SERVER_URL` is all you need: Stalwart serves every domain it hosts. If customers are spread over several Stalwart servers, list them in `JMAP_SERVERS` and let the login page pick one from the address the user types:

```env
JMAP_SERVERS=[{"id":"eu","label":"Europe","url":"https://eu.mail.example.net","domains":["customer-a.com","customer-b.de"]},{"id":"us","label":"US","url":"https://us.mail.example.net","domains":["customer-c.com"],"oauth":{"clientId":"webmail-us"}}]
JMAP_SERVER_AUTO_PICK_BY_DOMAIN=true
```

- Each entry needs `id`, `label` and `url`. `domains` lists the mail domains that server hosts.
- With `JMAP_SERVER_AUTO_PICK_BY_DOMAIN=true` (default `false`), the login page selects the server whose `domains` contain the domain of the typed address and locks the server menu to it. The domain has to match exactly; subdomains and wildcards don't. For an address whose domain is on no list, the user picks from the menu.
- An entry can carry its own `oauth` block (`clientId`, `issuerUrl`, `clientSecret`, `buttonLabel`, `endSessionUrl`) for a server with its own identity provider. `JMAP_SERVERS` and `JMAP_SERVER_AUTO_PICK_BY_DOMAIN` are listed in the [environment reference](/docs/getting-started/configuration/environment-reference#jmap_servers).
- In the admin console the list is under **Server > JMAP servers**.

<img class="theme-light-only" src="/screenshots/light-login-servers.webp" alt="The login page with a server menu listing the Stalwart servers from JMAP_SERVERS" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-login-servers.webp" alt="The login page with a server menu listing the Stalwart servers from JMAP_SERVERS" width="5120" height="2880" />

<div class="bw-note bw-note-warning"><b>Warning.</b> The server list is public. The login page reads it from <code>/api/config</code> before anyone signs in, so anyone can see each server's label, URL, OAuth client id and issuer. With auto-pick on, the response also carries every entry's <code>domains</code>, which names every customer domain you listed. Client secrets and logout URLs are never sent.</div>

## Branding per web address

`DOMAIN_BRANDING` gives each web address Bulwark is opened on its own name, logos, favicon, app icons and colours, company name, imprint, privacy and website links, and help and accessibility links. Fields an entry leaves out fall back to the global branding.

```env
DOMAIN_BRANDING=[{"host":"mail.customer-a.com","appName":"Customer A Mail","loginCompanyName":"Customer A Ltd","loginLogoLightUrl":"https://cdn.example.net/a/logo.svg"},{"host":"*.example.net","appName":"Example Mail"}]
```

The match is on the hostname in the browser's address bar, **not on the user's mail domain**. Someone with an address at `customer-a.com` who opens `webmail.example.net` sees the `example.net` branding. To brand a customer, give them a web address of their own that points at your Bulwark, such as `mail.customer-a.com`, with a certificate for it.

- An exact host wins over a wildcard. `*.example.net` matches any subdomain, and among wildcards the longest one wins.
- Bulwark reads the host from `X-Forwarded-Host`, or from `Host`. Your reverse proxy has to pass the original host on.
- The server list doesn't follow the web address. Which server a user gets still depends on the address they type.
- In the admin console, branding per address is on the **Branding** page: add the host under **Scope**, then set the fields for it.

<img class="theme-light-only" src="/screenshots/light-login-branded.webp" alt="A login page with a customer's name, logo and company details, opened on that customer's web address" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-login-branded.webp" alt="A login page with a customer's name, logo and company details, opened on that customer's web address" width="5120" height="2880" />

<img class="theme-light-only" src="/screenshots/light-admin-branding.webp" alt="The admin console's Branding page with an entry for one customer's web address" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-branding.webp" alt="The admin console's Branding page with an entry for one customer's web address" width="5120" height="2880" />

## Opening a customer's mailbox from your panel

Your panel can open a customer's mailbox for support without knowing its password. The panel signs a short-lived token (an HS256 JWT, valid for at most 300 seconds, usable once) and links to Bulwark with it. Bulwark checks it, signs in through a Stalwart master account, creates an app password on the mailbox that expires after 8 hours, and opens the mailbox. Signing out deletes the app password.

```env
BULWARK_JWT_AUTH_SECRET=<at least 32 characters, shared with your panel>
BULWARK_STALWART_MASTER_USER=master@example.net
BULWARK_STALWART_MASTER_PASSWORD=<the master account's password>
```

- The master account needs Stalwart's **Impersonate** permission. Stalwart's administrator role has it; no Enterprise licence is needed.
- Each variable also has a `_FILE` form for Docker or Kubernetes secrets.
- Bulwark opens mailboxes only on the server in `JMAP_SERVER_URL`. Servers from `JMAP_SERVERS` can't be used for this.

The token format, a minting example and the checks Bulwark makes are on [Master-user impersonation](/docs/guides/impersonation).

## Sign-in with an access token

`LOGIN_SHOW_TOKEN_LOGIN=true` (default `false`) adds **Sign in with an access token** to the login page. The user pastes an API token instead of a password. Stalwart users create API keys in Bulwark under **Settings > Security**; other JMAP servers that issue API tokens work the same way.

## Embedding Bulwark in your portal

Bulwark can run in an iframe inside your customer portal and sign in silently through the identity provider the portal already uses. That needs OAuth in SSO-only mode (`OAUTH_ONLY`), `AUTO_SSO_ENABLED`, your portal's origin in `ALLOWED_FRAME_ANCESTORS`, cross-site cookies (`COOKIE_SAME_SITE=none`) and HTTPS. Bulwark tells the portal about sign-out over a postMessage bridge. [Embedded SSO](/docs/guides/embedded-sso) has the configuration and the messages.

## Several replicas

The project hasn't tested Bulwark with more than one replica; the code is written for one instance. If you run several behind a load balancer, this is what the code needs:

- **The same `SESSION_SECRET` on every replica**, at least 32 characters, or `SESSION_SECRET_FILE`. Sessions are encrypted cookies, so any replica with the same secret can read them. Set it yourself instead of letting each replica generate one.
- **Shared config and state volumes:** `ADMIN_CONFIG_DIR` (`/app/data/admin`) and `ADMIN_STATE_DIR` (`/app/data/admin-state`) need one volume that every replica mounts read-write, such as a `ReadWriteMany` claim in Kubernetes. The state folder holds the used impersonation tokens, so a token used on one replica is refused on the others. Share the settings folder and the plugin credentials folder (`/app/data/settings`, `/app/data/plugin-secrets`) too if you use settings sync or plugins.
- **Admin changes reach the other replicas only after a restart.** Each replica reads the config once when it starts. A change saved in the admin console on one replica is in the shared file, but the others keep the old values until they restart. To avoid the split, configure from environment variables and mount the config read-only with `ADMIN_CONFIG_READONLY=true`.
- **Linking the phone app by QR code needs sticky sessions.** The pairing codes live in the memory of the replica that made them, so the phone's request has to reach the same replica.

## Stalwart's side

- **Stalwart's own multi-tenancy needs a Stalwart Enterprise licence**: tenants, tenant quotas and tenant permission limits. Without one, run one Stalwart with many domains, or one Stalwart per customer picked by domain as above.
- Several identity providers or directories on one Stalwart, per domain or per issuer, also need the Enterprise licence. One directory for the whole server doesn't.
- Signing in to Bulwark's admin console with a Stalwart account works for a superuser only. Tenant administrators are refused.

## Next step

Read the [organisations page](/organisations) for what else Bulwark offers organisations and hosters, or set up [master-user impersonation](/docs/guides/impersonation) for your panel.
