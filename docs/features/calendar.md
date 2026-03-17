---
title: Calendar
description: Calendar and event management features.
order: 2
---

# Calendar

Bulwark includes an integrated calendar powered by JMAP Calendars (RFC 8984) with server capability detection.

## Views

- **Month view** - Overview of the entire month with multi-day event spanning
- **Week view** - Detailed weekly schedule with column-based overlap layout
- **Day view** - Hour-by-hour daily agenda
- **Agenda view** - Chronological list of upcoming events

Switch views with keyboard shortcuts: `M` (month), `W` (week), `D` (day), `A` (agenda), `T` (today).

## Creating Events

Click on any time slot or use the "New Event" button (`N` shortcut) to create an event:

- Title and description
- Start and end time with automatic timezone detection
- All-day events
- Recurrence rules (daily, weekly, monthly, yearly)
- Reminders and alerts with configurable notification sound
- Participant scheduling with contact autocomplete

### Quick Create

- **Double-click** on an empty time slot for quick inline event creation (1-hour default)
- **Click-and-drag** on empty slots to create events spanning a custom time range (15-minute snap)

## Event Management

- **Drag-and-drop rescheduling** - Move events between time slots in week/day views or between dates in month view
- **Resize events** - Drag the bottom edge to change duration (15-minute snap)
- **Duplicate events** - Clone an event with a +1 day offset for editing
- **Recurring event editing** - Choose scope: this event, this and following, or all events

## Sharing & Invitations

- Send calendar invitations via iTIP scheduling messages
- Accept/decline/tentative RSVP responses with trust assessment
- Organizer and attendee UI with participant management
- Inline calendar invitation banner in email viewer - automatically detects `.ics` attachments with RSVP and import-to-calendar actions

## Multiple Calendars

Create and manage multiple calendars with different colors. Toggle visibility of individual calendars using the mini-calendar sidebar.

## iCalendar Import

Import `.ics` files with a preview dialog and bulk event creation.

## iCal/Webcal Subscriptions

Subscribe to external calendars via iCal or webcal URLs. Subscribed calendars appear alongside your own and refresh automatically.

## Real-time Updates

Calendar state changes are pushed in real-time via JMAP EventSource - no manual refresh needed.

## Event Notifications

- Client-side alert evaluation with toast display
- Configurable notification sound
- Proactive 24-hour event fetch for upcoming alerts

## Settings

- First day of week (Sunday or Monday)
- Time format (12h or 24h)
- Default calendar view
- Locale-aware date formatting
