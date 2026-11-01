---
title: Moving from another webmail
description: What moves on its own when you switch to Bulwark, and what you move by hand, for Roundcube, SnappyMail and Nextcloud Mail.
order: 13
---

# Moving from another webmail

Your mail lives on the mail server, not in the webmail. If your mail server is moving to Stalwart too, moving the mail is Stalwart's job: its migration tool, Vandelay, copies an account from IMAP, CardDAV, CalDAV, ManageSieve and other sources into Stalwart ([Stalwart's migration docs](https://stalw.art/docs/migration/)). Bulwark doesn't move mail between servers. What you move by hand is what the old webmail kept for itself: contacts, identities and signatures, canned replies, settings. Filters are the exception. All three webmails below save them as Sieve scripts on the mail server, so they travel with the account.

The pages for each webmail were checked by running it in Docker against Stalwart 1.0.1, exporting what it can export, and feeding the result through Bulwark's own import code into Stalwart. Steps marked "Not tested." were read in the product's docs or source but not run.

| What | [Roundcube](/docs/guides/migration/roundcube) | [SnappyMail](/docs/guides/migration/snappymail) | [Nextcloud Mail](/docs/guides/migration/nextcloud-mail) |
| --- | --- | --- | --- |
| Mail and folders | Stalwart's migration tool | Stalwart's migration tool | Stalwart's migration tool |
| Filters | On the mail server: the migration tool copies them, or you paste the script into Bulwark | Same, if Sieve was turned on for the domain | Same, if Sieve was turned on for the account |
| Contacts | vCard export, import in Bulwark | vCard export, if the admin turned contacts on | From Nextcloud Contacts: vCard download, or the migration tool over CardDAV |
| Calendars | None in Roundcube itself | None | From Nextcloud Calendar: .ics export, or the migration tool over CalDAV |
| Identities and signatures | By hand | By hand | By hand |
| Canned replies | Responses, recreated by hand as templates | None | Text blocks, recreated by hand as templates |

Moving the mail itself with Vandelay was not run for these guides. Not tested.

Vandelay doesn't carry passwords, aliases, account settings, groups, sharing rights or server-wide Sieve scripts (Stalwart's guide lists them under "Items not carried over"). If you sent from more than one address, your admin adds those addresses to your account in Stalwart before you set up your identities in Bulwark.

## Next step

Pick the page for the webmail you're leaving: [Roundcube](/docs/guides/migration/roundcube), [SnappyMail](/docs/guides/migration/snappymail) or [Nextcloud Mail](/docs/guides/migration/nextcloud-mail).
