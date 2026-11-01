---
title: Calendar
description: Views, event editing, invitations, and subscriptions in the calendar.
order: 2
edition: both
---

# Calendar

The calendar speaks JMAP for Calendars (an IETF draft) and stores events as JSCalendar (RFC 8984). Bulwark reads the capabilities the server advertises at session start and hides whatever that server cannot do.

<img class="theme-light-only" src="/screenshots/light-calendar.webp" alt="Bulwark calendar month view" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-calendar.webp" alt="Bulwark calendar month view" width="5120" height="2880" />

## Views

<img class="theme-light-only" src="/screenshots/light-calendar-week.webp" alt="The week view with events from several calendars and the day's tasks" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-calendar-week.webp" alt="The week view with events from several calendars and the day's tasks" width="5120" height="2880" />

- **Month view:** the whole month, with multi-day events drawn across the days they span
- **Week view:** the week's schedule, with overlapping events laid out in columns and sorted by time
- **Day view:** hour-by-hour agenda for one day
- **Agenda view:** chronological list of upcoming events, loading more as you scroll
- **Task list view:** tasks with their details and status, editable inline, once tasks are turned on (see [Tasks](#tasks))

Month, week and day views scroll freely: keep scrolling past the end of the month and the next one follows, rather than snapping a period at a time. The toolbar's date label and the mini-calendar follow the week in view. To page a period at a time instead, turn off **Free scrolling** in calendar settings.

## Toolbar navigation

The desktop toolbar has prev/next buttons, a "Today" button, and a date label, so you can move around the calendar without going back to the mini-calendar.

## Creating events

<img class="theme-light-only" src="/screenshots/light-calendar-create.webp" alt="Bulwark calendar event creation" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-calendar-create.webp" alt="Bulwark calendar event creation" width="5120" height="2880" />

Click any time slot, or use the **Create event** button, to create an event:

- Title and description
- Start and end time with automatic timezone detection
- All-day events
- Recurrence rules: daily, weekly, monthly, yearly or a custom rule. Stalwart 0.16.20 and later expand the occurrences on the server; on older servers Bulwark expands them itself.
- Reminders as notifications or emails, taken from the calendar's defaults or set per event (see [Reminders](#reminders))
- Participant scheduling with contact autocomplete
- Virtual location input for online meetings and video calls

### Quick create

- **Click** an empty time slot to open a quick editor beside it with a one-hour event; **More options** opens the full editor
- **Click and drag** over empty time to set the range (snaps to 15 minutes)
- **Click** a day in the month view, or the all-day row, for an all-day event
- On phones a tap opens the full editor

## Reminders

Each reminder fires a set time before the event starts, either as a **notification** in Bulwark or as an **email**.

Notifications are shown by Bulwark itself while it is open, with the sound you pick in the notification settings. Emails are sent by the mail server, so they arrive even when Bulwark is closed. Stalwart sends them; other JMAP servers may store email reminders without ever sending them.

### Calendar default reminders

Every calendar you own can have default reminders, with one list for events with a time and one for all-day events. Set them in **Settings > Calendar > Calendar management** with **Default reminders** (the bell next to the calendar, or in its ⋮ menu on a phone). All-day reminders count from midnight at the start of the day, so "1 day before" fires at midnight the day before.

A new event starts with its calendar's defaults. The event editor shows them read-only and follows the calendar and the all-day switch as you change them. To set the event's own reminders, click **Customize**: the defaults are copied into rows you can edit, remove or add to. **Use calendar defaults** switches back.

When an event is saved with the defaults, Stalwart copies them into the event. Changing a calendar's defaults later doesn't change events that already exist; they keep the reminders they were saved with. To give an existing event the current defaults, open it, click **Customize** and then **Use calendar defaults**, and save.

Reminders that the editor can't show as rows, such as ones at a fixed date and time or after the start (often created by other calendar apps), are kept unchanged when you save the event.

## Event management

<img class="theme-light-only" src="/screenshots/light-calendar-event.webp" alt="An event opened from the week view, with participants and the response buttons" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-calendar-event.webp" alt="An event opened from the week view, with participants and the response buttons" width="5120" height="2880" />

- **Drag-and-drop rescheduling:** move events between time slots in week/day views or between dates in month view
- **Resize events:** drag the top or bottom edge to change the start or the duration, in 15-minute steps
- **Duplicate events:** clone an event with a +1 day offset for editing
- **Recurring event editing:** choose scope: this event, this and following, or all events. On Stalwart 0.16.20 and later each occurrence is addressed by the synthetic id Stalwart gives it, so an edit to one Tuesday cannot land on another; on older servers Bulwark saves the change as an override on the recurring event
- **Overlap layout:** events that overlap are laid out in columns rather than stacked, so none of them gets truncated
- **Timezone-aware formatting:** event start times display in the user's locale and timezone consistently across grids, popovers, and import previews

## Sharing and invitations

<img class="theme-light-only" src="/screenshots/light-invite.webp" alt="An invitation in the mail reading pane with Accept, Maybe and Decline" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-invite.webp" alt="An invitation in the mail reading pane with Accept, Maybe and Decline" width="5120" height="2880" />

- When you save an event with participants, Stalwart sends the iMIP invitations and updates (RFC 6047); Bulwark asks it to and sets the organizer with `organizerCalendarAddress`. Saving without invitations is offered when the server refuses to send them.
- Accept, decline or tentative RSVP that checks whether the invitation can be trusted
- Organizer and attendee UI with participant management, including each attendee's free/busy status (`Principal/getAvailability`) while you pick a time
- Invitations and updates that arrive as `CalendarEventNotification` objects surface in the app, and invitations you send go out under your default `ParticipantIdentity`
- An invitation banner in the email viewer detects `.ics` attachments and offers RSVP and import-to-calendar actions
- Collapsible details on the invitation banner
- ICS attachments are hidden from the attachment list when the invitation banner is shown
- Shared calendars across accounts via JMAP sharing, with per-viewer colors so each user can recolor a shared calendar without affecting others

<img class="theme-light-only" src="/screenshots/light-calendar-availability.webp" alt="A new event with attendees added, each with their busy times shown next to the chosen slot" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-calendar-availability.webp" alt="A new event with attendees added, each with their busy times shown next to the chosen slot" width="5120" height="2880" />

<div class="bw-note"><b>Note.</b> On Stalwart 1.0, free/busy and the list of people you can share a calendar with depend on directory queries, which are off by default. An administrator turns them on with <b>Allow Directory Queries</b> under <b>Settings &gt; Files &amp; Sharing &gt; Sharing</b> in the web admin. Stalwart 1.0 also accepts at most 20 participants per event; an administrator can change that with <b>Max iCal Attendees</b> under <b>Settings &gt; Calendar &amp; Contacts &gt; Calendar</b>.</div>

## Suggest times

When you organise an event with attendees, **Suggest times** under the attendee list proposes up to five free slots in the next ten working days, as long as the event you are planning. Pick one and the event moves there. It uses your working days and day hours from Settings > Calendar and your time zone, and treats tentative time as busy.

Bulwark can only see busy times in calendars that are shared with you, or with a group you are in. People it couldn't check are listed under **Not checked**: outside your organisation, not found on the server, or "busy times unknown" when it sees no busy time at all and can't tell whether they are free or haven't shared. The suggestions are free for everyone else. Your administrator can set up the sharing for everyone; see [Find a time](/docs/guides/organisation/find-a-time).

## Share your free/busy

**Free/busy** in Settings > Calendar shares the busy times of your default calendar, not what your events are, with a group: the one your organisation chose, or one of your own groups. The same button shows under Suggest times when some people's busy times are unknown. Once shared, it says so instead, and the share is listed with your calendar's other shares.

## Answer for someone else

When someone shares their calendar with you with edit access, an invitation in their calendar shows **Answer for** with their name. Your answer goes out as theirs: the organiser gets the reply from them, with your address as the sender on their behalf (SENT-BY). In their own view of the event they see **Answered by** with your address. When they answer themselves later, your name is taken off.

- With only read access, or the right to answer their own invitations, you see a note that you can't answer for them and should ask for edit access. Stalwart doesn't allow it with less.
- In a group mailbox's calendar you answer as the group, without your name: you are a member, not a delegate.
- If you are invited too, Stalwart 1.0 shows both: your own answer, sent from your own copy of the event, and the answer for the owner. Stalwart 0.16 can't tell the two answers apart, so there the owner has to answer for themselves.

Stalwart doesn't keep SENT-BY in the organiser's stored copy of the event, and its reply mail doesn't name you. Calendar apps that show "on behalf of" read it from the reply's calendar data.

## Pending event preview

While you are creating or moving an event, the calendar grid and the event modal both show it in its pending position, before anything is saved.

## Hover preview

Hovering an event opens a popover with its time, location, participants, and description, so you don't have to open the modal to read it. **Event hover preview** in Settings > Calendar sets the delay (instant to 2 seconds) or turns it off.

## CalDAV address

Settings > Calendar > Calendar management has **Copy CalDAV URL** for each calendar, including ones shared with you, so you can add it to a desktop or phone calendar app. Bulwark finds the address on the server for you. The calendars themselves load over JMAP.

<div class="bw-note bw-note-brand"><b>Not in Lite.</b> The CalDAV address lookup and iCal / webcal URL subscriptions both go through the Node.js server. Lite hides them in Settings and in the import dialog, but the calendar's ⋮ menu still shows <b>Subscribe to calendar…</b>, and a subscription made there fails. Importing an <code>.ics</code> file still works, as does everything that is plain JMAP.</div>

## Multiple calendars

Create and manage multiple calendars with different colors. Toggle visibility of individual calendars using the mini-calendar sidebar.

## Birthday calendar

Bulwark auto-generates a read-only birthday calendar from your contacts. February 29 birthdays are clamped to a valid day in non-leap years. It is off by default; turn on **Contact birthday calendar** in Settings > Calendar.

## Company calendars

Calendars your organisation set up, such as holidays or office closures, show under **Organisation** in the sidebar. They are read-only. Click one to hide it, and again to show it (on phones, in the calendar list of the toolbar). With settings sync on, the choice follows you to your other devices. Their events don't make you busy for other people. See [Company calendars](/docs/guides/organisation/company-calendars) for administrators.

## Out-of-office blocks the calendar

When your out-of-office reply in Settings > Out of office has a start and an end, **Block my calendar** under the dates puts a busy event for that time in your calendar, so people don't book you while you are away. It is on by default; your organisation may have set it for you. The event moves when you change the dates and goes away when you switch the reply off before it starts. If you change the event yourself, Bulwark leaves it alone. See [Out-of-office](/docs/guides/organisation/out-of-office) for details.

### Week numbers

**Show week numbers** in Settings > Calendar adds week numbers to the mini-calendar (ISO numbers when the week starts on Monday).

### Calendar management

Settings > Calendar > Calendar management lists your calendars to rename, recolour, reorder, share, clear or delete, with default reminders for each. To make a calendar the default, right-click it in the calendar sidebar and choose **Set as default**.

## Shared calendar grouping

Calendars shared with you are grouped separately in the sidebar, below your own.

<img class="theme-light-only" src="/screenshots/light-calendar-shared.webp" alt="The week view with a colleague's shared calendar listed below your own calendars in the sidebar" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-calendar-shared.webp" alt="The week view with a colleague's shared calendar listed below your own calendars in the sidebar" width="5120" height="2880" />

## iCalendar import

Import `.ics` files with a preview dialog. Events are created in bulk, and large `.ics` files with many events are imported in batches.

## iCal and webcal subscriptions

Subscribe to external calendars via iCal or webcal URLs. Subscribed calendars appear alongside your own and refresh automatically. Subscription settings can be edited after creation, including URL, refresh interval, and display options.

Bulwark's server fetches the feeds. If it has to go through a proxy to reach the internet, set [`NODE_USE_ENV_PROXY=1`](/docs/getting-started/configuration/environment-reference#node_use_env_proxy) with `HTTPS_PROXY`.

## Real-time updates

Calendar changes are pushed in real time over JMAP push, so you don't have to refresh by hand. Push reconnects automatically across network blips and preserves any active search/filter state.

## Event notifications

- Notification reminders are evaluated in the browser and shown as toasts; email reminders are left to the server
- Configurable notification sound
- Events for the next 24 hours are fetched ahead of time so alerts fire on schedule

## Tasks

<img class="theme-light-only" src="/screenshots/light-tasks.webp" alt="The task list with due dates and calendars" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-tasks.webp" alt="The task list with due dates and calendars" width="5120" height="2880" />

The task list view shows tasks with due dates, priority, and completion status. Tasks created in other CalDAV clients (such as Thunderbird) show up alongside the ones made in Bulwark. Moving a task to a calendar of another account copies it there and removes the original, since JMAP has no move between accounts.

Tasks are off by default. Turn on **Enable tasks** in Settings > Calendar to get the Tasks view; **Show tasks on calendar** then also puts them in the month, week and day views. An administrator can hide the switch with the Calendar Tasks policy.

## Plugin integration

Plugins can add buttons to the event editor. For example, the Jitsi Meet plugin from the extension directory adds **Add Jitsi meeting**, which fills in the meeting link (it needs its small sidecar service).

## Settings

Settings > Calendar has the default view (month, week, day or agenda), **Show time in month view**, **Light event colors**, **Show week numbers**, **Limit visible hours**, **Hide non-working days**, **Free scrolling**, **Event hover preview**, **Contact birthday calendar**, **Organize invitations as**, **Parse email invitations** and the tasks switches. Persisted view preferences are validated so the calendar always falls back to a supported view mode.

First day of week (Monday, Saturday or Sunday), 12- or 24-hour time, time zone and date format are in Settings > General and apply to the whole app, including calendar grids, event cards, popovers and import previews.

## Next step

Go on to [Contacts](/docs/features/contacts), where the birthday calendar gets its dates.
