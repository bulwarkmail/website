---
title: Composing Emails
description: Rich text editor and composing features.
order: 1
---

# Composing Emails

Bulwark's composer provides a rich editing experience for crafting emails.

## Rich Text Editor

The editor supports full formatting:

- **Bold**, _italic_, ~~strikethrough~~, and underline
- Ordered and unordered lists
- Inline hyperlinks
- Block quotes
- Code blocks

## Identity Selection

Choose which sender identity to use from the dropdown in the composer. Each identity can have its own name, email address, and signature.
The identity manager refreshes from the server after create, update, and delete operations so the composer stays in sync with server-side changes.

## Attachments

- Drag and drop files onto the compose window
- Click the attachment button to browse
- Maximum file size is determined by your Stalwart configuration
- Inline images can be pasted directly from the clipboard

## Signatures

Set up multiple signatures via identity management:

- Each identity has its own signature
- Signatures are automatically appended based on the selected identity
- Switch identities (and signatures) using the dropdown in the composer

## Templates

Insert reusable email templates from the compose toolbar:

- Browse templates by category with search and filter
- Placeholder variables (e.g., `{{recipientName}}`, `{{date}}`) are auto-filled from composer context
- Custom placeholders prompt for input on insertion
- Press `T` in the email list or `Ctrl+Shift+T` in the composer to open the template picker
- Manage templates from Settings

## S/MIME Compose Controls

- Enable or disable signing per message when an S/MIME identity certificate is available
- Enable encryption when every recipient has a known public certificate
- Unlock protected keys on demand from the composer without leaving the draft
- Keep default signing and encryption preferences in the S/MIME settings panel

## Drafts

Emails are auto-saved as drafts every 60 seconds (configurable in settings). You can also manually save with `Ctrl+S`. Drafts sync across devices via JMAP. A discard confirmation dialog appears when closing an unsaved draft.

Existing drafts can be reopened and edited — click a draft in the Drafts folder to resume editing with all content, recipients, attachments, and identity selection restored.

## Keyboard Shortcuts

| Shortcut       | Action          |
| -------------- | --------------- |
| `Ctrl+Enter`   | Send email      |
| `Ctrl+S`       | Save as draft   |
| `Ctrl+Shift+T` | Insert template |
| `Escape`       | Discard / close |
