---
title: Search & Filters
description: Full-text search and filtering capabilities.
order: 2
---

# Search & Filters

Bulwark leverages JMAP's server-side search for fast, full-text email search across your entire mailbox.

## Basic Search

Type in the search bar or press `/` to focus it. Results appear instantly as you type.

## Search Operators

Combine operators for precise results:

| Operator | Example | Description |
|----------|---------|-------------|
| `from:` | `from:alice@example.com` | Filter by sender |
| `to:` | `to:bob@example.com` | Filter by recipient |
| `subject:` | `subject:meeting` | Search in subject line |
| `has:attachment` | `has:attachment` | Only emails with attachments |
| `before:` | `before:2024-06-01` | Emails before a date |
| `after:` | `after:2024-01-01` | Emails after a date |
| `in:` | `in:sent` | Search in specific folder |
| `is:` | `is:unread` | Filter by status |

## Combining Operators

```
from:alice@example.com has:attachment after:2024-01-01 subject:report
```

## Saved Searches

Save frequently used searches for quick access. Click the star icon next to the search bar after entering a query.

## Filters

Use the filter panel to narrow results by:

- **Date range** — Custom start and end dates
- **Attachments** — With or without
- **Read status** — Read, unread, or all
- **Folder** — Specific mailbox
