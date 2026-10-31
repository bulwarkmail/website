---
title: Composing emails
description: Rich text editor and composing features.
order: 1
edition: both
---

# Composing emails

The composer is a Tiptap rich-text editor. It has a plain-text mode for people who want one, signatures that follow the sending identity and reusable templates. With the S/MIME plugin installed, it can also sign and encrypt.

<img class="theme-light-only" src="/screenshots/light-composer.webp" alt="Bulwark email composer" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-composer.webp" alt="Bulwark email composer" width="5120" height="2880" />

## Rich text editor

<img class="theme-light-only" src="/screenshots/light-composer-mention.webp" alt="An @mention in the editor: the chip and the card with the person's details" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-composer-mention.webp" alt="An @mention in the editor: the chip and the card with the person's details" width="5120" height="2880" />

The formatting toolbar stays pinned to the top of the editor while a long message scrolls, and the address and subject fields stay above it. The editor supports full formatting:

- **Bold**, _italic_, ~~strikethrough~~, and underline
- A font-size picker and text and background colors
- Ordered and unordered lists
- Inline hyperlinks
- Tables (insert and edit)
- Block quotes
- Code blocks
- Inline images you can resize (sent as inline images, so a dropped image doesn't also become an attachment)

## Identity selection

Choose which sender identity to use from the dropdown in the composer. Each identity can have its own name, email address, and signature.
The identity manager refreshes from the server after create, update, and delete operations so the composer stays in sync with server-side changes.

### Auto-select reply identity

On a reply, Bulwark can pick the identity matching the address the original was sent to. Turn it on in settings, and choose whether a match means the exact address or any address on the same domain.

### Reply-to addresses

Give an identity a Reply-To address in Settings > Account > Email addresses, and replies to mail sent from it go to that address.

### From-header override and catch-all auto-reply

When you own a catch-all domain, replies to mail sent to an arbitrary alias (e.g. `marketing@yourdomain.com`) should come back from the same alias - even when it isn't a configured identity. With "Reply from the address it was sent to" turned on and "Received address matching" set to "Any address on my domains" (Settings > Composing > Replying), Bulwark pre-fills the alias as the From header. You can still override the From header manually before sending.

### Signature position

**Signature position** in Settings > Composing > Replying decides whether signatures go **before** or **after** the quoted text on a reply or forward, for all identities. The default is after. The default fallback is the primary identity's signature.

## Composer modes

There are two composer modes:

- **Rich text** - Full formatting with the rich text editor (default)
- **Plain text only** - A simplified plain text composer for users who prefer unformatted emails

Turn on "Plain text only" in Settings > Composing to always write plain text, or switch one message with Options > Plain text in the composer.

## Attachments

- Drag and drop files onto the compose window
- Click the attachment button to browse
- Maximum file size is determined by your Stalwart configuration
- Each attachment chip shows real byte progress while it uploads, and cancelling aborts the transfer rather than just hiding the chip
- Inline images can be pasted directly from the clipboard
- Resizable image component for adjusting inline image dimensions
- Direct image upload support in the rich text editor
- **Forgotten-attachment warning** - if the body mentions "attachment", "attached", etc. but no file is attached, Bulwark warns before send

## Signatures

Set up multiple signatures via identity management:

- Each identity has its own signature
- Signatures are automatically appended based on the selected identity
- Switch identities (and signatures) using the dropdown in the composer

## Templates

<img class="theme-light-only" src="/screenshots/light-templates.webp" alt="The Templates menu in the composer" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-templates.webp" alt="The Templates menu in the composer" width="5120" height="2880" />

Insert reusable email templates from the compose toolbar:

- Search templates, listed by favorites, recently used and category
- Date placeholders such as `{{date}}` and `{{sender_name}}` fill themselves in; `{{recipient_name}}`, `{{company}}` and custom placeholders are asked for when you insert the template
- Press `t` to open the template picker, as long as focus isn't in a text field
- Manage templates under Settings > Composing > Email templates

## S/MIME compose controls

These controls come from the S/MIME plugin in the extension directory, which an administrator installs. They aren't available in Bulwark Lite. Sign and Encrypt show up as items in the composer's Options menu.

- Enable or disable signing per message when an S/MIME identity certificate is available
- Enable encryption when every recipient has a known public certificate
- Unlock protected keys on demand from the composer without leaving the draft
- Keep default signing and encryption preferences in the S/MIME settings panel

## Delivery options

Next to "Request read receipt", the composer's Options menu has "Delivery notification", which asks the receiving server for a delivery status notification (DSN), and "Require encrypted delivery", which marks the message REQUIRETLS so it is never relayed over a connection without TLS. Both only show when the server supports them. Both ride on the JMAP submission; whether the far end honours them is up to that server.

## Drafts

<img class="theme-light-only" src="/screenshots/light-scheduled.webp" alt="The Scheduled folder with a message waiting to be sent" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-scheduled.webp" alt="The Scheduled folder with a message waiting to be sent" width="5120" height="2880" />

Drafts save themselves two seconds after you stop typing. They sync across devices over JMAP, and closing an unsaved draft asks for confirmation first.

Click a draft in the Drafts folder to resume it: content, recipients, attachments, and the identity you had selected all come back.

## Keyboard shortcuts

| Shortcut               | Action               |
| ---------------------- | -------------------- |
| `Ctrl/Cmd+Enter`       | Send                 |
| `Ctrl/Cmd+Shift+Enter` | Schedule send        |
| `t`                    | Open template picker |
| `Escape`               | Close the composer   |
