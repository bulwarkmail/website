---
title: Upgrading to Stalwart 1.0
description: What to do on the Bulwark side before Stalwart 1.0, and which server settings to check.
order: 1
edition: both
---

# Upgrading to Stalwart 1.0

Bulwark works with Stalwart 1.0 from release {{BULWARK_VERSION}} on. Most of it behaves as on 0.16; this page covers the order of the upgrade, the Stalwart settings some features depend on, and the smaller differences.

## Upgrade Bulwark first

Upgrade Bulwark, and Bulwark Lite, to {{BULWARK_VERSION}} or newer **before** you switch the mail server. Older releases don't work with Stalwart 1.0: the calendar stays empty, creating an event reports a failure after the server saved it, contacts lose their photos when they are saved, and sending stops after about 500 messages per account. Release {{BULWARK_VERSION}} works with Stalwart 0.16.6 and newer as well, so it can go first. [Updating](/docs/deployment/updating) has the steps for each install type.

## There is no upgrade from 0.16 yet

Stalwart has no migration from 0.16 to 1.0 yet, so 1.0 is for fresh installs only.

- Stalwart 1.0 refuses to start on a 0.16 data store, with "You must first upgrade to version 0.15". Before it refuses, it may already have changed the RocksDB files, and 0.16 may not open them again.
- Before you try anything, take a snapshot of the volume or filesystem that holds the data directory (`/var/lib/stalwart` in the Docker image), or a backup of the database if the data store is external. `stalwart-cli snapshot` exports settings only, not mail.
- Pin the Stalwart image to a release line, such as `stalwartlabs/stalwart:v0.16`. With a floating tag like `latest`, a `docker compose pull` could move a 0.16 store onto 1.0.

To try 1.0, run it next to the 0.16 server, on empty volumes.

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

On the 1.0 pre-release the settings reload can fail, and the new value only applies after a restart. If the reload reports an error, restart Stalwart.

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

## Lite on Stalwart needs a new Application

- A fresh 1.0 install starts without your Applications. Create the Bulwark Application again, as on [Install on Stalwart](/docs/deployment/stalwart-app), with a `resourceUrl` of release {{BULWARK_VERSION}} or newer.
- The 1.0 pre-release lacks the 0.16.23 fix that keeps a running bundle online: a failed "update applications" unmounts the Application until a later update succeeds. Check that `resourceUrl` downloads before you run the action, and point it at a tagged release rather than `latest`, so the bundle only changes when you change the URL.

## Smaller differences

- **Vacation replies** go out with an empty envelope sender (<code style="font-variant-ligatures: none">MAIL FROM:&lt;&gt;</code>).
- **Address books shared as "Read & write"** on 0.16 show as read-only on 1.0 until the owner saves the share again.
- **Search** on Stalwart's built-in index matches a quoted phrase exactly, and `word*` as a prefix of at most 16 bytes; a longer prefix finds nothing. Bulwark {{BULWARK_VERSION}} sends each phrase and each prefix as a condition of its own.
- **Events** can have at most 20 participants. **Max iCal Attendees** under **Settings > Calendar & Contacts > Calendar** changes the limit, and Bulwark warns in the event editor when an event goes over it.
- **Time zones** Stalwart 1.0 doesn't know make calendar requests fail. Bulwark {{BULWARK_VERSION}} then asks in UTC and logs a warning in the browser console.
- **Single sign-on** through a per-domain OpenID Connect directory (Stalwart Enterprise) needs access tokens with an `email`, `preferred_username` or `upn` claim on the 1.0 pre-release. Stalwart checks a token without one against the default directory, and the sign-in fails.
- **Signing out** can't revoke Stalwart's own tokens: like 0.16, Stalwart 1.0 has no token revocation or end-session endpoint, so they stay valid until they expire.

<div class="bw-note"><b>Note.</b> Stalwart is a trademark of Stalwart Labs. Bulwark is an independent project.</div>
