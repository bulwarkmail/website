---
title: Composing emails
description: Rich text editor and composing features.
order: 1
edition: both
---

# Composing emails

The composer is a Tiptap rich-text editor. It has a plain-text mode for people who want one, signatures that follow the sending identity and reusable templates. With the S/MIME plugin installed, it can also sign and encrypt.

<img class="theme-light-only" src="/screenshots/light-composer.webp" alt="Bulwark email composer" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-composer.webp" alt="Bulwark email composer" width="5120" height="2880" />

## Rich text editor

<img class="theme-light-only" src="/screenshots/light-composer-mention.webp" alt="An @mention in the editor: the chip and the card with the person's details" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-composer-mention.webp" alt="An @mention in the editor: the chip and the card with the person's details" width="5120" height="2880" />

The formatting toolbar stays pinned to the top of the editor while a long message scrolls, and the address and subject fields stay above it. The editor has:

- **Bold**, _italic_, ~~strikethrough~~, and underline
- A font-size picker and text and background colors
- Ordered and unordered lists
- Inline hyperlinks. From the release after 1.21.3 a link address may contain spaces; they are sent as `%20`
- Tables (insert and edit)
- Block quotes
- Code blocks
- Inline images you can resize (sent as inline images, so a dropped image doesn't also become an attachment)
- A format painter

The **Format painter** copies formatting from one piece of text to another, from the release after 1.21.3. Select the text whose look you want, click the format painter button in the toolbar, then select the text to change. It copies bold, italic, underline, strikethrough, text and background colour, font size and a heading's level, and formatting the first text doesn't have comes off the second. Double-click the button to paint one selection after another, and press Escape or click the button again to stop. In a narrow window the button is under **More formatting**, which stays highlighted while the painter is on.

## Identity selection

Choose which sender identity to use from the dropdown in the composer. Each identity can have its own name, email address, and signature.
The identity manager refreshes from the server after create, update, and delete operations so the composer stays in sync with server-side changes.

### Auto-select reply identity

On a reply, Bulwark can pick the identity matching the address the original was sent to. Turn it on in settings, and choose whether a match means the exact address or any address on the same domain.

### Reply-to addresses

Give an identity a Reply-To address in Settings > Account > Email addresses, and replies to mail sent from it go to that address.

### Addresses for replies only

From the release after 1.21.3, turn off **Offer for new mail** in Settings > Account > Email addresses on an address you only want to answer from, such as a group address. It no longer appears in From for new messages, but replies to mail sent to it still go out from it. The default address is always offered.

### From-header override and catch-all auto-reply

When you own a catch-all domain, replies to mail sent to an arbitrary alias (e.g. `marketing@yourdomain.com`) should come back from the same alias, even when it isn't a configured identity. With "Reply from the address it was sent to" turned on and "Received address matching" set to "Any address on my domains" (Settings > Composing > Replying), Bulwark pre-fills the alias as the From header. You can still override the From header manually before sending.

### Signature position

**Signature position** in Settings > Composing > Replying decides whether signatures go **before** or **after** the quoted text on a reply or forward, for all identities. The default is after. If the identity you send from has no signature, Bulwark uses the primary identity's signature.

## Composer modes

There are two composer modes:

- **Rich text:** full formatting with the rich text editor (default)
- **Plain text only:** a simplified plain text composer for users who prefer unformatted emails

Turn on "Plain text only" in Settings > Composing to always write plain text, or switch one message with Options > Plain text in the composer.

## Replying

On desktop, a reply or forward opens under its message, which stays readable above it. Turn off **Replies under the message** in Settings > Composing > Replying to have it take the whole reading pane instead, like a new message. A reply that is already open stays where it is when you change the setting. The setting doesn't apply on phones, and Mountain View doesn't show it. Your organisation can set it for everyone, or lock it.

**Archive after replying** in Settings > Composing archives a message in your Inbox once your reply to it, or your forward of it, is sent (from the release after 1.21.3, off by default). Nothing is archived if you undo the send, and a reply that waits in the offline outbox leaves the original in the Inbox. Replies from other folders leave the original where it is. The setting is hidden when the admin turns off Archive.

**Quoted text in replies** in Settings > Composing > Replying decides how the earlier messages quoted in a reply start out. Collapsed hides them behind •••. Expanded shows them in full when you open a reply. Either way, you can still fold and unfold them with •••. Admins can preset it for everyone in `policy.json`:

```json
{ "defaults": { "replyQuoteDisplay": "expanded" } }
```

## Edit as new

To send a message again with changes, open it in Sent and choose Edit as new from the ⋮ menu or the right-click menu. A new message opens with the same sender, recipients, subject, text and attachments. It is a new message, not a reply, and the original stays in Sent.

## Attachments

- Drag and drop files onto the compose window
- Click the attachment button to browse
- Rename an attachment before sending it. In the reader, you can also rename one when you save a copy
- Your Stalwart configuration sets the maximum file size
- Each attachment chip shows progress in bytes while it uploads, and cancelling aborts the transfer rather than just hiding the chip
- Inline images can be pasted from the clipboard or uploaded straight into the rich text editor, and resized there
- **Forgotten-attachment warning:** if the body mentions "attachment", "attached", etc. but no file is attached, Bulwark warns before send. Change the words in Settings > Composing under **Trigger keywords**; admins can preset them for everyone (see [Organisation settings](/docs/guides/organisation#locking-a-setting))

## Signatures

Set up multiple signatures via identity management:

- Each identity has its own signature
- Bulwark appends the signature of the selected identity
- Switch identities (and signatures) using the dropdown in the composer

With several addresses, pick **Same as** another address in Settings > Composing > Signatures to give an address that address's signature (from the release after 1.21.3). Edit it on that address; every change reaches the addresses that use it.

## Templates

<img class="theme-light-only" src="/screenshots/light-templates.webp" alt="The Templates menu in the composer" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-templates.webp" alt="The Templates menu in the composer" width="5120" height="2880" />

Insert reusable email templates from the compose toolbar:

- Search templates, listed by favorites, recently used and category
- Placeholders such as `{{date}}` and `{{sender_name}}` fill themselves in; `{{recipient_name}}`, `{{company}}` and custom placeholders are asked for when you insert the template
- Give a placeholder a default with `{{name:default}}`, for example `{{checkin_time:15:00}}`: its field starts with the default, selected, so typing replaces it and Tab keeps it. A placeholder used more than once needs the default only once; if the defaults differ, the first one counts, and the subject comes before the body
- Press `t` to open the template picker, as long as focus isn't in a text field
- Manage templates under Settings > Composing > Email templates

## S/MIME compose controls

These controls come from the S/MIME plugin in the extension directory, which an administrator installs. They aren't available in Bulwark Lite. Sign and Encrypt show up as items in the composer's Options menu.

- Enable or disable signing per message when an S/MIME identity certificate is available
- Enable encryption when every recipient has a known public certificate
- Unlock protected keys on demand from the composer without leaving the draft
- Keep default signing and encryption preferences in the S/MIME settings panel

## Proofreading

When your organisation installed a proofreading plugin, such as Proofreading (LanguageTool), the composer underlines mistakes while you type: spelling with a wavy line, grammar with a double line, style with a dotted one. Click or tap an underline, or right-click it, to see what is wrong and up to five suggestions. Picking one replaces the word; `Ctrl+Z` takes it back. **Ignore** hides that one, **Add to dictionary** stops a word being flagged, **Turn off this rule** stops that kind of hint.

From the keyboard, `Ctrl+'` goes to the next issue and `Ctrl+;` to the previous one (`Cmd` on a Mac; on a German keyboard the keys are `Ä` and `Ö`). The popup opens with the first suggestion selected: `Enter` takes it, the arrow keys move between the choices, `Esc` goes back to the text.

The control in the composer's toolbar shows how many issues there are. It opens a list of them, each one a button that jumps to the word, and a switch to stop checking the message you are writing. In plain-text mode there are no underlines; the list has the suggestions instead.

Proofreading is off until you turn it on under **Settings > Composing > Proofreading** or in that control, which first says where your text goes. The text you write goes to the plugin and the service it uses, without your signature or the quoted message. Nothing is sent while a message is set to be signed or encrypted. Your organisation can turn proofreading on for everyone; then the control says **Required by your organisation**.

**Writing language** in the same settings section tells the proofreading plugin and your browser's spell check which language you write in. While a proofreading plugin checks spelling, the browser's own red underlines step back, so there is one set.

## Delivery options

Next to "Request read receipt", the composer's Options menu has "Delivery notification", which asks the receiving server for a delivery status notification (DSN), and "Require encrypted delivery", which marks the message REQUIRETLS so it is never relayed over a connection without TLS. Both only show when the server supports them. Both ride on the JMAP submission; whether the far end honours them is up to that server.

## Classification labels

When your organisation uses [classification labels](/docs/guides/organisation/classification-labels), the subject line ends in a label chip; on a phone it sits under the subject. Click it to pick a label, or use the arrow keys and Enter. The Options menu lists the labels too. New messages start with the default label, and replies and forwards with the original's. If your organisation requires a label, **Send** asks for one and doesn't send until you pick it. A quick reply keeps the original's label; when there is none to keep and one is required, it opens the full composer.

The label's prefix, such as `[Confidential]`, goes in front of the subject when the message is sent, once. Drafts keep the label you picked.

## Drafts

<img class="theme-light-only" src="/screenshots/light-scheduled.webp" alt="The Scheduled folder with a message waiting to be sent" width="5120" height="2880" />
<img class="theme-dark-only" src="/screenshots/dark-scheduled.webp" alt="The Scheduled folder with a message waiting to be sent" width="5120" height="2880" />

Drafts save themselves two seconds after you stop typing. They sync across devices over JMAP, and closing an unsaved draft asks for confirmation first.

Click a draft in the Drafts folder to resume it: content, recipients, attachments, and the identity you had selected all come back.

## Keyboard shortcuts

| Shortcut               | Action               |
| ---------------------- | -------------------- |
| `Ctrl/Cmd+Enter`       | Send                 |
| `Ctrl/Cmd+Shift+Enter` | Schedule send        |
| `t`                    | Open template picker |
| `Ctrl/Cmd+'`           | Next proofreading issue |
| `Ctrl/Cmd+;`           | Previous proofreading issue |
| `Escape`               | Close the composer (or the proofreading popup) |

## Next step

Go on to [Search and filters](/docs/features/email/search).
