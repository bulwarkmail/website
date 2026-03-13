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
- Search and filter contacts list
- Contact details view with edit form

## Groups

Organize contacts into groups for easy access:

- Create custom contact groups with JMAP members map
- Add contacts to multiple groups
- Group expansion when addressing emails

## Auto-Complete

When composing an email, Bulwark auto-completes recipient addresses (To, Cc, Bcc) from your contacts stored on the JMAP server.

## Import & Export

- **Import** — vCard (.vcf) files (RFC 6350) with duplicate detection
- **Export** — Download contacts as vCard
- **Sync** — Contacts sync via JMAP with Stalwart, with local fallback when the server doesn't support contacts

## Bulk Operations

Select multiple contacts for batch actions:

- Multi-select with checkboxes
- Bulk delete
- Bulk add to group
- Bulk export to vCard
