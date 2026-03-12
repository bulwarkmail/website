---
title: Email
description: Email features and capabilities in Bulwark.
order: 1
---

# Email

Bulwark provides a full-featured email experience powered by the JMAP protocol.

## Inbox & Folders

- Unified inbox view with smart sorting
- Custom folder creation and management
- Drag-and-drop email organization
- Folder-level unread counts

## Composing

The rich text editor supports:

- **Formatting** — Bold, italic, underline, strikethrough
- **Lists** — Ordered and unordered lists
- **Links** — Inline hyperlinks
- **Attachments** — Drag-and-drop file attachments
- **Inline images** — Paste or drag images directly
- **Signatures** — Multiple signature support

### Keyboard Shortcut

Press `C` anywhere in the app to open the compose window.

## Reading

- Threaded conversation view
- Inline image rendering
- HTML and plain-text toggle
- Download or preview attachments
- Reply, reply-all, and forward actions

## Search

Bulwark leverages JMAP's server-side search for fast, full-text email search:

```
from:alice@example.com has:attachment after:2024-01-01
```

### Search Operators

| Operator         | Example                  | Description         |
| ---------------- | ------------------------ | ------------------- |
| `from:`          | `from:alice@example.com` | Filter by sender    |
| `to:`            | `to:bob@example.com`     | Filter by recipient |
| `subject:`       | `subject:meeting`        | Search in subject   |
| `has:attachment` | `has:attachment`         | Has attachments     |
| `before:`        | `before:2024-06-01`      | Before a date       |
| `after:`         | `after:2024-01-01`       | After a date        |

## Labels & Tags

Organize emails with colored labels. Labels are synced with JMAP keywords so they persist across clients.
