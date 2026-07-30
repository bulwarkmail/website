---
title: Search and filters
description: Full-text search, structured filters, and search chips.
order: 2
---

# Search and filters

Search runs on the JMAP server, not in the browser, so it covers the whole mailbox rather than the messages already loaded.

## Basic search

Type in the search bar or press `/` to focus it. Results appear as you type with debounced queries.

## Advanced search panel

Click the filter icon next to the search bar to open the advanced search panel. Use the following fields to build precise queries:

| Filter             | Description                        |
| ------------------ | ---------------------------------- |
| **From**           | Filter by sender email or name     |
| **To**             | Filter by recipient                |
| **Subject**        | Search in subject line             |
| **Body**           | Search in email body text          |
| **Has attachment** | Toggle: with, without, or any      |
| **Date after**     | Emails after a specific date       |
| **Date before**    | Emails before a specific date      |
| **Read status**    | Filter read or unread emails       |
| **Starred**        | Filter starred or unstarred emails |

## Search chips

Active filters are displayed as removable chips above the email list. Each chip shows the filter type and value. Click the `×` on any chip to remove that filter, or use "Clear all" to reset.

## Cross-mailbox search

Search operates across all mailboxes by default, not just the currently selected folder. Results include emails from any folder.

## Combining filters

Filters combine with AND: every condition has to match. Pairing a text query with structured filters narrows results fastest.
