---
title: Moving from Nextcloud Mail
description: Mail accounts, contacts and calendars from Nextcloud to Bulwark on Stalwart.
order: 3
---

# Moving from Nextcloud Mail

Nextcloud Mail is a client for an IMAP server. Your contacts and calendars are in the Nextcloud Contacts and Calendar apps, on Nextcloud's own CardDAV and CalDAV server. Signatures, aliases and text blocks are in Nextcloud's database, and filters are a Sieve script on the mail server. This page moves each of them to Bulwark. The steps were run with Nextcloud 34.0.5, Mail 5.12.6, Contacts 8.9.3 and Calendar 6.6.4 against Stalwart 1.0.1; steps marked "Not tested." were read in Nextcloud's docs or source but not run.

## Before you start

- Stalwart runs and has your account. See [Setting up Stalwart](/docs/getting-started/stalwart-setup).
- Your mail is on Stalwart. If Nextcloud Mail already talked to Stalwart, it's there. If it talked to another server, such as Dovecot, move the account with Stalwart's migration tool, Vandelay ([Stalwart's migration docs](https://stalw.art/docs/migration/)). Not tested.
- You can sign in to Bulwark with that account.

## Mail accounts

Nextcloud Mail keeps the server names and user names of your accounts in Nextcloud's database. There's nothing to export: you sign in to Bulwark with your Stalwart account. If you had more than one account in Nextcloud Mail, add the others in Bulwark too. See [Multi-account support](/docs/guides/multi-account). Not tested.

## Contacts and calendars with Vandelay

Vandelay reads contacts and calendars from Nextcloud over CardDAV and CalDAV and writes them to your Stalwart account. In the test this copied every address book and calendar with their contacts and events, recurring events included. The commands follow [Stalwart's CardDAV importer docs](https://stalw.art/docs/migration/import-export/import/carddav/) and its [CalDAV importer](https://stalw.art/docs/migration/import-export/import/caldav/); replace the host names and `alice`:

```bash
export VANDELAY_PASSWORD='<Nextcloud app password>'
vandelay import carddav \
  --url https://cloud.example.com/remote.php/dav/addressbooks/users/alice/ \
  --auth-basic alice \
  nextcloud.sqlite
vandelay import caldav \
  --url https://cloud.example.com/remote.php/dav/calendars/alice/ \
  --auth-basic alice \
  nextcloud.sqlite

export VANDELAY_PASSWORD='<Stalwart password>'
vandelay export \
  --url https://mail.example.com \
  --auth-basic alice@example.com \
  --account-name alice@example.com \
  nextcloud.sqlite
```

- If Vandelay reports "no DAV collections found", add the host name you used to `trusted_domains` in Nextcloud's `config.php`. The test needed that.
- The export uses the URL Stalwart advertises. In the test it refused a plain `http://` address because Stalwart's session advertised `https`.
- Vandelay copies every address book, the ones Nextcloud makes itself included. In the test, Stalwart got Contacts, Accounts (Nextcloud's list of its users) and Recently contacted. Delete the ones you don't want in Bulwark with **Delete address book**.
- It copies the Contact birthdays calendar too, as an ordinary calendar. Bulwark can show birthdays from your contacts itself (**Contact birthday calendar** in Settings > Calendar, off by default). If you turn that on, delete the copied calendar in Settings > Calendar > Calendar management so birthdays don't show twice.

The next two sections do the same by hand, in the browser.

## Contacts by hand

Export from Nextcloud Contacts:

1. Open Contacts and click **Contacts settings** at the bottom left.
2. Under **Address books**, open the menu (…) of an address book and choose **Download**. Nextcloud saves it as `<address book>-<date>.vcf`.
3. Repeat for each address book you want.

The file is vCard 3.0 with a UID for each contact, photos inside the file, and groups written as categories.

Import in Bulwark:

1. Open Contacts, click **+** next to the Contacts heading at the top of the sidebar and choose **Import contacts**. **Import contacts** in Settings > Contacts opens the same dialog.
2. Click **Click to select a vCard file** and choose the file. It can be up to 5 MB.
3. Bulwark lists the contacts it found. A contact whose email address is already in your contacts is marked **Duplicate** and left unticked.
4. Click **Import**.

<img class="theme-light-only" src="/screenshots/light-contacts-import.webp" alt="Bulwark's Import contacts dialog with the contacts found in a vCard file, each with a checkbox" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-contacts-import.webp" alt="Bulwark's Import contacts dialog with the contacts found in a vCard file, each with a checkbox" width="5120" height="2880" />

What to expect:

- In the test both contacts arrived in Stalwart, the photo included. The file also held Nextcloud's own sample contact.
- A Nextcloud contact group arrives as a category on each of its contacts, not as a contact group. A contact in the group "Friends" gets the category "Friends", and you can filter by it in the sidebar.
- Bulwark imports into your default address book, whichever address book is selected.
- Stalwart refuses a contact whose UID is already in your account. Importing the same file a second time, or after Vandelay copied the contacts, adds nothing; Bulwark counts those contacts as not imported.

## Calendars by hand

Export from Nextcloud Calendar:

1. Open Calendar. Next to a calendar under **My calendars**, click the pen icon (**Edit and share calendar**).
2. Click **Export**. Nextcloud saves the calendar as `<calendar>-<date>.ics`.

Import in Bulwark:

1. In Calendar, open **More actions** (⋮) and choose **Import calendar…**. **Import calendar** in Settings > Calendar opens the same dialog.
2. Click **Select .ics file** and choose the file. It can be up to 10 MB.
3. Under **Import to calendar**, pick the calendar. Your default calendar is preselected.
4. Click **Import selected**.

In the test both events arrived, a weekly event with its time zone and its reminder included. Bulwark skips an event that is already in the calendar you import into, so a second import doesn't make copies.

### Subscribing instead

The same Nextcloud dialog has **Share link** and **Internal link**. Bulwark can subscribe to a calendar feed by URL: **Subscribe to calendar…** in the More actions menu, or **iCal subscription** in Settings > Calendar. Bulwark's server fetches the feed, so subscriptions need Bulwark, not Bulwark Lite. Subscribing to a Nextcloud link was not tried. Not tested.

## Filters and autoresponder

Nextcloud Mail writes filters and the autoresponder to the mail server over ManageSieve, once Sieve is turned on for the account (Mail, account menu, **Account settings**, **Sieve server**). Without that, you have no Nextcloud Mail filters. It writes them into the active script, or into a new script named `nextcloud`, between `### Nextcloud Mail: ... ### DON'T EDIT ###` marker lines.

### If the mail server moved with Vandelay

Vandelay copies the account's Sieve scripts over ManageSieve and makes the script that was active on the old server active on Stalwart. This was tested with a Roundcube script, not with Nextcloud's. Vandelay skips a script named `vacation`, because Stalwart keeps that name for itself: rename such a script on the old server first.

If Nextcloud Mail already talked to Stalwart, the script is already there and nothing needs to move.

Bulwark opens the active script. Settings > Filters lists the filter part and the autoresponder part as two rules with a lock and the label "Nextcloud". You can't edit them in the visual builder; change or delete them in the raw Sieve editor.

### By copying the script

1. In Nextcloud Mail, open the account menu, **Account settings**, **Sieve script editor**. Copy the whole script from the text box.
2. In Bulwark, open Settings > Filters and click **Raw Sieve editor**.
3. Paste the script into the text box and click **Validate**.
4. Click **Save**. If the script replaces rules you made in Bulwark's visual builder, Bulwark asks **Replace your visual rules?** first.

<img class="theme-light-only" src="/screenshots/light-filters-sieve.webp" alt="Bulwark's Sieve script editor with a script from another webmail pasted in" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-filters-sieve.webp" alt="Bulwark's Sieve script editor with a script from another webmail pasted in" width="5120" height="2880" />

In the test the script with one filter and an autoresponder validated on Stalwart without changes.

Check these before you save:

- Autoresponder: Nextcloud's autoresponder is a `vacation` rule inside the script. Bulwark's own Out of office (Settings > Out of office) is a separate script. If you keep both on, both can answer the same message (Not tested). Delete the autoresponder part from the script, or leave Bulwark's Out of office off.
- The script becomes active: saving makes the script you edit the active one. A script that wasn't active on the old server runs from now on.
- Folder names: each `fileinto "..."` has to name a folder that exists on Stalwart. If a folder had another name on the old server, change it in the script.
- Dovecot-only commands: Stalwart rejects commands that only Dovecot knows, such as `pipe` from `vnd.dovecot.pipe`. **Validate** shows the line and column. Remove those rules.

## Signatures and aliases

Nextcloud Mail keeps the account signature and each alias with its name and signature in Nextcloud's database (Account settings, **Aliases** and **Signature**), with no export. Copy them by hand.

1. In Bulwark, open Settings > Account, go to **Email addresses** and click **Manage identities**.
2. Edit the identity Stalwart made for your account, or click **New identity** for an alias. The fields are Display name, Email address, Reply-To, Auto BCC, **Text signature** and **HTML signature**.

- The HTML signature field takes HTML code, not formatted text.
- Each signature field holds up to 2047 bytes. A counter under the field shows how many are used.
- Stalwart refuses an identity for an address that isn't on your account. If you sent from aliases in Nextcloud Mail, your admin adds those addresses to your account in Stalwart first.

## Text blocks

Text blocks (Mail settings, **Text blocks**) have no export. Recreate them as Bulwark templates: Settings > Composing, **Email templates**, **New template**. If you don't see templates, your admin has turned them off. Not tested.

## What has no counterpart

Quick actions, tags, trusted senders, snoozed messages, S/MIME certificates and the "important" classification are kept in Nextcloud's database, and no export for them was found. Bulwark has no snooze. In Bulwark, S/MIME comes from the [S/MIME plugin](/docs/guides/smime), which an admin installs; it isn't available in Bulwark Lite.

## Next step

See what Bulwark does with what you brought over: [Contacts](/docs/features/contacts), [Calendar](/docs/features/calendar) and [Filters](/docs/features/email#filters).
