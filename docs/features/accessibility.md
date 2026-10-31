---
title: Accessibility
description: The Accessibility settings, presets, keyboard use, reading aids for incoming mail and screen reader support.
order: 8
edition: both
---

# Accessibility

Bulwark has its own **Settings > Accessibility** page, in the top group next to Appearance. It collects everything that changes how the app looks, reads, sounds and reacts to the keyboard, including settings that also appear on other pages. A setting shown in two places is the same setting, so changing it on one page changes it on the other.

This page describes what the software offers. If you run Bulwark for others, the [page for admins](/docs/features/accessibility/admin) explains how to preset these options for your users, and [accessibility law for operators](/docs/legal/accessibility) covers your duties under EN 301 549, BITV 2.0 and the BFSG.

<!--
TODO: add a tested screen reader and browser matrix (EN 301 549 12.3) once there is one.
-->

## Presets

At the top of the page, a preset changes several settings at once. It is applied once: afterwards the values are ordinary settings you can change one by one, and you can apply more than one preset. Bulwark doesn't remember which preset you used.

After you apply a preset, the page lists every setting it changed, with an **Undo** button. Settings your organisation has locked are left alone.

<img class="theme-light-only" src="/screenshots/light-settings-accessibility.webp" alt="Settings, Accessibility with a preset chosen and the list of settings it changed" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-settings-accessibility.webp" alt="Settings, Accessibility with a preset chosen and the list of settings it changed" width="5120" height="2880" />

| Preset | What it changes |
| --- | --- |
| Screen reader | No reading pane next to the list (Focused list layout), no conversation grouping, the preview read out with each message, new mail announced, an actions button on each message. |
| Low vision | Larger text, more contrast, a thicker focus outline, underlined links, a large mouse pointer, toolbar labels, a minimum text size of 16 px in messages, your font and colours in messages while contrast is raised, and wide messages fitted to the window. |
| Dyslexia | Atkinson Hyperlegible, more space between lines, letters and words, a narrower reading column, and messages shown in your font and colours instead of the sender's. |
| Focus | Simple layout, no previews or sender pictures, a dot instead of unread counts, no motion. |
| Keyboard and motor | Larger targets, comfortable list density, menus and calendar previews that open on click, an actions button on each message, a thicker focus outline, wider scrollbars, notifications that stay 20 seconds, confirmation before deleting. |
| Motion and seizure safe | No animations, animated images paused, no see-through panels, no flashing alerts. |
| Deaf and hard of hearing | Visual alerts instead of sounds, and notifications that stay until you close them. |

When you apply a preset, Bulwark offers to turn on the accessibility button in the navigation bar, so the [quick panel](#the-quick-panel) is one click away.

**Reset accessibility settings** at the bottom of the page puts the page's own settings back to Bulwark's defaults, not to the defaults your organisation set. Settings your organisation locked stay as they are, and so do settings that also live on other pages, such as conversation view. Plain text mail font and Confirm before sending are not reset.

## Following your device

Bulwark follows your operating system and browser until you choose otherwise. Several settings have three choices: **System**, **On** and **Off** (or **More** and **Normal** for contrast). System is the default and means the device decides.

- **Contrast**: System follows your device's "increase contrast" setting.
- **Reduce motion**: System follows your device's "reduce motion" setting.
- **Reduce transparency**: System follows your device's "reduce transparency" setting.
- **Large targets**: System turns them on for touch screens.
- **Pause animated images**: System pauses them whenever Reduce motion is in effect, whether you turned it on in Bulwark or your device asks for reduced motion.

**Text size** scales the text size you set in your browser instead of replacing it. 100% is your browser's size, and the steps go from 87.5% to 200%. Browser zoom works on top of that.

Light and dark mode and the themes stay on the Appearance page. The Accessibility page links there.

The visual settings are applied before the page first draws, so the app doesn't flash at the wrong size or contrast while it loads.

## The quick panel

The quick panel holds the settings people need most often:

- Text size, Contrast and Reduce motion
- Single-key shortcuts
- The presets, with Undo
- A link to all accessibility settings

There are three ways to open it:

- Press **Alt+Shift+A** anywhere in the app. This works with single-key shortcuts turned off and with the button hidden.
- Turn on **Accessibility button in the navigation bar** (off by default). The button sits in the side navigation rail and opens the panel from any app. The bottom bar of the phone layout doesn't have it.
- Search for "Accessibility options" in the command palette.

The sign-in page has a small **Accessibility** button in the bottom corner. Its panel offers text size, contrast and reduce motion, so you can adjust them before you sign in. The choices are stored on the device and stay in effect after you sign in. If your provider has settings sync on and your account already has saved settings, those saved settings apply instead.

## Keyboard

Everything in Bulwark can be reached with the keyboard.

- **Single-key shortcuts** (Keyboard and focus section) turns off shortcuts that use one key, such as `j`, `k`, `e` and `#`. Turn them off if you use speech input, where a dictated letter could delete or archive mail, or if you press keys by accident. Shortcuts with Ctrl, Alt or ⌘ keep working, and so do Delete, Enter, Escape and the arrow keys.
- Shortcuts never act on the mail behind an open dialog or menu. While a dialog is open, the keys belong to it.
- **F6** moves the focus to the next pane (folders, message list, message, and so on), **Shift+F6** to the previous one. Skip links at the top of each app jump straight to the main content.
- **Ctrl+Z** (⌘Z on a Mac) undoes the last mail action: move, delete, archive, mark as read or unread, star and tag. Press it again to undo the action before that. With single-key shortcuts on, `z` does the same.
- Notifications such as "Moved to Archive" stay on screen while they have the focus. **Alt+Shift+N** moves the focus to the newest one, so you can reach its Undo button without tabbing through the page.
- **?** shows every shortcut for the app you are in. **Show shortcuts** on the Accessibility page opens the same list, which helps when single-key shortcuts are off.

| Shortcut | Action |
| --- | --- |
| `Alt+Shift+A` | Open the accessibility options |
| `Alt+Shift+N` | Go to the latest notification |
| `F6` / `Shift+F6` | Next / previous pane |
| `Space` | Select the message the focus is on (in the message list) |
| `Shift+F10` | Open the actions of the message the focus is on |
| `Ctrl+Z` / `⌘Z` | Undo the last action |
| `?` | Show shortcuts |

The rest are on the [keyboard shortcuts](/docs/guides/keyboard-shortcuts) page.

Related settings:

- **Focus outline**: Normal, Thick or Extra thick. The outline also stays visible in Windows contrast themes.
- **Always show focus**: shows the outline after clicks too, not only when you use the keyboard.

Actions that used to need dragging have a button or menu entry as well: tags, filter rules, apps in the navigation bar, accounts and tabs can be moved up and down, and a recipient can move between To, Cc and Bcc from the chip's menu.

## Text, colour and pointer

These apply to the whole app.

Text and reading:

- **Text size**, described [above](#following-your-device).
- **Font**: the theme font, Atkinson Hyperlegible, Lexend or OpenDyslexic. The fonts come with Bulwark, so they work offline. They cover Latin script.
- **Line spacing**, **Letter spacing**, **Word spacing** and **Paragraph spacing**.
- **Plain language**: simpler wording for settings and error messages, and short explanations of technical terms. Available in English and German.

Colour and contrast:

- **Contrast**: More makes text, borders and the focus outline darker or lighter on any theme, and underlines links.
- **Reduce transparency**: solid backgrounds instead of see-through and blurred panels.
- **Underline links**, in the app and in messages.
- **Show names next to colours**: tag names on messages and calendar names on events, not colour dots alone.
- **Colour-blind-safe colours**: tag, folder and calendar colours that stay distinct with red-green or blue-yellow colour blindness.

Motion:

- **Reduce motion** turns off sliding panels, transitions and smooth scrolling, also inside messages.

Pointer and touch:

- **Large targets**: buttons, menu items, list rows and switches of at least 44 pixels. Checkboxes and radio buttons grow to 24 pixels, and their label counts as part of the target.
- **Large mouse pointer** inside the app.
- **Open on hover**: turn it off and menus, previews and cards open only when clicked.
- **Actions button on each message**: a button on each row that opens the message's actions, so you don't need to hover or right-click.
- **Wider scrollbars**: the browser's own scrollbars, which are wider and easier to grab.

## Reading incoming mail

Mail comes from other people, and many messages are built with small text, fixed colours and wide layouts. These settings change how Bulwark shows them. Most are in the Mail section of the Accessibility page; Plain text mail font, Reading width and Reading mask are under Text and reading, and Pause animated images is under Motion. Read aloud and Reader view are buttons in the message view.

- **Show messages as**: Formatted or Plain text. Plain text drops a message's layout, colours and pictures. You can also switch a single message in the reader.
- **Message text size**: the text size inside messages. It stays the same for every message. "Same as the app" follows Text size.
- **Smallest text in messages**: enlarges text that a message sets smaller than this (12 to 18 px, or no minimum).
- **Use my font and colours in messages**: Never, With more contrast, or Always. Replaces the sender's font, size and colours with yours. Newsletters may look different.
- **Plain text mail font**: the font for messages sent without formatting.
- **Fit wide messages to the window**: shrinks messages that are wider than the reading pane instead of scrolling sideways.
- **Pause animated images**: shows the first frame of animated GIFs with a button to play them.
- **Reading width**: keeps lines in messages to about 80 characters.
- **Reading mask**: dims everything in a message except a few lines around the pointer, to help you keep your place.
- **Read aloud** reads a message with your browser's speech and highlights the sentence it is reading, and the word too where the browser supports it. **Read aloud speed** sets how fast. The voices are the ones your browser and operating system provide.
- **Reader view** opens a message full screen in your font, spacing, width and colours, with Read aloud built in.

## Writing mail

- When you insert an image, Bulwark asks you to describe it ("Describe this image"). You can mark it as decorative or skip the question, and change the description later with **Edit image description**. The plain text version of the message keeps the description as `[Image: ...]`.
- The template picker has an **Accessible message** example. It uses real headings and a list, keeps the text in the reader's default colours, and its text explains how to write a message that is easy to read.
- **Font for new messages** and **Text size for new messages** set what new messages start with.
- **Confirm before sending** asks before a message goes out. The warnings for a missing subject, a forgotten attachment and placeholder text are on the Composing page.

## Timing, mistakes and alerts

- **Notification duration**: how long messages such as "Moved to Archive" with their Undo button stay: 5, 10, 20 or 60 seconds, or until you close them. Errors and reminders follow it too.
- **Confirm before deleting** and **Confirm before archiving**: ask first, also for a single message.
- **Visual alerts**: flashes the tab title slowly (never faster than once a second) when new mail or a reminder arrives, and keeps reminders on screen until you close them.
- **Unread counts**: a number, a dot, or hidden.
- **Do not disturb**: no sounds or spoken announcements for new mail until you turn it off. Push notifications still show, but silently.

## Screen readers

For screen readers such as NVDA, JAWS, VoiceOver and TalkBack, Bulwark provides:

- The message list is one tab stop. Each message is read in one sentence: unread, sender, subject, date, star, attachment, and the first line if you want it. The screen reader also says where the message is in the list. `j`, `k` and the arrow keys move from message to message and the screen reader follows; `Space` selects a message, `Enter` opens it and `Shift+F10` opens its actions. A conversation says whether it is expanded, and its messages are read a level down.
- Each app has landmarks, a top-level heading and skip links, and F6 moves between the panes.
- Notifications are read out. Errors interrupt; other notices wait until the screen reader is done.
- Bulwark says when a folder or search has loaded and how many results it found, and when the connection drops.
- The folder lists say which folder is open and how many messages are unread. The Mail link in the navigation bar says the unread count too.
- The recipient fields are named, each recipient can be reached and removed with the keyboard, and adding or removing one is announced.
- The message body has a name, and the formatting toolbar is one tab stop that says which styles are on.
- Upload progress and failures for attachments are given in words.
- When an action removes the element that had the focus, the focus goes somewhere sensible instead of the top of the page: to the next message after a delete, or to the Compose button after the composer closes.

Settings in the Screen readers section:

- **Announce new mail**: says how many new messages arrived, without reading them out.
- **Read the preview in the list**: reads the first line of each message along with sender and subject.
- **Simple mode**: one column, fewer buttons and no side panels.
- **Page through the message list** (under Simple mode, shown once Simple mode is on): shows the list in pages of 50 with Next and Previous instead of endless scrolling.

The Screen reader preset sets the layout most screen reader users prefer.

## Bulwark Lite

Everything on this page works in Bulwark Lite: the settings, presets, quick panel, sign-in panel, fonts and Read aloud all run in the browser.

<div class="bw-note"><b>Note.</b> Lite has no settings sync, so accessibility settings stay on the device and browser where you set them. Use Export and Import under Settings > Backup &amp; reset to move them. In the full edition they follow you to other devices when settings sync is on.</div>

## Known limits

- Bulwark can make incoming mail easier to read, but it can't fix a message the sender built badly: images without descriptions, text inside pictures, or meaning shown only by colour.
- Custom themes and plugins come from their authors and may not meet the same contrast and keyboard standards.
- The mobile app has its own settings. The options on this page are for the webmail only for now.

To report a barrier, use the link your provider gives on the sign-in page or in the app, or open an issue on [GitHub](https://github.com/bulwarkmail/webmail/issues).

## Next step

If you run Bulwark for others, [presets and locks for admins](/docs/features/accessibility/admin) shows how to set these options for your users.
