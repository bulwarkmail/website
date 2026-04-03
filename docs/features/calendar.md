---
title: Calendar
description: Calendar and event management features.
order: 2
---

# Calendar

Bulwark includes an integrated calendar powered by JMAP Calendars (RFC 8984) with server capability detection.

## Views

- **Month view** - Overview of the entire month with multi-day event spanning
- **Week view** - Detailed weekly schedule with column-based overlap layout and time-based event sorting
- **Day view** - Hour-by-hour daily agenda
- **Agenda view** - Chronological list of upcoming events
- **Task list view** - Dedicated task management view with task details, status tracking, and inline editing

Switch views with keyboard shortcuts: `M` (month), `W` (week), `D` (day), `A` (agenda), `T` (today).

## Toolbar Navigation

The desktop calendar toolbar includes prev/next navigation buttons and a date label for quick date navigation without needing to interact with the mini-calendar.

## Creating Events

Click on any time slot or use the "New Event" button (`N` shortcut) to create an event:

- Title and description
- Start and end time with automatic timezone detection
- All-day events
- Recurrence rules (daily, weekly, monthly, yearly) with client-side recurrence expansion
- Reminders and alerts with configurable notification sound
- Participant scheduling with contact autocomplete
- Virtual location input for online meetings and video calls

### Quick Create

- **Double-click** on an empty time slot for quick inline event creation (1-hour default)
- **Click-and-drag** on empty slots to create events spanning a custom time range (15-minute snap)
- Double-click in month view opens the event modal with the date pre-filled

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

## Pending Event Preview

When navigating or creating events, a pending event preview is shown in calendar views and the event modal, giving visual feedback before the event is saved.

## Hover Preview

Calendar events support hover preview with configurable settings. Hovering over an event displays a popover with event details including time, location, participants, and description without needing to open the full event modal.

## CalDAV Discovery

Bulwark includes a CalDAV discovery API with automatic calendar home resolution. This enables seamless multi-account setups where each account's calendars are automatically discovered and loaded.

## Multiple Calendars

Create and manage multiple calendars with different colors. Toggle visibility of individual calendars using the mini-calendar sidebar.

### Week Numbers

An optional setting allows displaying ISO week numbers in the mini-calendar for quick reference.

### Calendar Management

Calendar management settings include mailbox role reassignment controls, letting you change which calendar is the default or reassign special roles between calendars.

## Shared Calendar Grouping

Shared calendars from other users are visually grouped and separated in the sidebar, making it easy to distinguish your own calendars from calendars shared with you.

## iCalendar Import

Import `.ics` files with a preview dialog and bulk event creation. Batch event import is supported for importing large `.ics` files with multiple events.

## iCal/Webcal Subscriptions

Subscribe to external calendars via iCal or webcal URLs. Subscribed calendars appear alongside your own and refresh automatically. Subscription settings can be edited after creation, including URL, refresh interval, and display options.

## Real-time Updates

Calendar state changes are pushed in real-time via JMAP EventSource - no manual refresh needed.

## Event Notifications

- Client-side alert evaluation with toast display
- Configurable notification sound
- Proactive 24-hour event fetch for upcoming alerts

## Plugin Integration

Calendar events support action slots for plugins. For example, the Jitsi Meet plugin can add a "Start Meeting" button directly on calendar events with virtual locations.

## Settings

- First day of week (Sunday or Monday)
- Time format (12h or 24h) applied across calendar grids, event cards, popovers, and import previews
- Default calendar view
- Show event start time in month view
- Show week numbers in mini-calendar
- Locale-aware date formatting
- Persisted view preferences are validated so the calendar always falls back to a supported view mode
