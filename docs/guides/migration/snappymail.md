---
title: Moving from SnappyMail
description: Contacts, filters, identities and settings from SnappyMail to Bulwark on Stalwart.
order: 2
---

# Moving from SnappyMail

SnappyMail keeps your contacts in its own database and your identities, signatures and settings in files in its data folder. Your filters are a Sieve script on the mail server. This page moves each of them to Bulwark. The steps were run with SnappyMail 2.38.2.1 against Stalwart 1.0.1; steps marked "Not tested." were read in SnappyMail's source but not run.

## Before you start

- Stalwart runs and has your account. See [Setting up Stalwart](/docs/getting-started/stalwart-setup).
- Your mail is on Stalwart. If SnappyMail already talked to Stalwart, it's there. If it talked to another server, such as Dovecot, move the account with Stalwart's migration tool, Vandelay ([Stalwart's migration docs](https://stalw.art/docs/migration/)). Not tested.
- You can sign in to Bulwark with that account.

Keep SnappyMail running until you're done. Every step below starts there.

## Contacts

Contacts are off in a new SnappyMail install. If your admin never turned them on (`enable` in the `[contacts]` section of `application.ini`), you have no SnappyMail address book and can skip this part.

Export from SnappyMail:

1. Open the Contacts window.
2. Open its menu (☰) and choose **Export (vcf, vCard)**. SnappyMail saves your whole address book as `contacts.vcf`.

The file is vCard 4.0 with a UID for each contact. **Export (csv)** in the same menu saves a CSV file, which Bulwark doesn't import.

Import in Bulwark:

1. Open Contacts, click **+** next to the Contacts heading at the top of the sidebar and choose **Import contacts**. **Import contacts** in Settings > Contacts opens the same dialog.
2. Click **Click to select a vCard file** and choose `contacts.vcf`. The file can be up to 5 MB.
3. Bulwark lists the contacts it found. A contact whose email address is already in your contacts is marked **Duplicate** and left unticked.
4. Click **Import**.

<img class="theme-light-only" src="/screenshots/light-contacts-import.webp" alt="Bulwark's Import contacts dialog with the contacts found in a vCard file, each with a checkbox" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-contacts-import.webp" alt="Bulwark's Import contacts dialog with the contacts found in a vCard file, each with a checkbox" width="5120" height="2880" />

What to expect:

- In the test every field arrived in Stalwart, the department included. SnappyMail adds an `X-CRYPTO` line to each contact; Bulwark ignores it.
- The test used a contact SnappyMail had imported from a vCard. A contact created in SnappyMail's own editor was not exported. Not tested.
- Bulwark imports into your default address book, whichever address book is selected.
- Stalwart refuses a contact whose UID is already in your account, so importing the same file twice doesn't create copies. Bulwark counts those contacts as not imported.

If your address book synced with a CardDAV server (Settings > Contacts > **Remote Synchronization (CardDAV)** in SnappyMail), the contacts are on that server too, and Vandelay can copy them from there over CardDAV ([Stalwart's CardDAV importer](https://stalw.art/docs/migration/import-export/import/carddav/)). Not tested.

## Filters

SnappyMail writes filters to the mail server over ManageSieve, and only when the admin turned Sieve on for your domain in SnappyMail's domain settings. Without that, you have no SnappyMail filters. Its own rules go into a script named `rainloop.user`, listed as **Simple** in Settings > Filters; other scripts on the server are listed under **Advanced**.

### If the mail server moved with Vandelay

Vandelay copies the account's Sieve scripts over ManageSieve and makes the script that was active on the old server active on Stalwart. This was tested with a Roundcube script, not with SnappyMail's. Vandelay skips a script named `vacation`, because Stalwart keeps that name for itself: rename such a script on the old server first.

If SnappyMail already talked to Stalwart, the script is already there and nothing needs to move.

Bulwark opens the active script, or the first script if none is active. Settings > Filters lists SnappyMail's rules with a lock and the label "External". You can't edit them in the visual builder; change or delete them in the raw Sieve editor.

### By copying the script

1. In SnappyMail, open Settings > Filters and the script. Click the code button (**Use Custom User Script**) to see the script as text, and copy all of it. SnappyMail has no download button for scripts.
2. In Bulwark, open Settings > Filters and click **Raw Sieve editor**.
3. Paste the script into the text box and click **Validate**.
4. Click **Save**. If the script replaces rules you made in Bulwark's visual builder, Bulwark asks **Replace your visual rules?** first.

<img class="theme-light-only" src="/screenshots/light-filters-sieve.webp" alt="Bulwark's Sieve script editor with a script from another webmail pasted in" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-filters-sieve.webp" alt="Bulwark's Sieve script editor with a script from another webmail pasted in" width="5120" height="2880" />

SnappyMail's script starts with comments that hold its rules as encoded data. Copy them along; Stalwart accepts them. In the test the rule part looked like this, and Stalwart validated the whole script without changes:

```sieve
if header :contains ["From"] "news@shop.example"
{
    fileinto "Junk Mail";
    stop;
}
```

Check these before you save:

- The script becomes active: SnappyMail doesn't activate `rainloop.user` when it saves it. In the test, the script stayed inactive and SnappyMail's Filters page showed "Inactive". Bulwark activates the script it saves, and when no script is active it opens the first one. So a SnappyMail script that never ran starts running after your first save in Bulwark. Read it before you save.
- Folder names: each `fileinto "..."` has to name a folder that exists on Stalwart. "Junk Mail" from the example exists on Stalwart; if a folder had another name on the old server, change it in the script.
- Out of office: if a script from another app holds a `vacation` rule, it runs next to Bulwark's own Out of office (Settings > Out of office), and both can answer the same message (Not tested). Delete the rule from the script, or leave Bulwark's Out of office off.
- Dovecot-only commands: Stalwart rejects commands that only Dovecot knows, such as `pipe` from `vnd.dovecot.pipe`. **Validate** shows the line and column. Remove those rules.

## Identities and signatures

SnappyMail keeps identities in a file per user, `storage/<domain>/<user>/identities` in its data folder, with no export in the app. Copy each one by hand.

1. In SnappyMail, open each identity (Settings > Accounts) and note the name, email address, reply-to, Bcc and signature. An admin can also read the `identities` file, which holds the same fields as JSON.
2. In Bulwark, open Settings > Account, go to **Email addresses** and click **Manage identities**.
3. Edit the identity Stalwart made for your account, or click **New identity**. The fields are Display name, Email address, Reply-To, Auto BCC, **Text signature** and **HTML signature**.

- The HTML signature field takes HTML code, not formatted text.
- Each signature field holds up to 2047 bytes. A counter under the field shows how many are used.
- Stalwart refuses an identity for an address that isn't on your account. If you sent from other addresses in SnappyMail, your admin adds them to your account in Stalwart first.
- SnappyMail's option to put the signature above the quoted text, and its PGP and S/MIME options per identity, have no field in Bulwark's identity form.

## Calendars

SnappyMail has no calendar, so there's nothing to move.

## Other accounts

If you added more mail accounts in SnappyMail (Settings > Accounts), add them again in Bulwark. See [Multi-account support](/docs/guides/multi-account). Not tested.

## What has no counterpart

- SnappyMail's settings (the `settings` and `settings_local` files in your data folder) have no export, and Bulwark has no import for them. Set Bulwark up again in Settings.
- PGP keys are kept in your SnappyMail data folder. Bulwark has no built-in PGP.
- S/MIME certificates are kept in your SnappyMail data folder too. In Bulwark, S/MIME comes from the [S/MIME plugin](/docs/guides/smime), which an admin installs; it isn't available in Bulwark Lite. Moving the certificates was not tried. Not tested.
- SnappyMail 2.38.2.1 has no templates.

## Next step

See what Bulwark does with what you brought over: [Contacts](/docs/features/contacts) and [Filters](/docs/features/email#filters).
