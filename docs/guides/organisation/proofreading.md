---
title: Proofreading
description: Underline spelling and grammar mistakes while users write, with LanguageTool on your own server, and decide whether users may turn it off.
order: 22
edition: full
---

# Proofreading

Proofreading underlines spelling, grammar and style mistakes in the composer while users type. A click (or a tap, or `Ctrl+'`) on an underline shows what is wrong and up to five suggestions; picking one replaces the word, and `Ctrl+Z` takes it back.

Bulwark doesn't check text itself. A proofreading plugin does, and the official one is **Proofreading (LanguageTool)**. [LanguageTool](https://languagetool.org) is open source (LGPL 2.1), checks about 30 languages, German and English included, and runs as one container next to Bulwark, so the text never leaves your servers.

What is sent, and when:

- Only what the user writes: the signature, the quoted message of a reply and a forwarded message are left out.
- Only while proofreading is on for that user and that message. It is off until the user or you turn it on.
- Only the paragraphs that changed since the last check, a moment after the user stops typing.
- Nothing while a message is set to be signed or encrypted. Checking pauses while the S/MIME plugin's Sign or Encrypt is ticked; what the user typed before ticking it may already have been checked. While the OpenPGP plugin is on, checking pauses in every message, because that plugin doesn't tell Bulwark which messages it signs or encrypts. It also pauses while a plugin that can sign is still starting, and while Bulwark couldn't load your policy.

## Run LanguageTool next to Bulwark

LanguageTool has no official container image; [erikvl87/languagetool](https://github.com/Erikvl87/docker-languagetool) is the common one. Add it to the compose file that runs Bulwark:

```yaml
services:
  languagetool:
    image: erikvl87/languagetool:latest
    restart: unless-stopped
    environment:
      Java_Xms: 512m
      Java_Xmx: 2g
      # Optional: n-gram data for more grammar checks (see below)
      # langtool_languageModel: /ngrams
    # volumes:
    #   - ./ngrams:/ngrams:ro

  webmail:
    # ... your Bulwark service ...
    environment:
      PLUGIN_PROXY_PRIVATE_ORIGINS: http://languagetool:8010
```

Bulwark's plugins reach outside services only through Bulwark's server, and that server refuses addresses on your own network unless you list them in `PLUGIN_PROXY_PRIVATE_ORIGINS` (comma-separated, scheme, host and port). Leave the LanguageTool container off the public internet: it has no sign-in.

Memory: the container needs its Java heap (`Java_Xmx`) and a few hundred MB more. LanguageTool publishes no sizing; a 2 GB heap is a common starting point for a team writing in a few languages. Raise it if checks get slow or the container restarts.

**N-gram data** lets LanguageTool catch confused words such as "their" and "there" or "seid" and "seit". It exists for English (9 GB zipped), German (1.7 GB), Spanish, French and Dutch, and should sit on an SSD. Download it from [languagetool.org/download/ngram-data](https://languagetool.org/download/ngram-data/), unzip it so the folder holds `en/`, `de/` and so on, mount it and set `langtool_languageModel`.

## Set up the plugin

1. Install **Proofreading (LanguageTool)** under **Admin > Extensions > Plugins**. It needs Bulwark 1.20.0.
2. On its page, set **LanguageTool server** to the container, for example `http://languagetool:8010`. If the server sits behind a proxy that wants a token, put it in **Access token**; it is sent to your server only, never to the public API.
3. Optionally set the **Default language** and **Preferred variants** (such as `de-CH` or `en-GB`), the **Default level** (picky finds more), **Rules turned off for everyone**, and an **Organisation word list** with your company and product names. The word list counts as correct for everyone, on top of each user's own dictionary.
4. Decide on **Users may change language, level and turned-off rules**. Turned off, the plugin's settings show your values with a lock.
5. Turn on **Force on for everyone** under **Availability** if users shouldn't be able to remove it.

### The public LanguageTool server

The plugin can use `api.languagetool.org` instead, if you turn on **Use the public LanguageTool API when no server is set** and leave the server empty. It is meant for trying the plugin out:

- It allows 20 requests and 75 KB of text a minute and 20 KB per request, per IP address (as of November 2026). Every user of one Bulwark shares the server's address, so a handful of people typing at once reach the limit. The plugin then pauses for a minute and says so.
- The text leaves your servers for LanguageTool's (Learneo, Inc.), under their terms and privacy policy.
- LanguageTool Premium isn't supported: it sends the account and key in the request body, which Bulwark's plugin proxy doesn't do.

## Decide who gets it

**Admin > Organisation > Proofreading** sets proofreading for everyone, or for one domain or group (pick it in the scope bar):

| Choice | What users get |
| --- | --- |
| Off, locked | No proofreading plugin gets any text. The setting is hidden. |
| Off by default | Off until the user turns it on, in Settings > Composing or from the composer's status control, which first says what is sent where. This is the default. |
| On by default | On until the user turns it off. |
| On, required | On in every composer. Users can't turn it off in the settings or for one message; they see **Required by your organisation** and, once, a notice in your words that says what is sent where. |

With several proofreading plugins installed, each gets its own line: follow the choice above, off and locked, or on and required. So you can require LanguageTool without requiring another plugin's check.

**Writing language** presets the language users write in, and can lock it. LanguageTool, and the browser's own spell check, use it.

### Make it mandatory

"Required" only holds while users can't turn the plugin itself off. For a mandatory setup:

1. Force the plugin on for everyone (its page, **Availability**). The Proofreading page warns while proofreading is required and no proofreading plugin is forced on, and has a button that does it. Forcing a plugin applies to everyone, also when you require proofreading for one group only.
2. Set Proofreading to **On, required**, for everyone or for the groups that need it.
3. Optionally, in the plugin's settings, turn off **Users may change language, level and turned-off rules**.

Even then, nothing is sent while a message is set to be signed or encrypted.

## Users

Users find proofreading under **Settings > Composing > Proofreading**, and in the composer's toolbar: the control there shows how many issues there are, opens a list of them, and has a switch for the message they are writing. See [Composing emails](/docs/features/email/composing#proofreading).

LanguageTool's personal dictionary lives in the user's browser, per account: a word added on the laptop isn't known on the phone.

Without n-gram data, LanguageTool misses some grammar mistakes that need context, such as the case in "Ich habe dem Brief geschrieben". Spelling, agreement ("Wir gehst"), repeated words and most punctuation are caught without it.
