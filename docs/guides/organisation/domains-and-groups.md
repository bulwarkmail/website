---
title: Domains and groups
description: Give the users of some domains, or the members of some groups, their own settings.
order: 1
edition: both
---

# Domains and groups

By default every user gets the same settings. To give some of them different ones, for a customer on a shared instance, a department, or a team, add an entry on **Admin > Organisation > Domains and groups**:

- **Domains** match users by the domain of the address they sign in with. `example.com` matches `anna@example.com`; `*.example.com` matches `anna@eu.example.com` but not `anna@example.com`.
- **Groups** match the members of a Stalwart group, by the group's address (`sales@example.com`). A user counts as a member when the group's mailbox is in their session, which is the case for every group Stalwart lets them use. Groups without a mailbox are invisible to Bulwark.

Then pick the entry in the **Applies to** bar at the top of any other Organisation page and change the settings there. A value the entry doesn't set comes from **Everyone**; the page shows it as "From Everyone: …". When the entry sets its own value, the page shows Everyone's value next to it, with **Use Everyone's value** to go back to it.

The User policy page has the same **Applies to** choice for its locked settings and defaults, once an entry exists.

<img class="theme-light-only" src="/screenshots/light-admin-policy.webp" alt="The User policy page in the admin console, with some features switched off and settings locked to a value" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-policy.webp" alt="The User policy page in the admin console, with some features switched off and settings locked to a value" width="5120" height="2880" />

## When several apply

Bulwark starts with Everyone's settings, applies the matching domain entries, then the matching group entries, each in the order of the list on the page. A later entry wins for the settings it sets. To make a group override its domain, keep it as it is: groups always come after domains.

## What a user gets

**Effective policy** on the same page takes an address and the groups the user belongs to, and lists every setting that isn't at Bulwark's default with the entry that set it. It works on the settings as they are on the page, saved or not, so you can check a change before saving it.

<img class="theme-light-only" src="/screenshots/light-admin-domains.webp" alt="Domains and groups in the admin console, with a group entry and the Effective policy for one address showing where each setting comes from" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-admin-domains.webp" alt="Domains and groups in the admin console, with a group entry and the Effective policy for one address showing where each setting comes from" width="5120" height="2880" />

In Settings, users see each locked value with **Set by your organisation** next to it, in place of a control they can't use.

<img class="theme-light-only" src="/screenshots/light-settings-locked.webp" alt="A setting in the user's Settings shown at the organisation's value, marked Set by your organisation" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-settings-locked.webp" alt="A setting in the user's Settings shown at the organisation's value, marked Set by your organisation" width="5120" height="2880" />

## What can't be set per domain or group

- Plugins, themes, push relays and sidebar apps are installation-wide.
- The plugin switches (plugins, user uploads, approval) and the account list backup are checked by the server for requests it can't tie to a user, so they stay global.
- **No third-party traffic** (Organisation > Security) is a server setting.

## Who sees which entries

The policy reaches the browser, so a user could read the settings of the entries Bulwark sends them. Bulwark sends each browser only the entries for the domains it is signed in with, plus group entries whose group address is in one of those domains. This needs `SESSION_SECRET`: without it the server can't tell users apart and sends all entries to everyone who is signed in.

Bulwark Lite reads `policy.json` as a public file, so on Lite every visitor can read every entry.

Locks from domain entries also hold when settings are saved to the server (settings sync). Locks from group entries are applied by the browser.

## The policy file

Everything on the Organisation pages and the User policy page is stored in `policy.json` in `ADMIN_CONFIG_DIR`, except the No third-party traffic switch, which is in `config.json`. Export and import don't carry it.

- **Export policy.json** downloads the file as the server uses it.
- **Import a file** shows what the file would change (entries, organisation settings, locked settings, features, defaults) and replaces the policy only when you confirm. The file goes through the same checks as a `policy.json` read from disk: anything invalid is dropped.

Both are recorded in the audit log. With `ADMIN_CONFIG_READONLY` set (the file comes from git or a read-only mount), the pages can't save and say why.

The entries look like this in the file:

```json
{
  "features": { "calendarEnabled": true },
  "restrictions": {},
  "organisation": { "session": { "idleMinutes": 60 } },
  "scopes": [
    {
      "id": "customer-b",
      "label": "Customer B",
      "match": { "domains": ["customer-b.example", "*.customer-b.example"] },
      "policy": {
        "features": { "calendarEnabled": false },
        "organisation": { "session": { "idleMinutes": 15 } }
      }
    },
    {
      "id": "support",
      "label": "Support team",
      "match": { "groups": ["support@example.com"] },
      "policy": {
        "restrictions": { "density": { "locked": true, "value": "compact" } }
      }
    }
  ]
}
```

An entry's `policy` takes the same `features`, `restrictions` and `defaults` as the top level of the file, and the `organisation` settings described on the other Organisation pages. `id` is lowercase letters, digits and dashes.

The old `sessionTimeout` setting did nothing. When the top level of the file locks or presets it to a number of minutes, that number moves to `organisation.session.idleMinutes` when the file is loaded, unless `idleMinutes` is already set. Inside an entry it isn't moved.

## Next step

Go on to [Signatures and disclaimers](/docs/guides/organisation/signatures), which can differ per domain or group too.
