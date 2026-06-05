---
title: Files
description: Cloud file browser and JMAP FileNode storage features.
order: 4
---

# Files

Bulwark includes a cloud file browser for Stalwart's JMAP FileNode storage, so documents and media live alongside mail, calendar, and contacts in the same interface.

## File Browser

- Folder tree navigation with breadcrumb path over a real `FileNode` hierarchy
- Grid and list views
- Sorting by name, size, or date
- Favorites and recent files for quick access
- Bulk multi-select actions
- Right-click context menu

## Upload & Download

- Upload individual files with progress tracking
- Folder upload via drag-and-drop or toolbar button (recursive)
- **Streamed WebDAV PUT** - uploads stream straight to the server without buffering the file in memory, so multi-GB uploads work in browsers with limited memory
- Download files or entire selections
- Dynamic upload size limits read from the server's configuration so the UI knows what's allowed before you try
- Clipboard-style cut, copy, paste, and duplicate actions
- Drop zone fills the available viewport height for easy bulk drops
- Falls back to `application/octet-stream` for files with unusually long MIME types

> **Warning**
> Stalwart's FileNode storage is still maturing. Very large uploads can occasionally cause server instability, and deleted files may not be immediately purged from storage. Use with caution in production deployments.

## Preview

- Images (JPEG, PNG, WebP, GIF, SVG)
- Text (plaintext, source code with syntax highlighting)
- Audio
- Video
- PDF (in a sandboxed iframe with strict CSP)

## Organization

- Create, rename, move, and delete folders
- Files are stored as real `FileNode` records in a nested hierarchy; folders are detected as blob-less nodes and listed via `FileNode/get`
- Legacy installs that stored files under flat, slash-encoded names are migrated into the proper folder hierarchy automatically on first load
- Quick metadata visibility for size and modified date
- Recent files prune themselves automatically when underlying nodes are deleted on the server

## Integration

- Native JMAP FileNode support in Stalwart
- Unified authentication and permissions with the rest of Bulwark
- Per-account isolation when multiple accounts are connected
- Designed for fast switching between mail attachments and cloud files
