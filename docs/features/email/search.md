---
title: Search & Filters
description: Full-text search and filtering capabilities.
order: 2
---

# Search & Filters

Bulwark leverages JMAP's server-side search for fast, full-text email search across your entire mailbox.

## Basic Search

Type in the search bar or press `/` to focus it. Results appear as you type with debounced queries.

## Advanced Search Panel

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

## Search Chips

Active filters are displayed as removable chips above the email list. Each chip shows the filter type and value. Click the `×` on any chip to remove that filter, or use "Clear all" to reset.

## Cross-Mailbox Search

Search operates across all mailboxes by default, not just the currently selected folder. Results include emails from any folder.

## Combining Filters

Multiple filters are combined with AND logic — all conditions must match. Use a combination of text search and structured filters for the most precise results.
