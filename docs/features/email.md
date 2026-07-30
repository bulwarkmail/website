---
title: Email
description: How Bulwark handles reading, composing, searching, and filtering mail.
order: 1
---

# Email

The mail client talks JMAP. Threading, search and flag changes are all resolved on the server, and the browser hears about the result rather than going looking for it.

<img class="theme-light-only" src="/screenshots/light-viewer.png" alt="Bulwark mail reading view" width="2560" height="1440" />
<img class="theme-dark-only" src="/screenshots/dark-viewer.png" alt="Bulwark mail reading view" width="2560" height="1440" />

## Inbox and folders

<img class="theme-light-only" src="/screenshots/light-inbox.webp" alt="The Bulwark inbox with colored tags in the sidebar" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-inbox.webp" alt="The Bulwark inbox with colored tags in the sidebar" width="5120" height="2880" />

Pick one of three layouts, per user, in settings: **split** (three panes), **focused list**, or **reading pane at bottom**. The mailbox tree shows unread counts, filters down to unread only, and accepts messages dragged into it. With several accounts connected, a unified view merges their inboxes into one list.

Long mailboxes are virtualised and paginate as you scroll, and the first page of message data is prefetched at login so the inbox isn't empty while you wait.

The rest is the ordinary furniture:

- Archive into a single folder, into year folders, or into year/month folders
- Empty Junk and Trash, with a confirmation first
- Configurable hover quick-actions, and attachments shown at the top or bottom of the viewer
- Answered and forwarded status icons in the list
- Right-click a folder to manage it or to import an `.eml` file into it; the context menu header elides a long path in the middle rather than truncating it

## Composing

The editor is Tiptap: bold, italic, underline, strikethrough, ordered and unordered lists, links, tables, block quotes, and code blocks. Images can be pasted or dragged in and are embedded as data URLs so a dropped image doesn't also become an attachment, and each one can be resized in place. There is a plain-text mode for people who want one.

Which address a message leaves from is more flexible than the identity list suggests. Replies can auto-select the identity the original was addressed to, the From header can be overridden outright, and on a catch-all domain a reply to some arbitrary alias comes back from that alias even though no identity exists for it. Each identity carries its own signature and decides whether it lands above or below the quoted text.

On a reply, the quoted original stays in an editable block that preserves its own layout, so you can trim or annotate it without the formatting collapsing.

Before a message goes out, Bulwark checks the body for words like "attached" and warns you if nothing is attached. After you press send, a configurable delay holds it briefly so you can take it back, or you can schedule it for a specific time instead. Read receipts (MDN, RFC 8098) can be requested here and are answered in the viewer.

Replying to someone adds them to your trusted senders, so their images load next time without asking.

Press `c` anywhere in the app to open the composer. [Composing emails](/docs/features/email/composing) goes through all of it properly.

## Reading

Messages render in an iframe, sanitised by DOMPurify on the way in. In dark mode the HTML is recolored by luminance so a white newsletter doesn't blind you, while emoji keep their own colors. Mail that survives this badly can be forced to light mode, either per message or globally.

External content is blocked until you trust the sender, and the banner saying so sits above the attachments rather than below them. Next to it, SPF, DKIM and DMARC results are shown with the most severe SPF outcome surfaced first; on spoofed mail the "via" badge is suppressed rather than lending the message credibility.

Two formats other clients tend to give up on are handled here. TNEF (`winmail.dat`) bodies and attachments from Outlook are unpacked, and an embedded `message/rfc822` attachment is unwrapped and rendered as the email it is, after its HTML has been validated.

Attachments can be downloaded, previewed inline, or dragged straight out to the desktop. Images preview as thumbnails, PDFs render in a sandboxed object on desktop and mobile alike, and `.eml` attachments open like mail.

Around all of that: reply, reply-all and forward, a quick reply form under the message, expandable headers with a contact sidebar, move-to-mailbox, one-click unsubscribe (RFC 2369), printing, and a bottom action bar on mobile.

## Search

There is no query language to learn. The advanced panel builds the query from fields (text, from, to, subject, body, has-attachment, date before and after, read status, starred) and each one you fill in becomes a removable chip above the message list.

Queries run across every mailbox by default, not just the folder you're standing in, and they support wildcards and OR conditions on the fields the server can handle them for. Press `/` to jump to the search bar. [Search and filters](/docs/features/email/search) covers the panel in detail.

## Labels and tags

Colored labels map onto JMAP keywords, so they follow the message into any other client that reads the same account. Names and colors are set in settings.

## Export and import

Export mail to disk and import it back. Both flows are translated into every language Bulwark ships.

## Batch operations

Select several messages and archive, delete, mark read or unread, star, or move them in one action.

## S/MIME

Import PKCS#12 identities and recipient certificates from Settings, bind a certificate to an identity so signing defaults on for it, and toggle signing and encryption per message in the composer. Incoming mail decrypts automatically when the matching key is loaded, signatures are verified in the viewer, and the signer's certificate can be auto-imported so you can encrypt the reply. Older bundles using password-based encryption are supported too.

The full write-up, including the algorithm table and what each banner means, is on the [S/MIME page](/docs/guides/smime).

## Filters

Filtering happens on the server, as Sieve scripts over JMAP (RFC 9661), which means it keeps working while the browser is closed.

Build rules visually (From, To, Subject, Size, Body, Attachment, and so on, each matching against several values) with actions to move, forward, mark read, star, discard, or reject. Reorder them by dragging. An expanded view shows every rule at once for review, and if you'd rather write Sieve directly there's a raw editor with syntax validation. Edits save themselves and roll back if the server rejects the script.

The whole section only appears when the server advertises Sieve support.

## Vacation responder

<img class="theme-light-only" src="/screenshots/light-vacation.webp" alt="Vacation responder settings with a date range and an HTML auto-reply" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-vacation.webp" alt="Vacation responder settings with a date range and an HTML auto-reply" width="5120" height="2880" />

Out-of-office replies are a JMAP `VacationResponse`, which Bulwark writes and reads back as Sieve, so the server keeps answering while nothing of yours is running.

Set a subject and a plain-text body, and optionally a start and end date; leave either empty for no limit at that end. Turning on **Formatted message** adds an HTML version written in the same rich-text editor as the composer, and recipients whose client won't render it fall back to the plain text. A preview shows what actually goes out before you save.

Like filters, this needs a server that supports Sieve.

## Templates

Templates are reusable message bodies grouped by category (General, Business, Personal, Support, Follow-up, or your own). Placeholders like `{{recipientName}}` and `{{date}}` fill themselves in from whatever the composer already knows; anything custom prompts you on insertion.

Press `t` or use the compose toolbar to open the picker, which searches and filters by category. Templates are created and edited in settings.
