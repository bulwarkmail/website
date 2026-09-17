---
title: Search and filters
description: Full-text search, structured filters, and search chips.
order: 2
---

# Search and filters

Search runs on the JMAP server, not in the browser, so it covers the whole mailbox rather than the messages already loaded. There are two searches: the mail search bar with its filter panel, and a global palette that spans mail, contacts, calendar and files.

## Basic search

Type in the search bar or press `/` to focus it. Results appear as you type with debounced queries, and the dropdown under the bar suggests recent searches and matching contacts before you finish typing. Matching text in a result is highlighted using the server's own `SearchSnippet/get` snippets, so the highlight reflects what the server matched rather than a guess. A setting clears the search when you switch folders, for people who expect a folder click to mean a fresh list.

## Advanced search panel

Click the filter icon next to the search bar to open the advanced search panel. Use the following fields to build precise queries:

| Filter             | Description                        |
| ------------------ | ---------------------------------- |
| **From**           | Filter by sender email or name     |
| **To**             | Filter by recipient                |
| **Subject**        | Search in subject line             |
| **Body**           | Search in email body text          |
| **Has attachment** | Toggle: with, without, or any      |
| **Size**           | Larger or smaller than a given size |
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

## Global search

The search entry on the navigation rail opens a palette that queries mail, contacts, calendar events and files at once, across every account you are signed in to. Results are ranked and grouped by kind, each row carries an avatar or a tinted icon and a structured preview, and opening a hit goes through the login that owns it, so a message in a shared or secondary account opens in the right context. The same server object reached through several logins shows once.

In the Pro interface the palette has a sibling: a search tab with facets and scope chips that stays open next to your mail tabs, for the searches you keep coming back to.
