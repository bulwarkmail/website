---
title: Presets and locks for admins
description: Preset any accessibility option for your users, lock the few that are safe to lock, and do the same in Bulwark Lite.
order: 1
edition: both
---

# Presets and locks for admins

Users find their options on **Settings > Accessibility** (see [Accessibility](/docs/features/accessibility)). As an admin you can give every option a different starting value, for everyone or for some domains and groups. You can lock only three of them.

## Defaults and locks

The settings policy has two tools, and accessibility options use both the same way as every other setting:

- A **default** is the value a user starts with. It applies to every user who hasn't changed that setting themselves. If you change the default later, those users get the new value; users who chose their own value keep it.
- A **lock** sets the value for everyone it applies to and greys out the setting, with "Set by your organisation" as the reason.

Every accessibility option can have a default. Only these can be locked:

| Setting | Key | What a lock does |
| --- | --- | --- |
| Single-key shortcuts | `singleKeyShortcuts` | Users keep the shortcuts on or off as you set them. Turning them off helps people who use speech input, where a dictated letter can delete or archive mail. |
| Confirm before sending | `sendConfirmation` | Users are always asked, or never asked, before a message goes out. |
| Notification duration | `toastDuration` | With a minimum, users can make notifications stay longer but not shorter. "Until I close them" always meets the minimum. |

### Why text size, contrast and motion can't be locked

A lock on text size, contrast, motion, fonts, spacing or any of the reading aids could leave someone unable to read or use the app at all. Someone with low vision needs larger text whatever the house style says, and someone with a vestibular disorder needs motion off. So Bulwark accepts these as defaults only.

A `policy.json` that locks one of them anyway is not rejected: the lock works as a default. Users who haven't chosen a value get yours, and they can still change it. Presets and Reset on the Accessibility page still leave such a setting alone, so put these values in `defaults` instead of `restrictions`.

## In the admin dashboard

**Admin > User policy** has two sections for this:

- **Locked settings**: the **Accessibility** category lists the three settings above. Tick **Lock** and pick the value next to **Users get**. Notification duration has a list instead, from **No minimum** to **At least 60 seconds**. Confirm before sending can also be hidden with **Hide**.
- **Defaults**: every setting you can preset, by category. **Accessibility** comes first and lists the Accessibility page's own options, under the page's headings and with the names users see. Settings the page shares with other pages, such as density or conversation view, are listed under their own category or can be set by key under **Other settings**. Change a value and it gets a **set** badge; the round arrow next to it (**Remove the default**) takes it away again. **Other settings** at the end takes any other setting by its key, as it appears in a settings export.

A lock set before Bulwark 1.19.0, or one in `policy.json` without a value, shows "No value: each user keeps the value they had" and a button to lock it to the value shown.

To give some users different values, add an entry for their domain or group on **Admin > Organisation > Domains and groups** and pick it in **Applies to** at the top of either section. See [Domains and groups](/docs/guides/organisation/domains-and-groups).

## In policy.json

Defaults go in `defaults`, locks and the minimum in `restrictions`, both keyed by the setting's key. This file presets larger text, more contrast and Atkinson Hyperlegible for everyone, keeps single-key shortcuts off, asks before sending, and keeps notifications at least 10 seconds. The `low-vision` entry gives one group the values of the Low vision preset as its defaults:

```json
{
  "defaults": {
    "fontSize": "large",
    "contrast": "more",
    "appFont": "atkinson"
  },
  "restrictions": {
    "singleKeyShortcuts": { "locked": true, "value": false },
    "sendConfirmation": { "locked": true, "value": true },
    "toastDuration": { "min": 10 }
  },
  "scopes": [
    {
      "id": "low-vision",
      "label": "Low vision support",
      "match": { "groups": ["low-vision@example.com"] },
      "policy": {
        "defaults": {
          "fontSize": "xx-large",
          "contrast": "more",
          "focusRing": "thick",
          "underlineLinks": true,
          "largeCursor": true,
          "mailMinFontSize": 16,
          "mailOverrideStyles": "high-contrast",
          "mailFitWidth": true,
          "showToolbarLabels": true
        }
      }
    }
  ]
}
```

A lock without `value` uses the value from `defaults`. `toastDuration` also takes `"locked": true` with a `value`, if you want one fixed duration instead of a minimum.

Bulwark checks each value against the list below. A value that isn't on it, such as a misspelled font name for `appFont`, is ignored, as if the file didn't set it. The two settings for new messages are the exception: `composeFontFamily` takes any font family list and `composeFontSize` any CSS size such as `15px`.

The user-facing presets (Screen reader, Low vision and so on) are not keys of their own. A preset is a list of values applied once, so to "preset a preset", put its values in `defaults` as in the example above. When a user applies a preset, Bulwark skips the settings you locked. Notifications never stay shorter than your minimum, whatever a preset sets.

### Keys and values

| Setting | Key | Values | Built-in default |
| --- | --- | --- | --- |
| Text size | `fontSize` | `small` (87.5%), `medium` (100%), `large` (112.5%), `x-large` (125%), `xx-large` (150%), `xxx-large` (175%), `huge` (200%) | `medium` |
| Font | `appFont` | `default`, `atkinson`, `lexend`, `opendyslexic` | `default` |
| Line spacing | `lineSpacing` | `normal`, `relaxed`, `loose` | `normal` |
| Letter spacing | `letterSpacing` | `normal`, `wide`, `wider` | `normal` |
| Word spacing | `wordSpacing` | `normal`, `wide` | `normal` |
| Paragraph spacing | `paragraphSpacing` | `normal`, `wide` | `normal` |
| Reading width | `readingWidth` | `full`, `comfortable` | `full` |
| Reading mask | `readingMask` | `true`, `false` | `false` |
| Plain language | `plainLanguage` | `true`, `false` | `false` |
| Contrast | `contrast` | `system`, `more`, `normal` | `system` |
| Reduce transparency | `reduceTransparency` | `system`, `on`, `off` | `system` |
| Underline links | `underlineLinks` | `true`, `false` | `false` |
| Show names next to colours | `showColorNames` | `true`, `false` | `false` |
| Colour-blind-safe colours | `colorBlindPalette` | `true`, `false` | `false` |
| Reduce motion | `reduceMotion` | `system`, `on`, `off` | `system` |
| Pause animated images | `pauseAnimatedImages` | `system`, `on`, `off` | `system` |
| Single-key shortcuts | `singleKeyShortcuts` | `true`, `false` | `true` |
| Focus outline | `focusRing` | `normal`, `thick`, `extra` | `normal` |
| Always show focus | `focusAlwaysVisible` | `true`, `false` | `false` |
| Large targets | `largeTargets` | `system`, `on`, `off` | `system` |
| Large mouse pointer | `largeCursor` | `true`, `false` | `false` |
| Open on hover | `openOnHover` | `true`, `false` | `true` |
| Actions button on each message | `showRowActionButton` | `true`, `false` | `false` |
| Wider scrollbars | `nativeScrollbars` | `true`, `false` | `false` |
| Show messages as | `mailViewMode` | `html`, `plain` | `html` |
| Message text size | `mailTextScale` | `0` (same as the app), `0.875`, `1`, `1.125`, `1.25`, `1.5`, `1.75`, `2` | `0` |
| Smallest text in messages | `mailMinFontSize` | `0` (no minimum), `12`, `14`, `16`, `18` | `0` |
| Use my font and colours in messages | `mailOverrideStyles` | `never`, `high-contrast`, `always` | `never` |
| Fit wide messages to the window | `mailFitWidth` | `true`, `false` | `false` |
| Read aloud speed | `readAloudRate` | `0.75`, `1`, `1.25`, `1.5` | `1` |
| Read aloud voice | `readAloudVoice` | `""` (browser default) or a voice URI as the browser reports it | `""` |
| Font for new messages | `composeFontFamily` | `""` (default), `sans-serif`, `serif`, `monospace`, or a font family list | `""` |
| Text size for new messages | `composeFontSize` | `""` (default) or a CSS size (the page offers 14px, 16px, 18px, 20px, 24px, 32px) | `""` |
| Notification duration | `toastDuration` | `5`, `10`, `20`, `60`, `0` (until closed) | `5` |
| Confirm before sending | `sendConfirmation` | `true`, `false` | `false` |
| Confirm before deleting | `confirmDelete` | `true`, `false` | `false` |
| Confirm before archiving | `confirmArchive` | `true`, `false` | `false` |
| Visual alerts | `visualAlerts` | `true`, `false` | `false` |
| Unread counts | `unreadCountStyle` | `count`, `dot`, `hidden` | `count` |
| Do not disturb | `doNotDisturb` | `true`, `false` | `false` |
| Announce new mail | `announceNewMail` | `true`, `false` | `true` |
| Read the preview in the list | `announceRowPreview` | `true`, `false` | `false` |
| Simple mode | `simpleMode` | `true`, `false` | `false` |
| Page through the message list (needs `simpleMode`) | `simpleModePagedList` | `true`, `false` | `false` |
| Accessibility button in the navigation bar | `showAccessibilityButton` | `true`, `false` | `false` |

The other settings shown on the Accessibility page, such as density, toolbar labels, always-light mail or conversation view, keep the keys they have on their own pages. Plain text mail font (`plainTextFont`: `sans` or `mono`) is only on the Accessibility page; preset it under **Other settings**.

Older files keep working. `small`, `medium` and `large` for `fontSize` are still valid; they now scale the browser's text size instead of setting a fixed pixel size. A file that presets or locks the old `animationsEnabled` is read as `reduceMotion`: `false` becomes `on`, `true` becomes `system`.

## Accessibility links

Public bodies have to link an accessibility statement, a way to report barriers ("Barriere melden"), and in Germany explanations in Leichte Sprache and German Sign Language (DGS) on their entry page. Since 1.19.0 there are admin settings for these links: an accessibility statement, a feedback link (a URL or an email address), a help page, a Leichte Sprache page and a DGS page. Bulwark shows them in the same place on every page, including the sign-in page. See [accessibility law for operators](/docs/legal/accessibility) for what goes behind them.

Set them on **Admin > Branding** under **Accessibility and help links**, with an environment variable, or in Lite's `config.json`. A link you leave empty doesn't show. Each one can also be set per domain in the Branding page's scope, like the imprint and privacy links.

| Link | Admin > Branding field | Environment variable | `config.json` and domain branding key |
| --- | --- | --- | --- |
| Accessibility statement | Accessibility statement URL | `ACCESSIBILITY_STATEMENT_URL` | `accessibilityStatementUrl` |
| Report a barrier | Report a barrier (URL or email) | `ACCESSIBILITY_FEEDBACK_URL` | `accessibilityFeedbackUrl` |
| Help | Help URL | `HELP_URL` | `helpUrl` |
| Easy Read (Leichte Sprache) | Easy Read (Leichte Sprache) URL | `EASY_READ_URL` | `easyReadUrl` |
| Sign language (DGS) | Sign language (DGS) URL | `SIGN_LANGUAGE_URL` | `signLanguageUrl` |

Only `http` and `https` links are used. The barrier report also takes an email address, which becomes a `mailto:` link. Users see the links in this order in the sign-in page footer, at the bottom of the settings sidebar and in the account menu, labelled in their language ("Barriere melden", "Leichte Sprache" and "Gebärdensprache" in German).

## Bulwark Lite

Lite has no admin dashboard, but it reads the same policy. Put `defaults` and `restrictions` in the `policy.json` next to `index.html`; scopes work too. See [static hosting](/docs/deployment/static).

<div class="bw-note"><b>Note.</b> Lite reads <code>policy.json</code> as a public file, so anyone can read it. That's fine for accessibility defaults, but keep it in mind for scope entries that name customers or groups. Lite has no settings sync: each user's choices stay in their browser, and your defaults apply on every device they sign in from until they change a setting there.</div>
