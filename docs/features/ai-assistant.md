---
title: AI assistant
description: The AI Assistant plugin: a chat next to your mail, calendar, contacts and files, what it can do for you, what it sends to the AI service, and how admins set it up.
order: 9
edition: full
editionNote: "The assistant is a plugin, and plugins don't run in Bulwark Lite."
---

# AI assistant

The AI Assistant is a plugin that puts a chat next to your mail. Ask it about the open message, let it write or rewrite yours, have it look things up in your mail, calendar and contacts, or let it do small tasks for you, such as filing a message or adding an event. It works with an OpenAI-compatible service (OpenAI, Ollama, LM Studio, vLLM and others) or the Anthropic Messages API. Your admin installs it and picks the service.

Nothing goes to the AI service until you ask the assistant something. Before the first request to a service you see which service it is, which server your text goes to and which model answers, and you have to confirm. That notice lists what the assistant sends, and it comes once more when an update makes it send more.

<div class="bw-note bw-note-brand"><b>Next release.</b> This page describes version 2.2 of the plugin. The parts marked "from 1.20" need the next webmail release after 1.19.1. On 1.19.1 the plugin installs and works, and leaves those parts out.</div>

## Where you find it

- **In the composer**: click **Assistant** in the composer's bottom bar or press **Alt+A**. The assistant opens as a panel next to the message. Alt+A or the arrow at its top folds it again; drag its edge to make it wider.
- **Next to a message**: click **Assistant** in the toolbar of the open message.
- **On selected text**: right-click a passage in the message you read or write. The menu offers Improve writing, Fix spelling, Shorten, Translate and Ask the assistant in the composer, and Explain, Translate and Draft a reply in the reader.
- **In Calendar, Contacts, Files and Settings** (from 1.20): the panel button at the end of the toolbar row opens the assistant, in the same place as next to a message. It is the same chat as in Mail and knows what you have open there: the event, the contact, the selected files and the folder, or the settings page. A chip in the input says which. In Files the assistant and the details panel take turns.
- **Alt+A** outside the composer opens and closes the panel of the view you are in, or the one next to the message. The composer keeps its own Alt+A.
- **On phones** there is no side panel. In the reader the actions sit in a bar above the message, and the composer opens the assistant in a dialog. From 1.20 the panel button in the header of Calendar, Contacts, Files and Settings (and Settings on screens narrower than 1024 px) opens the assistant as a dialog that stays above the keyboard. In Contacts the button also sits over an open contact.

## Quick actions

Quick actions sit above the chat. Or type what you want in your own words.

- **Writing**: Improve, Shorten, Formal, Casual, Fix spelling and Translate (32 languages; the last one you used is remembered). An empty message gets written from your description. A proposal comes in as a marked change, removed words struck out and new ones highlighted. Replace, Insert below or Insert at cursor puts it into the message, and Ctrl+Z takes it back. Fix spelling lists each correction to accept or keep. The signature and the quoted message of a reply are never sent or changed.
- **Reading**: Summarize, To-dos and dates (a checklist to copy), Reply ideas (three short replies, each opens in the composer) and Translate. Draft a reply writes a reply you open with one click. Highlight a passage and the panel offers Explain, Translate and Draft a reply for that part. Above a conversation, Summarize this conversation covers up to its last 20 messages.
- **Other views** (from 1.20): What's on this week? in Calendar, Last mails with the open contact in Contacts, Summarize this file for one selected file in Files (when the assistant may read files), and Explain this page in Settings.

Answers come as formatted text and can carry cards: quick replies to click, time slots, a checklist, people, a table. In the composer a card's text goes into the message where the cursor is.

## Lookups

When an answer needs it, the assistant looks things up and shows each lookup as a step in the chat, with a card of what it found:

- your **calendar** ("propose a time next week when I'm free")
- your **contacts** ("send it to Anna from accounting")
- your **mail** ("what did Carol write about the invoice?"): it searches, lists the messages it found and reads the one that matters
- **the message you reply to**
- **your settings** ("why are messages marked read so fast?")
- your **message templates**, with chat tools on

It also knows the app itself: its name and version, your account and mail server, and where each setting is. Asked "how do I set up an automatic reply?", it names the page and the setting as you see them, in your language. You can turn lookups off in the plugin's settings.

## Actions

When you turn them on, the assistant can also do things for you: archive a message, move it to a folder, mark it read, unread, starred or not, add a calendar event, a task or a contact, and open a reply or a new message in the composer with the text it drafted. It never sends and never deletes mail; a reply waits in the composer for you.

Each action shows as a card with what it will do ("Move “Invoice 42” to Projects 2026"). Settings > AI Assistant > Actions has two modes:

- **Ask me first**: the card waits with Do it and Skip, and nothing happens until you click Do it.
- **Automatic**: the action runs at once and the card offers **Undo**. Archive, move and marks go back; an event, task or contact is deleted again. After five actions in one answer the assistant asks first anyway.

Actions are off until you turn them on, and your admin decides how far you may go. Some actions always ask first, whatever the mode: One reply to all (see [More context](#more-context)), a note it should remember, and a template it fills in or saves. The model is told to act only when you ask or agree, never because a message tells it to. For mailboxes that get mail from strangers, ask first is the safer mode.

## More actions

<!-- TODO(C) -->

## Files

<!-- TODO(D) -->

## More context

From 1.20, next to an open message the assistant can read more than the message's text when your question needs it. Chips in the input box show what it may read; the x on a chip takes it out.

- **Attachments**: PDF (up to 50 pages), Word, Excel (up to 5 sheets of 2,000 rows), PowerPoint, OpenDocument, text, CSV, HTML, calendar and contact files. Ask "what is on the agenda?" and it reads the file. It tells you when a file is too big (over 20 MB), protected with a password, scanned without a text layer, or of a kind it can't read, such as old .doc, .xls and .ppt files.
- **Pictures**: attached images and pictures in the message go to the model as images when the model can see them. They are made smaller in the webmail first. Tracking pixels and tiny images are left out, and remote images are never loaded. A model that can't see images only gets the file name and the picture's description. The date and place a photo was taken go along only when you ask for them and have switched on **Send a photo's date and place** (off by default).
- **This conversation**: every message of the open conversation, without the quoted earlier mail, up to 50.
- **Messages selected in the list**: tick two or more messages and the panel shows a chip like "3 messages". The Actions menu then offers Summarize these, What do I have to do? and, with actions on, One reply to all: a new message to everyone who wrote them, which always asks first. Up to 50 messages are read.
- **@ mentions**: type `@` and a few letters to add a message or a contact to the chat.

One request reads at most 60,000 characters and 8 pictures (4 per message) in all. You can switch reading attachments, looking at pictures and reading whole conversations off in the plugin's settings.

## Chat tools

- **Earlier chats**: next to a message the assistant keeps one running chat across the messages you open. When the panel opens after 8 hours without use, that chat moves to Earlier chats and a fresh one starts; **New chat** does the same at once. The clock button in the panel's header opens the list: search the chats, read one, **Continue this chat**, rename or delete. The newest 30 chats are kept, at most 400 KB together, in this browser only. The composer keeps its own chat per draft.
- **Saved prompts**: add your own in Settings > AI Assistant > Chat, a name and the text to send. Your admin can add prompts for everyone. Both are in the panel's Actions menu and run like a typed request, on the message or text the panel works on.
- **Slash commands**: type `/` at the start of the input for a list of the quick actions and saved prompts. Type to filter, arrow keys move, Enter runs, Tab completes the name, Escape closes the list.
- **Edit and Answer again**: the pencil next to your last question puts it back into the input; sending replaces that question and its answer, and Escape stops editing. **Answer again** asks for a new last answer while the message it was about is open. Neither is offered after an answer that did something, so nothing happens twice.
- **Notes it remembers**: say "Remember that my manager is Jan". The assistant asks before it keeps a note, and notes need actions on. At most 50 notes of 200 characters, kept in this browser and sent with every request. Settings > AI Assistant > Chat lists them to change or delete, and has a switch to stop using them. Undo on the card removes a note again.
- **Templates**: with lookups on, the assistant can read your message templates. In the composer it can put one into the draft at the cursor, below what you selected and never over it, filling in the placeholders it knows. When it fills in values it asks first and the card lists them. It can save a reply as a new template after you agree, and Undo deletes it again.

When the browser storage is full, New chat and the 8-hour split first drop the oldest earlier chats; if that isn't enough the chat stays as it is and the panel says so.

## Catch me up

From 1.20, **Catch me up** is in the Actions menu and a button in the empty panel whenever no message is open, as in Calendar, Contacts, Files and Settings. It needs lookups on. It lists what came in and what is due:

- unread mail in the inbox since your last visit, sorted into what needs an answer and what is for your information
- today's events
- open tasks due today or earlier
- mail you sent in the last week that nobody answered yet

Your last visit is when the webmail was last open before now (the assistant notes the time every few minutes while it is open), or your last Catch me up. The first time it covers the last day. In the settings you can turn Catch me up off, or leave out the check for mail waiting for a reply.

## What is sent to the AI service

Only what a request needs, and only when you ask something. The privacy notice before the first request lists the same, and names lookups, actions and the newer parts only when they are switched on.

| When you | What is sent to the AI service |
| --- | --- |
| Ask anything | Your name, addresses, plain-text signature, time zone, local time and language, the names of the app and your mail server, the standing instructions (the admin's and yours), and the earlier turns of the chat |
| Ask anything, with notes kept | The notes you asked it to remember |
| Describe an empty message | Your description and the subject |
| Use a writing quick action | The selected text, or your own text of the message (no signature, no quote) |
| Type a request in the composer | The same text, the subject, and whether it is a reply and to what |
| Use a reading quick action or ask about a message | Sender, date, subject and text of the open message, and the passage you highlighted |
| Summarize a conversation | Sender, date, subject and text (without quotes) of up to 20 messages |
| Run a saved prompt or a `/` command | The prompt's text, as if you typed it, with the message or text the panel works on |
| Ask something that needs a lookup | What the lookup found: calendar events of the days asked for, matching contacts, the messages a mail search found (sender, date, subject, preview), the text of a message it reads, the message you reply to, and the settings it reads |
| Ask about your templates | The names, categories, subjects, placeholders and the first 300 characters of your templates |
| Let it do something | What the action did, and the names of your folders when it files a message |
| Ask anything with a message open (more context on) | The names, types and sizes of its attachments, the descriptions of its pictures, and how many messages its conversation has; with messages ticked in the list, how many |
| Ask about an attachment | Its text (up to 20,000 characters, more when the model asks, at most 60,000 per request with everything else it reads), or the picture itself, made smaller, when the model can see images (otherwise its name and description) |
| Ask when or where a photo was taken (with **Send a photo's date and place** on) | The date and place stored in the photo |
| Ask about the conversation | Sender, recipients, date, subject and text (without quotes) of every message in it, up to 50 |
| Ask about messages you selected in the list | The same for up to 50 of them, and how many you selected |
| Mention a message or contact with @ | The message's sender, date and subject (its text when the model reads it), or the contact's name, addresses and company |
| Ask in Calendar, Contacts, Files or Settings | What you have open there: the event (title, time, place, participants, description), the contact (name, addresses, phones, company, dates, notes) and how many contacts are ticked, the names, types, sizes and dates of up to 20 selected files and the folder's path, or the settings page's name |
| Use Catch me up | Your unread inbox mail since your last visit (sender, recipients, date, subject, preview, message id), today's events (time, title, place), your open tasks due today or earlier (title, due date), and the sent mail of the last week that is waiting for a reply (the same fields as the unread mail). They go with that one request; the chat keeps only the answer and its cards |

<!-- TODO(C): rows for More actions -->
<!-- TODO(D): rows for Files -->

Earlier chats are not sent; only the running chat's last turns are. Mail text goes to the model between tags, and the model is told it is data, not instructions, so a message that says "ignore your instructions" gets summarised, not obeyed. Very long texts are cut at 30,000 characters.

The API keys stay on the webmail server. The plugin asks the server to send each request with the admin's key (or the key you connected yourself), and the server only sends it to the address set up for it. In the browser the plugin keeps your choices, the services you confirmed, the chats, your saved prompts and notes, and when the webmail was last open.

## What it never does

- It never sends mail. A reply or a new message waits in the composer for you.
- It never deletes mail.
- It never forwards mail, and never creates a filter or a setting that forwards or redirects it.
- It never shares a file, a folder or a calendar, and never makes a public link.
- It never moves your data out of your account.

## Settings for users

Settings > AI Assistant shows which service and model you use. There you can:

- pick another model, or the other service when both are set up
- hide the assistant next to messages
- turn lookups off
- turn actions on, as ask first or automatic, as far as your admin allows
- add standing instructions of your own ("I am a teacher, keep my emails short and warm"); they come after the admin's, so yours win when the two disagree
- under **More context** (from 1.20): Read attachments, Look at images, Send a photo's date and place (off by default), Read the whole conversation
- under **Chat**: your saved prompts, your notes and the switch to stop using them
- under **Other views and Catch me up** (from 1.20): Show in Calendar, Contacts, Files and Settings, Offer Catch me up, Look for mail waiting for a reply
- connect your own API key, when your admin allows it. You type the key into the webmail's own dialog, so the plugin never sees it; it is stored encrypted on the server. With your own key you also set **My model can see images**.

## For administrators

Install the plugin in the admin console under Plugins, from the [marketplace](/docs/guides/marketplace) or as `ai-assistant.zip` from the [plugins repository](https://github.com/bulwarkmail/plugins), then fill in its settings on its page. Set up one or both services.

| Setting | Key | What it does |
| --- | --- | --- |
| Default service | `defaultProvider` | Which service users get when both are set up: `openai` (default) or `anthropic` |
| OpenAI-compatible API address | `openaiBaseUrl` | Up to and including `/v1`, such as `https://api.openai.com/v1` or `http://ollama:11434/v1`. Empty: not offered |
| OpenAI-compatible API key | `openaiKey` | The key; stays on the server. Ollama needs none, but the field must not be empty: enter any text |
| OpenAI-compatible model | `openaiModel` | Such as `gpt-4o-mini`, or `qwen2.5:7b` on Ollama (default `gpt-4o-mini`). Users may pick another |
| Anthropic API address | `anthropicBaseUrl` | `https://api.anthropic.com/v1`, or a gateway that speaks the Messages API. Empty: not offered |
| Anthropic API key | `anthropicKey` | The key; stays on the server |
| Anthropic model | `anthropicModel` | Such as `claude-haiku-4-5` (the default). Users may pick another |
| Instructions for the assistant | `instructions` | Standing instructions for everyone, added to every request: house style, sign-offs, languages, things never to say. Several lines from 1.20; on older versions one line, so separate them with semicolons |
| Actions | `actions` | The most users may choose: `off`, `manual` (ask first) or `auto` (automatic allowed, the default). Each user starts with actions off |
| Let users connect their own API key | `allowUserKeys` | Off by default. A user's key is stored encrypted on the server and replaces yours for them |
| More context | `allowContext` | Attachments and pictures of the open message, the whole conversation, the messages selected in the list, and @ mentions. On by default |
| Anthropic: images | `anthropicImages` | Whether the Anthropic model gets images: `auto` (default; yes), `yes` or `no` (file name only) |
| OpenAI-compatible: images | `openaiImages` | The same for the OpenAI-compatible model. `auto`: yes for api.openai.com apart from text-only models (o3-mini, gpt-oss, gpt-3.5), no for other servers such as Ollama, vLLM or LM Studio |
| More actions | `allowMoreActions` | Answer invitations, change and delete events, tag messages, set the out-of-office reply, create filters, act on many messages at once. Each asks the user first. On by default |
| Most messages per batch | `batchLimit` | How many messages one batch action may change, 1 to 200, default 50 |
| Change settings | `allowSettingsChanges` | Let users allow the assistant to change their app settings (appearance, reading, composing, list, notifications, calendar view). Never account, security, sharing, forwarding or plugin settings, and never one your policy locks. Each change asks first and can be undone. Off by default |
| Files | `allowFiles` | Find and read the user's files, attach them to drafts, save attachments to Files, create files and folders. Never deletes or shares. On by default |
| Chat tools | `allowChatTools` | Earlier chats, saved prompts, `/` commands, Edit and Answer again, notes and templates. Off switches all of them off, notes and templates included, and the reader keeps one chat that never moves to Earlier chats. On by default |
| Prompts for everyone | `prompts` | Saved prompts every user gets, one per line: `Name: what to ask`. Lines without a name, empty lines and lines starting with `#` are left out; at most 30 |
| Remember notes | `allowMemory` | Let users have the assistant keep short notes about them, which go with every request. Off: no remember action, no notes sent, the settings hide them. On by default |
| Every view | `allowEverywhere` | The assistant in Calendar, Contacts, Files and Settings, and Catch me up. Off hides both and their user settings. On by default |

When the images setting is automatic and a model refuses an image anyway, the assistant asks once more with the file names only and says so. OpenAI-compatible servers other than api.openai.com get pictures at 1,024 px on the long edge instead of 1,568.

Lookups need a model that supports tool calls; small local models often answer without them. An address on your own network, such as Ollama on the same host, is only reachable when its origin is listed in `PLUGIN_PROXY_PRIVATE_ORIGINS` on the webmail server:

```sh
PLUGIN_PROXY_PRIVATE_ORIGINS=http://ollama:11434
```

### Webmail versions

The plugin needs Bulwark 1.17.0 or newer. It checks what the webmail offers and shows only what works there. On 1.19.1 you get the composer and reader panels, quick actions, lookups, actions, chat tools and @ mentions. These need the next release after 1.19.1 (1.20):

- reading attachments and pictures, whole conversations and the messages selected in the list
- the panel in Calendar, Contacts, Files and Settings, Alt+A there, and Catch me up in that panel
- several lines in the instructions field

<!-- TODO(C): the webmail version More actions needs -->
<!-- TODO(D): the webmail version Files needs -->

The panel in the other views needs the `ui:side-panel` permission, which the plugin asks for as an optional permission so that older webmails install it without. The templates tools need `templates:read` and `templates:write`. A plugin that was turned on before an update added a permission doesn't have it yet, and the assistant hides those parts until the user turns the plugin off and on in Settings > Add-ons, or you install it again. For the panel in the other views its settings say so.

<!-- TODO(C): calendar:respond and settings:change -->

Every permission and what the plugin uses it for is listed in the plugin's [README](https://github.com/bulwarkmail/plugins/tree/main/ai-assistant).

## Next step

To install plugins and control what they may do, see [Plugins](/docs/guides/plugins).
