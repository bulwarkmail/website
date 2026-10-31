---
title: Templates
description: Give every user a library of templates, let teams share templates in their group mailbox, and keep users' own templates in their account.
order: 3
edition: both
---

# Templates

Users pick templates in the composer under **Templates > Insert template**, or with the `t` key. They see up to three kinds:

- **Organisation**: the library you set on **Admin > Organisation > Templates**. Users can use and copy these templates, not change them.
- **Team templates**: the templates of each group mailbox the user is a member of, under the group's address. Any member can add, change and delete them.
- **My templates**: the user's own.

<img class="theme-light-only" src="/screenshots/light-templates-org.webp" alt="The template picker in the composer, with the organisation's templates listed under Organisation above the user's own" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-templates-org.webp" alt="The template picker in the composer, with the organisation's templates listed under Organisation above the user's own" width="5120" height="2880" />

Team templates and keeping users' own templates in their account need Stalwart 1.0 or later. On older servers users keep their own templates in the browser, as before, and there are no team templates.

## Set up the library

1. Open **Admin > Organisation > Templates**.
2. Under **Organisation library**, click **Add template** and give it a name, a subject and the text. Tick **The text is HTML** for an HTML template. The preview shows what users get.
3. Click **Save**. Users get the library the next time Bulwark loads.

Placeholders such as `{{recipient_name}}` or `{{date}}` work as in users' own templates: users fill them in when they pick the template.

### Per domain or group

Pick a domain or group in the **Applies to** bar to add templates for its users only. Its users get Everyone's templates and these. **Change for this scope** next to one of Everyone's templates makes a copy you can change; it replaces Everyone's template for that domain or group only.

When several entries match a user, their templates add up.

## Team templates

Nothing to set up. Every Stalwart group with a mailbox gets team templates on Stalwart 1.0 or later: its members add them in **Settings > Composing > Manage Templates**, on the tab with the group's address.

Members change team templates when Stalwart lets them change the metadata of the group's Inbox. That is the case for every member of a Stalwart group unless you restricted the group's rights. A member without that right sees the templates but can't change them.

To make team templates read-only, lock **Team templates** under **Personal and team templates**. For example, lock it for Everyone and leave it unlocked for a "Team leads" group entry. Users see **Set by your organisation** in the template manager and can still use and copy the templates.

When two members edit the same template, the one who saves second is told that someone else changed it and reloads the list first; nobody's change is overwritten without them seeing it. Team templates keep To and Cc recipients but never Bcc.

Only group mailboxes get team templates. A mailbox another person shared with a user doesn't.

## Users' own templates

On Stalwart 1.0 or later, users' own templates are kept in their account, so they have them in every browser they sign in on, in Bulwark Lite too.

**Anyone a user shares their Inbox with can read that user's personal templates.** Stalwart keeps them with the Inbox, and sharing the Inbox shares them. Tell users this before they put anything confidential in a template.

Templates a user already had are not lost. With settings sync, the templates synced for the account go into the account once its settings have loaded. Without settings sync (Bulwark Lite, or sync turned off), the templates kept in the browser go into the first account that signs in there, and only that one. Each browser adds what it has, so two browsers with different templates end up with both. A template larger than 8 KB, or one that doesn't fit because the account's 64 KB for this data are used up, stays in that browser; the template manager says so next to it.

A deleted template is recorded as deleted for 90 days, so a browser that was offline doesn't bring it back. Bulwark sends changes that are still waiting before a user signs out.

To leave users only the organisation and team templates, hide **Personal templates** under **Personal and team templates**. Users then can't save templates of their own. Templates they have are kept, not deleted, and come back if you remove the restriction.

## In policy.json

The library is `organisation.templates.library`; the two switches are restrictions:

```json
{
  "organisation": {
    "templates": {
      "library": [
        {
          "id": "welcome",
          "name": "Welcome",
          "category": "Sales",
          "subject": "Welcome to Example",
          "body": "<p>Hello {{recipient_name}},</p><p>welcome to <b>Example</b>.</p>",
          "isHTML": true
        }
      ]
    }
  },
  "restrictions": {
    "teamTemplates": { "locked": true }
  },
  "scopes": [
    {
      "id": "leads",
      "label": "Team leads",
      "match": { "groups": ["leads@example.com"] },
      "policy": {
        "restrictions": { "teamTemplates": {} },
        "organisation": {
          "templates": {
            "library": [
              { "id": "escalation", "name": "Escalation", "subject": "", "body": "We are looking into it.", "isHTML": false, "category": "" }
            ]
          }
        }
      }
    }
  ]
}
```

- `id` is any text up to 128 characters, unique in the library. A domain or group entry with the same `id` as one of Everyone's templates replaces it for its users.
- `name` is required; templates without one are dropped. At most 200 templates.
- `restrictions.personalTemplates` takes `hidden`, `restrictions.teamTemplates` takes `locked`. An empty object in an entry (`{}`) unlocks what Everyone locks.

## Bulwark Lite

The library works the same: Lite reads it from `policy.json`. Team templates and users' own templates in the account work on Stalwart 1.0 or later, since they are stored on the mail server.

## What isn't possible

- **Team templates and templates in the account on older Stalwart versions.** They are stored as JMAP metadata of the Inbox, which Stalwart 0.16 doesn't have. There is no fallback; on those servers users keep their own templates in the browser and settings sync, as before.
- **Removing one of Everyone's templates for a domain or group.** Entries add templates or replace them; to show a template to some users only, put it in their entry instead of Everyone's.
- **Other mail apps.** The templates are Bulwark's. Other apps don't show them.
- **Templates larger than 8 KB in the account.** Stalwart keeps at most 8 KB per template and 64 KB per Inbox for this data. Larger templates stay in the browser they were made in; team templates that large can't be saved.
