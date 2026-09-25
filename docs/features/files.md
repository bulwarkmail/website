---
title: Files
description: Cloud file browser and JMAP FileNode storage features.
order: 4
edition: both
---

# Files

Stalwart stores files as JMAP FileNodes, and Bulwark browses them. Documents and media end up in the same interface as the mail and the calendar, rather than in a separate app you have to remember to open.

<img class="theme-light-only" src="/screenshots/light-files.webp" alt="The Bulwark file browser in list view" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-files.webp" alt="The Bulwark file browser in list view" width="5120" height="2880" />

## File browser

- Folder tree navigation with breadcrumb path over a real `FileNode` hierarchy
- Grid and list views
- Sorting by name, size, or date
- Favorites and recent files for quick access
- Bulk multi-select actions
- Right-click context menu

## Upload and download

- Upload individual files with progress tracking
- Folder upload via drag-and-drop or toolbar button (recursive)
- **Streamed WebDAV PUT** - uploads stream straight to the server without buffering the file in memory, so multi-GB uploads work in browsers with limited memory
- Download files or entire selections
- Dynamic upload size limits read from the server's configuration so the UI knows what's allowed before you try
- Clipboard-style cut, copy, paste, and duplicate actions
- Drop zone fills the available viewport height for easy bulk drops
- Falls back to `application/octet-stream` for files with unusually long MIME types
- Names that Stalwart 1.0 refuses are adjusted before the upload, on 0.16 as well: a reserved name such as `con.txt` is stored as `con_.txt`, control characters become `_`, and a name longer than 255 bytes is shortened, keeping its extension

> **Warning**
> Stalwart's FileNode storage is still maturing. Very large uploads can occasionally cause server instability, and deleted files may not be immediately purged from storage. Use with caution in production deployments.

## Preview

- Images (JPEG, PNG, WebP, GIF, SVG)
- Text (plaintext, source code with syntax highlighting)
- Audio
- Video
- PDF (in a sandboxed iframe with strict CSP)

## Office documents

Word-processor, spreadsheet and presentation files open for editing in place when a WOPI-capable office server is configured. Collabora Online, OnlyOffice and EuroOffice are the ones the integration was written against. Set `WOPI_CLIENT_URL` to the editor's base URL (Bulwark fetches its discovery document from `<url>/hosting/discovery`) and, if the editor reaches the webmail on a different hostname than the browser does, `WOPI_HOST_URL` to the address it should use. Leave `WOPI_CLIENT_URL` empty and the feature is off. The demo fixtures include office documents so you can see the integration without uploading anything.

<div class="bw-note bw-note-edition"><b>Not in Lite.</b> Office editing relies on the Node.js server to broker the WOPI session, so the edit action is hidden and documents download instead.</div>

## Sharing

Files and folders can be shared with other users or groups on the server (JMAP sharing, RFC 9670). Pick the principal, grant read, read/write or manager, and the item shows a shared indicator. Anything shared with you appears under **Shared with me**.

On Stalwart 1.0, picking a principal from the server's directory needs directory queries, which are off by default. An administrator turns them on with **Allow Directory Queries** under **Settings > Files & Sharing > Sharing**; without them the list only offers your groups and the people who have shared something with you.

## Organization

- Create, rename, move, and delete folders
- Files are stored as real `FileNode` records in a nested hierarchy and listed via `FileNode/get`; each node's `nodeType` tells files, folders and links apart
- Symbolic links, which Stalwart 1.0 can store, show as links: they can be renamed, moved and deleted, but not opened or downloaded
- Legacy installs that stored files under flat, slash-encoded names are migrated into the proper folder hierarchy automatically on first load
- Quick metadata visibility for size and modified date
- Recent files prune themselves automatically when underlying nodes are deleted on the server

## Integration

- Native JMAP FileNode support in Stalwart
- Unified authentication and permissions with the rest of Bulwark
- Per-account isolation when multiple accounts are connected
- Attachments and stored files sit one click apart, so moving between them doesn't mean changing apps
