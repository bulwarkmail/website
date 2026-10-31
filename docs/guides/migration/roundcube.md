---
title: Moving from Roundcube
description: Contacts, filters, identities and settings from Roundcube to Bulwark on Stalwart.
order: 1
---

# Moving from Roundcube

Roundcube keeps your contacts, identities, signatures, responses and preferences in its own database. Your filters are a Sieve script on the mail server. This page moves each of them to Bulwark. The steps were run with Roundcube 1.7.5 against Stalwart 1.0.1; steps marked "Not tested." were read in Roundcube's docs or source but not run.

## Before you start

- Stalwart runs and has your account. See [Setting up Stalwart](/docs/getting-started/configuration/stalwart-setup).
- Your mail is on Stalwart. If Roundcube already talked to Stalwart, it's there. If it talked to another server, such as Dovecot, move the account with Stalwart's migration tool, Vandelay ([Stalwart's migration docs](https://stalw.art/docs/migration/)). Not tested.
- You can sign in to Bulwark with that account.

Keep Roundcube running until you're done. Every step below starts there.

## Contacts

Roundcube 1.7.5 shows three address books: Personal Addresses, Collected Recipients and Trusted Senders. Address books from LDAP or CardDAV come from plugins and are kept on those servers, not in Roundcube.

Export from Roundcube:

1. Open **Contacts** and pick an address book, or a group in it, on the left.
2. Click **Export** in the toolbar. Roundcube saves the listed contacts as `contacts.vcf`. The arrow next to **Export** offers **Export all** and **Export selected**.
3. Repeat for each address book you want to keep. Collected Recipients and Trusted Senders export the same way. Not tested.

The file is vCard 3.0. Groups are written into it as categories.

Import in Bulwark:

1. Open Contacts, click **+** next to the Contacts heading at the top of the sidebar and choose **Import contacts**. **Import contacts** in Settings > Contacts opens the same dialog.
2. Click **Click to select a vCard file** and choose `contacts.vcf`. The file can be up to 5 MB.
3. Bulwark lists the contacts it found. A contact whose email address is already in your contacts is marked **Duplicate** and left unticked.
4. Click **Import**.

<img class="theme-light-only" src="/screenshots/light-contacts-import.webp" alt="Bulwark's Import contacts dialog with the contacts found in a vCard file, each with a checkbox" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-contacts-import.webp" alt="Bulwark's Import contacts dialog with the contacts found in a vCard file, each with a checkbox" width="5120" height="2880" />

What to expect:

- In the test every field Roundcube exported arrived in Stalwart: name parts, email addresses, phone numbers, address, birthday, website, note and organisation.
- A Roundcube group arrives as a category on each of its contacts, not as a contact group. A contact in the group "Friends" gets the category "Friends", and you can filter by it in the sidebar.
- Bulwark imports into your default address book, whichever address book is selected.
- Roundcube's export has no UID for each contact. The duplicate check in the dialog compares email addresses only, so a contact without an email address is imported again if you import the file twice.

## Filters

Roundcube's filters are not in Roundcube. Its managesieve plugin writes them onto the mail server as a Sieve script, by default a filter set named `roundcube`. Out of Office and Forwarding set in Roundcube are rules in that same script.

### If the mail server moved with Vandelay

Vandelay copies the account's Sieve scripts over ManageSieve and makes the script that was active on the old server active on Stalwart. In the test, the `roundcube` script arrived and became the active script. The old server in that test was another Stalwart standing in for Dovecot; a real Dovecot server was not tested. Vandelay skips a script named `vacation`, because Stalwart keeps that name for itself: rename such a script on the old server first.

If Roundcube already talked to Stalwart, the script is already there and nothing needs to move.

Bulwark opens the active script. Settings > Filters lists Roundcube's rules with a lock and the label "Roundcube". You can't edit them in the visual builder; change or delete them in the raw Sieve editor.

### By copying the script

1. In Roundcube, open Settings > Filters, click **Actions** and choose **Download**. Roundcube saves the script as `roundcube.txt`. **Edit filter set** in the same menu shows the script as text.
2. In Bulwark, open Settings > Filters and click **Raw Sieve editor**.
3. Paste the script into the text box and click **Validate**.
4. Click **Save**. If the script replaces rules you made in Bulwark's visual builder, Bulwark asks **Replace your visual rules?** first.

<img class="theme-light-only" src="/screenshots/light-filters-sieve.webp" alt="Bulwark's Sieve script editor with a script from another webmail pasted in" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-filters-sieve.webp" alt="Bulwark's Sieve script editor with a script from another webmail pasted in" width="5120" height="2880" />

This is the script Roundcube wrote in the test for one filter and an Out of Office reply. Stalwart validated it without changes:

```sieve
require ["fileinto","vacation"];
# rule:[Out of Office]
if true
{
	vacation :subject "Away" "I am away until Monday.";
}
# rule:[Newsletters]
if allof (header :contains "from" "news@shop.example")
{
	fileinto "INBOX";
}
```

Check these before you save:

- Out of office: Roundcube's Out of Office is the `vacation` rule inside the script. Bulwark's own Out of office (Settings > Out of office) is a separate script. If you keep both on, both can answer the same message (Not tested). Delete the rule from the script, or leave Bulwark's Out of office off.
- The script becomes active: saving makes the script you edit the active one. A filter set you had switched off in Roundcube runs from now on.
- Folder names: each `fileinto "..."` has to name a folder that exists on Stalwart. If a folder had another name on the old server, change it in the script.
- Dovecot-only commands: Stalwart rejects commands that only Dovecot knows, such as `pipe` from `vnd.dovecot.pipe`. **Validate** shows the line and column. Remove those rules.

## Identities and signatures

Roundcube has no export for identities. Copy each one by hand.

1. In Roundcube, open Settings > Identities and an identity. Note the name, email address, reply-to, Bcc and signature.
2. In Bulwark, open Settings > Account, go to **Email addresses** and click **Manage identities**.
3. Edit the identity Stalwart made for your account, or click **New identity**. The fields are Display name, Email address, Reply-To, Auto BCC, **Text signature** and **HTML signature**.

- The HTML signature field takes HTML code, not formatted text. Roundcube stores an HTML signature as HTML in its `identities` table, so an admin can copy the code from there.
- Each signature field holds up to 2047 bytes. A counter under the field shows how many are used.
- Stalwart refuses an identity for an address that isn't on your account. If you sent from other addresses in Roundcube, your admin adds them to your account in Stalwart first.
- The organization of a Roundcube identity has no field in Bulwark. Put it in the signature.

## Calendars

Roundcube 1.7.5 has no calendar of its own. If you used a calendar plugin, export the calendar as an `.ics` file with that plugin and import it in Bulwark: in Calendar, open **More actions** (⋮) and choose **Import calendar…**. Not tested.

## Responses

Roundcube's responses (Settings > Responses) have no export. Recreate them as Bulwark templates: Settings > Composing, **Email templates**, **New template**. If you don't see templates, your admin has turned them off. Not tested.

## What has no counterpart

- Roundcube's preferences are stored in its database with no export, and Bulwark has no import for them. Set Bulwark up again in Settings.
- Address books from LDAP or CardDAV plugins stay on their own servers. This page doesn't cover them.

## Next step

See what Bulwark does with what you brought over: [Contacts](/docs/features/contacts) and [Filters](/docs/features/email#filters).
