---
title: Upgrading to Stalwart 1.0
description: What to do on the Bulwark side when a server moves to Stalwart 1.0, and which server settings to check.
order: 1
edition: both
---

# Upgrading to Stalwart 1.0

Bulwark works with Stalwart 1.0 from release {{BULWARK_VERSION}} on. Most of it behaves as on 0.16; this page covers the order of the upgrade, the Stalwart settings some features depend on, and the smaller differences.

## Upgrade Bulwark first

Upgrade Bulwark, and Bulwark Lite, to {{BULWARK_VERSION}} or newer **before** you switch the mail server. Older releases don't work with Stalwart 1.0: sign-in with a two-factor code fails, Lite can't be installed as a Stalwart Application, the calendar stays empty, creating an event reports a failure after the server saved it, contacts lose their photos when they are saved, and sending stops after about 500 messages per account. Release {{BULWARK_VERSION}} works with Stalwart 0.16.6 and newer as well, so it can go first. [Updating](/docs/deployment/updating) has the steps for each install type.

## Moving a 0.16 server to 1.0

Stalwart 1.0 can't be installed over 0.16. Its migration tool, `stalwart-migrate`, copies the data of a 0.16 server into a new 1.0 data store, and you then start 1.0 on that store. Stalwart's own upgrade guide has the commands. For Bulwark, keep these in mind:

- **Don't start 1.0 on the 0.16 data store.** It refuses with "The data store was created by a Stalwart version prior to 1.0 and cannot be opened by this version", and before it refuses it may already have changed the RocksDB files, which 0.16 may then not open again. Take a snapshot of the volume or filesystem that holds the data directory (`/var/lib/stalwart` in the Docker image), or a backup of the database if the data store is external. `stalwart-cli snapshot` exports settings only, not mail.
- **Pin the image until you migrate.** `stalwartlabs/stalwart:latest` is 1.0 now, so a `docker compose pull` on `latest` starts 1.0 on the 0.16 store. Use a release line such as `stalwartlabs/stalwart:v0.16`, and change it when you move.
- **Keep the same public URL.** Bulwark keys accounts, the cached mailbox, settings sync and push subscriptions on the server URL. The migration keeps ids and the change history, so with the same URL Bulwark carries on where it was, open tabs included, and only shows "Connection lost" while the server is down. With a new URL everyone signs in again, and the old accounts stay in the account list, pointing at a server that is gone.
- **Sign-ins with tokens end.** OAuth tokens are not migrated. Everyone who signed in with single sign-on, or with a password and a two-factor code, has to sign in again. If such an account was one of several in the account list, it disappears from the list without a message; add it again. Accounts that signed in with a password alone carry on.
- **Answer the migration's proxy question with the real count.** `stalwart-migrate` turns 0.16's `useXForwarded` into `clientIpSource: xForwardedFor` and asks how many proxies sit in front of Stalwart. [Client address](/docs/getting-started/stalwart-setup#client-address) explains the setting and the one setup where it locks Bulwark out.

Then register Bulwark with Stalwart, as in the next section. Calendar and contact apps that sync over CalDAV and CardDAV fetch their data once more after the move; Bulwark re-reads calendars and contacts once as well.

## Register Bulwark with Stalwart

Stalwart 1.0 only signs in OAuth clients it knows, and only a **first-party** client may manage an account's Stalwart settings. Bulwark is neither until you register it. After the move to 1.0, or on a fresh 1.0 server, do this once:

1. Sign in to the webmail with a Stalwart account that has admin permissions.
2. In the same browser, open Bulwark's admin console, go to **Authentication**, and under **OAuth / OpenID Connect** click **Set up automagically**.
3. Check the webmail origin and the Stalwart issuer URL in the **Auto-configure OAuth** dialog, and confirm.

Bulwark then registers `bulwark-webmail` with Stalwart as a first-party client with a secret, saves the client id, secret and issuer URL in its own configuration, and turns on single sign-on. If you don't want the **Sign in with SSO** button, turn **Enabled** off again afterwards; two-factor sign-ins keep using the registered client.

Without this step:

- Password sign-ins work fully.
- Sign-ins with a password and a two-factor code work, through a client Bulwark registers for itself. Mail, contacts, calendars and files work, but the account security settings (password, two-factor, app passwords) say they are not available.
- Single sign-on through Stalwart doesn't work: Stalwart 1.0 doesn't let a web app register its own redirect URI, so it needs the registered client.

With a read-only configuration (`ADMIN_CONFIG_READONLY`) the button is off. Create an `OAuthClient` in Stalwart by hand instead, with `firstParty` turned on and the redirect URI `https://<webmail host>/<locale>/auth/callback` for each language, and set `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` as on the [authentication](/docs/getting-started/configuration/authentication) page. If you set `OAUTH_POST_LOGOUT_REDIRECT_URI`, Stalwart 1.0 also needs it in the client's `postLogoutRedirectUris`; otherwise it shows its own signed-out page instead of sending users back.

## Sharing and free/busy need directory queries

Stalwart 1.0 answers directory lookups only when the administrator allows them. The setting is `allowDirectoryQueries` on the `Sharing` object, **Allow Directory Queries** in the web admin, and it is off by default. 0.16 has the same setting but doesn't apply it to users with the default role, so a server that shared fine on 0.16 can stop on 1.0.

Without it:

- The share dialogs for folders, calendars, address books and files only offer the user's groups and the people who have shared something with them.
- Recipient autocomplete offers the same short list from the directory.
- Free/busy is not available, and the event editor says so.

With it, every signed-in user can list the accounts on the server. Bulwark works either way and says what is missing, so this is a privacy decision for your server.

To turn it on, use **Settings > Files & Sharing > Sharing** in the web admin, or the CLI:

```bash
stalwart-cli update Sharing --field allowDirectoryQueries=true
stalwart-cli create Action/ReloadSettings
```

Or over JMAP as an administrator:

```json
{
  "using": ["urn:ietf:params:jmap:core", "urn:stalwart:jmap"],
  "methodCalls": [
    ["x:Sharing/set", { "update": { "singleton": { "allowDirectoryQueries": true } } }, "0"],
    ["x:Action/set", { "create": { "r": { "@type": "ReloadSettings" } } }, "1"]
  ]
}
```

If the settings reload reports an error, restart Stalwart; the new value applies after the restart.

## Sending has a limit per account

Stalwart 1.0 keeps a submission record for every message sent over JMAP, and refuses to send once an account holds `maxSubmissions` of them: 500 by default. The web admin calls it **Submissions**, under **Settings > Email > Defaults**. Each account can override it in its **Quotas**, as **Maximum number of email submissions** (`maxEmailSubmissions`), under **Management > Directory > Accounts**.

Bulwark {{BULWARK_VERSION}} and newer deletes the records of messages that were sent or cancelled, its own and those other clients left behind; a scheduled message keeps its record until it goes out. Other JMAP clients may not clean up, and a full account fails with "There are too many email submissions, please delete some before adding a new one." The fix is to raise the limit or remove it (`null`):

```bash
stalwart-cli update Email --field maxSubmissions=5000
stalwart-cli create Action/ReloadSettings
```

For one account:

```bash
stalwart-cli query Account --where name=jane --fields id
stalwart-cli update Account <account-id> --field quotas/maxEmailSubmissions=5000
```

An account's override applies at once. The server-wide value needs the settings reload, or a restart where the reload fails.

Stalwart only lists the last three days of submission records, so Bulwark finds older ones through the change history, which keeps an account's last 10,000 changes (`maxChangesHistory`). Records older than that are out of Bulwark's reach, and an account with a long history may need a higher limit.

## Lite on Stalwart needs release {{BULWARK_VERSION}}

- Stalwart 1.0 only installs a bundle that contains a `stalwart-app.json` manifest, which `bulwark-lite-stalwart.zip` carries from {{BULWARK_VERSION}} on. An older zip is refused, and Stalwart logs "Application bundle does not contain a manifest".
- Point the Application's `resourceUrl` at release {{BULWARK_VERSION}} or newer, and run "update applications". On a fresh 1.0 install, create the Application again, as on [Install on Stalwart](/docs/deployment/stalwart-app).
- Use a tagged release URL, not `releases/latest`, so the bundle only changes when you change the URL. Release tags have no `v` prefix: `https://github.com/bulwarkmail/webmail/releases/download/{{BULWARK_VERSION}}/bulwark-lite-stalwart.zip`.
- Like 0.16.23 and later, Stalwart 1.0 keeps serving the running bundle when a download fails.
- Lite signs in through a client it registers for itself when Stalwart doesn't know its client id. The account security settings then aren't available; [Install on Stalwart](/docs/deployment/stalwart-app#signing-in-and-oauth) has the first-party client that enables them.

## Smaller differences

- **Vacation replies** go out with an empty envelope sender (<code style="font-variant-ligatures: none">MAIL FROM:&lt;&gt;</code>).
- **Address books shared as "Read & write"** on 0.16 show as read-only on 1.0 until the owner saves the share again.
- **Search** on Stalwart's built-in index matches a quoted phrase exactly, and `word*` as a prefix of at most 16 bytes; a longer prefix finds nothing. Bulwark {{BULWARK_VERSION}} sends each phrase and each prefix as a condition of its own.
- **Events** can have at most 20 participants. **Max iCal Attendees** under **Settings > Calendar & Contacts > Calendar** changes the limit, and Bulwark warns in the event editor when an event goes over it.
- **Time zones** Stalwart 1.0 doesn't know make calendar requests fail. Bulwark {{BULWARK_VERSION}} then asks in UTC and logs a warning in the browser console.
- **Single sign-on** through a per-domain OpenID Connect directory (Stalwart Enterprise) needs access tokens with an `email`, `preferred_username` or `upn` claim on 1.0. Stalwart checks a token without one against the default directory, and the sign-in fails.
- **Signing out** revokes Stalwart's tokens on 1.0, which has a revocation and an end-session endpoint. On 0.16, which has neither, they stay valid until they expire.
- **Push notifications** need a push service on a public domain name. Stalwart 1.0 refuses a push URL whose host isn't one, so a self-hosted push relay on a private address or an internal name gets no notifications. Browser push services are public and unaffected.

<div class="bw-note"><b>Note.</b> Stalwart is a trademark of Stalwart Labs. Bulwark is an independent project.</div>
