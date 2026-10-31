---
title: Search and filters
description: Full-text search, structured filters, and search chips.
order: 2
edition: both
---

# Search and filters

Search runs on the JMAP server, not in the browser, so it covers the whole mailbox rather than the messages already loaded. There are two searches: the mail search bar with its filter panel, and "Search everything", a palette that spans mail, contacts, calendar and files.

## Basic search

<img class="theme-light-only" src="/screenshots/light-search.webp" alt="Search results for a word, with the folder of each match" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-search.webp" alt="Search results for a word, with the folder of each match" width="5120" height="2880" />

Type in the search bar or press `/` to focus it, then press Enter. While you type, the dropdown under the bar suggests recent searches and matching contacts. Matching text in a result is highlighted using the server's own `SearchSnippet/get` snippets, so the highlight reflects what the server matched rather than a guess. A setting clears the search when you switch folders, for people who expect a folder click to mean a fresh list.

## Advanced search panel

<img class="theme-light-only" src="/screenshots/light-search-filters.webp" alt="The advanced search panel over the results" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-search-filters.webp" alt="The advanced search panel over the results" width="5120" height="2880" />

Click the filter icon next to the search bar to open the advanced search panel. Use the following fields to build precise queries:

| Filter             | Description                        |
| ------------------ | ---------------------------------- |
| **From**           | Sender name or address             |
| **To**             | Recipient name or address          |
| **Subject**        | Text in the subject line           |
| **Has the words**  | Text in the message body           |
| **Date**           | Any time, past week, month or year, or a custom range |
| **Size**           | Larger than a few MB, or a custom range in KB |
| **Search in**      | All folders except Spam and Trash, all folders, or one folder |

Above the fields, on/off chips filter by **Unread**, **Read**, **Starred** and **Attachments**. Starred and Attachments can be flipped to their opposite, **Not starred** and **No attachments**.

## Search chips

Active filters are displayed as removable chips above the email list. Each chip shows the filter type and value. Click the `×` on any chip to remove that filter, or use "Clear all" to reset.

## Cross-mailbox search

Search covers all folders except Spam and Trash by default. "Search in" in the filter panel switches to all folders or to one folder; a search started from Spam or Trash looks only there.

## Combining filters

Filters combine with AND: every condition has to match. Pairing a text query with structured filters narrows results fastest.

## Results from plugins

Installed [plugins](/docs/guides/plugins) can add their own results to a search, for example from an archive or a ticket system. They show as a block above the messages, one group per plugin, and the message list doesn't wait for them. A result that names a message opens it in the reader.

## Global search

<img class="theme-light-only" src="/screenshots/light-search-palette.webp" alt="The global search palette in the Pro interface" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-search-palette.webp" alt="The global search palette in the Pro interface" width="5120" height="2880" />

Open "Search everything" from the command palette (`Ctrl/Cmd+K`). In the Pro interface (Settings → Appearance → Experimental → Pro interface (experimental), shown with "Show advanced settings"), `Ctrl/Cmd+K` and the search entry at the top of the navigation rail open it directly. The palette queries mail, contacts, calendar events and files at once, across every account you are signed in to. Results are ranked and grouped by kind, each row carries an avatar or a tinted icon and a structured preview, and opening a hit goes through the login that owns it, so a message in a shared or secondary account opens in the right context. The same server object reached through several logins shows once.

In the Pro interface the palette has a sibling: "Show all results" opens a search tab with facets and scope chips that stays open next to your other Pro tabs, for the searches you keep coming back to.
