---
title: Contacts
description: Contact management features.
order: 3
---

# Contacts

Manage your contacts directly within Bulwark using JMAP Contacts (RFC 9553/9610 ContactCard/AddressBook).

## Contact Management

- Add, edit, and delete contacts
- Multiple email addresses, phone numbers, and addresses per contact
- Organization and job title fields
- Gender handling with speakToAs structure
- Search and filter contacts list
- Contact details view with edit form
- Resizable sidebar for browsing contacts alongside details
- Multi-select with checkboxes and selection toolbar
- Pagination for large address books using maxObjectsInGet capability detection

## Address Book Directories

Organize contacts across multiple address books:

- Create and manage separate address books (directories)
- Drag-and-drop contacts between address books
- Address book picker in the contact editor
- Visual separation of address books in the sidebar

## Categories

Organize contacts with categories:

- Assign categories to contacts via the category combo box in the contact form
- Drag-and-drop contacts to a category in the sidebar
- Filter contacts by category or use the no-category filter to find uncategorized contacts

## Groups

Organize contacts into groups for easy access:

- Create custom contact groups with JMAP members map
- Add contacts to multiple groups
- Group expansion when addressing emails

## Auto-Complete

When composing an email, Bulwark auto-completes recipient addresses (To, Cc, Bcc) from your contacts stored on the JMAP server.

## Import & Export

- **Import** - vCard (.vcf) files (RFC 6350) with duplicate detection, accessible from Settings
- **Export** - Download contacts as vCard, accessible from Settings
- **Sync** - Contacts sync via JMAP with Stalwart, with local fallback when the server doesn't support contacts

## Bulk Operations

Select multiple contacts for batch actions:

- Multi-select with checkboxes
- Bulk delete
- Bulk add to group
- Bulk export to vCard
