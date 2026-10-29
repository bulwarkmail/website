---
title: Accessibility law for operators
description: What EN 301 549, BITV 2.0 and the BFSG mean if you host Bulwark in Germany or the EU, with templates for an accessibility statement and the BFSG information.
order: 2
edition: both
---

# Accessibility law for operators

This page is for people who run Bulwark for others: public bodies, companies, hosters and mail providers in Germany and the EU. It explains in plain words which accessibility rules may apply to you and what they ask for, and it gives you templates to start from.

**This is not legal advice.** It summarises the laws and standards as we understand them in October 2026. Check with your legal team, your data protection or accessibility officer, or a lawyer before you rely on it.

Bulwark is software. We, the Bulwark project, don't provide your mail service, so the duties described here fall on you as the operator, not on us. We can tell you what the software provides. Only you can say whether your deployment, with your theme, branding, plugins and texts, meets the requirements, and only you can publish the statement for it.

## Which rules apply to you

| You are | What applies |
| --- | --- |
| A federal public body in Germany | BITV 2.0 with the BGG, for public websites and for intranets and extranets |
| A public body of a German Land or municipality | The Land's accessibility law, which is close to BITV 2.0 |
| A public body elsewhere in the EU | Your country's law implementing the Web Accessibility Directive (EU) 2016/2102 |
| A company offering email to consumers in Germany | The BFSG, which implements the European Accessibility Act (EU) 2019/882; other EU countries have their own laws for it |
| A micro-enterprise offering email to consumers | Exempt from the BFSG's service requirements |
| A company giving mailboxes to its own staff, or offering mail only to businesses | Neither BITV 2.0 nor the BFSG, as far as their wording goes |

All of them point to the same technical standard, EN 301 549.

## EN 301 549

EN 301 549 is the European standard for accessible ICT. For web pages and web apps it adopts the WCAG success criteria at levels A and AA and adds a few requirements of its own.

- **V3.2.1** (2021) is the version the law refers to today. It is cited in the Official Journal and maps to WCAG 2.1 AA. Meeting it gives you the presumption of conformity.
- **V4.1.1** was published in September 2026. It covers all of WCAG 2.2 AA and is written for both the European Accessibility Act and the Web Accessibility Directive. Until the Commission cites it in the Official Journal, V3.2.1 remains the legal reference.

Bulwark is built against V4.1.1 and WCAG 2.2 AA, so it aims to cover both versions. Three clauses of V4.1.1 go beyond WCAG and matter for a webmail:

- **9.7 User preferences**: the app must not override the user's own settings for text size, contrast, colours or motion. Bulwark scales the browser's text size and follows the system for contrast, motion and transparency. See [Accessibility](/docs/features/accessibility#following-your-device).
- **5.10 Authoring tools**: the composer must help people write accessible mail. Bulwark asks for image descriptions, keeps them in the plain text version, and offers an accessible example template.
- **12.3 Documentation**: the documentation must describe the accessibility features and how to get support. [Accessibility](/docs/features/accessibility) is that page for Bulwark; link it from your own help pages or adapt it.

## BITV 2.0 (public bodies)

The Barrierefreie-Informationstechnik-Verordnung applies to websites, mobile apps and electronic administrative processes of federal public bodies. Websites include **intranets and extranets**, so a webmail an authority runs only for its own staff is covered too. The Länder have their own rules with nearly the same content.

What it asks for:

- **The standard (§3)**: conformity with the harmonised standards cited in the Official Journal, today EN 301 549 V3.2.1. Central navigation, entry points and interactive functions such as forms and sign-in should reach the highest level that can be achieved.
- **Leichte Sprache and DGS (§4, Anlage 2)**: the start page must explain in Leichte Sprache and in German Sign Language (DGS) what the site offers, how to navigate it, the main points of the accessibility statement, and where to find more in Leichte Sprache and DGS. If the Bulwark sign-in page is the entry point for your users, it needs links to these explanations. Bulwark doesn't ship that content; you write or commission it.
- **Accessibility statement and feedback (§7)**: a statement that is accessible, machine-readable and reachable from every page, following the EU model (Implementing Decision (EU) 2018/1523). It says whether it rests on a self-assessment or a test by a third party, and it is reviewed every year and after significant changes. Next to it you need a feedback mechanism ("Barriere melden") that is easy to use and reachable from every page, and a link to the Schlichtungsstelle nach § 16 BGG.
- **Monitoring (§8)**: the Überwachungsstelle des Bundes für Barrierefreiheit von Informationstechnik checks federal sites with the EU monitoring method.

In practice, public bodies often have their deployment checked with the BIK BITV-Test, the common test procedure in Germany. Its test steps are public, so you can also use them for a self-assessment.

Bulwark is adding admin settings for the statement, feedback, help, Leichte Sprache and DGS links, shown in the same place on every page including the sign-in page. See [presets and locks for admins](/docs/features/accessibility/admin#accessibility-links).

## BFSG (consumer email services)

The Barrierefreiheitsstärkungsgesetz applies to services provided to consumers after 28 June 2025.

**Email is in scope.** §1 Abs. 3 Nr. 1 covers telecommunications services provided to consumers. §2 Nr. 7 defines them by reference to the European Electronic Communications Code (Directive (EU) 2018/1972), which includes interpersonal communications services, and its recital 15 names "all types of emails" as such a service. Recital 16 counts services paid for with personal data or advertising as paid, so a free, ad-funded or data-funded webmail is in scope too.

**Who is bound** is the operator who offers mail to consumers: internet providers, hosters that bundle mailboxes, freemail providers. A club offering mail to its members may be a grey area. Not bound:

- offers only for businesses, and mailboxes an employer gives its staff, since these aren't consumer services;
- **micro-enterprises** providing services (§3 Abs. 3): fewer than 10 employees and an annual turnover or balance sheet total of at most €2 million;
- public bodies, which fall under BITV 2.0 or Land law instead.

The software alone is not a product under the BFSG (§1 Abs. 2), so the Bulwark project is not bound by it.

**What the operator has to do:**

- **BFSGV §12**: the website, online applications and mobile apps of the service must be perceivable, operable, understandable and robust. In practice that means EN 301 549 and WCAG. Information about the service must be accessible and use more than one sensory channel, and support services such as a help desk or hotline must give accessibility information through accessible channels.
- **BFSGV §13**: features and procedures that serve the needs of people with disabilities, and interoperability with assistive technology.
- **BFSG §14 with Anlage 3**: publish how your service meets the requirements, in your terms and conditions (AGB) or in another clearly visible way, for as long as you offer the service. It includes a general description of the service in an accessible format, the explanations needed to use it, how it meets the requirements, and the market surveillance authority. There is a [template below](#bfsg-information-template).
- **Exceptions**: §§16 and 17 allow exceptions for a disproportionate burden or a fundamental alteration of the service. You have to assess and document them.

The market surveillance authority for all Länder is the **MLBF** (Marktüberwachungsstelle der Länder für die Barrierefreiheit von Produkten und Dienstleistungen), a joint authority based in Magdeburg. A consumer who finds a barrier can also turn to the Schlichtungsstelle nach § 16 BGG (BFSG §34).

## What Bulwark gives you and what stays with you

Bulwark provides:

- the accessibility features described on [Accessibility](/docs/features/accessibility), including settings that let users adapt incoming mail they can't otherwise change;
- admin defaults and locks, for example to preset larger text for a department, see [presets and locks for admins](/docs/features/accessibility/admin);
- admin settings for the accessibility links, coming in the same release;
- the documentation page EN 301 549 12.3 asks for, and the templates on this page.

We don't publish a conformance report (ACR or VPAT) yet. We'll link it here when there is one.

You are responsible for:

- **checking your own deployment**: your theme and colours, your logo and login texts, the plugins you enable, and any page you link from the app. A custom theme with weak contrast fails, whatever Bulwark does;
- **writing and publishing the statement** (public bodies) or the **BFSG information** (consumer services), and keeping it current;
- **answering feedback**: someone has to read what arrives through "Barriere melden" and act on it;
- **Leichte Sprache and DGS** explanations, if you are a public body;
- **accessible support channels** for your users.

### Incoming mail is third-party content

Messages and attachments your users receive come from other people. You don't control them, and neither does Bulwark. The Web Accessibility Directive excludes third-party content that the body neither funds, develops nor controls, and the templates below list incoming mail under that heading. Bulwark still lets users read such mail as plain text, enlarge it, set a minimum text size, replace the sender's fonts and colours with their own, and pause animated images.

## Accessibility statement template

The structure follows the EU model statement (Implementing Decision (EU) 2018/1523). Replace everything in square brackets, pick one of the alternatives, and delete what doesn't apply. List only barriers you have actually found, and only features you have checked in your own deployment.

German:

```markdown
# Erklärung zur Barrierefreiheit

[Name der Stelle] ist bemüht, ihren Webmailer im Einklang mit [den Bestimmungen des
Behindertengleichstellungsgesetzes (BGG) und der Barrierefreie-Informationstechnik-
Verordnung (BITV 2.0) | dem Landesgesetz: Name] barrierefrei zugänglich zu machen.

Diese Erklärung zur Barrierefreiheit gilt für [URL des Webmailers]. Der Webmailer
beruht auf der Open-Source-Software Bulwark Webmail, Version [Version].

## Stand der Vereinbarkeit mit den Anforderungen

[Der Webmailer ist mit den Anforderungen der BITV 2.0 vollständig vereinbar.]
[Der Webmailer ist wegen der unten aufgeführten Unvereinbarkeiten und Ausnahmen teilweise
mit den Anforderungen der BITV 2.0 vereinbar.]
[Der Webmailer ist mit den Anforderungen der BITV 2.0 nicht vereinbar.]

Grundlage ist die harmonisierte Norm EN 301 549 V3.2.1. [Zusätzlich wurde gegen
EN 301 549 V4.1.1 (WCAG 2.2) geprüft.]

## Nicht barrierefreie Inhalte

Die folgenden Inhalte sind nicht oder nicht vollständig barrierefrei.

### Unvereinbarkeit mit der BITV 2.0

- [Beschreibung der Barriere, betroffene Anforderung, verfügbare Alternative]
- [Wann die Barriere voraussichtlich behoben wird]

### Unverhältnismäßige Belastung

- [Nur wenn geprüft und dokumentiert: Inhalt und Begründung]

### Inhalte, die nicht in den Anwendungsbereich fallen

- Empfangene E-Mails und ihre Anhänge stammen von Dritten. [Name der Stelle] hat keinen
  Einfluss darauf, wie sie gestaltet sind, zum Beispiel auf fehlende Bildbeschreibungen,
  geringe Kontraste oder Text in Bildern. Im Webmailer können Sie solche Nachrichten als
  reinen Text anzeigen, vergrößern, eine Mindestschriftgröße festlegen und eigene
  Schriften und Farben verwenden.
- [Erweiterungen oder Themes anderer Anbieter, falls aktiviert]

## Erstellung dieser Erklärung

Diese Erklärung wurde am [Datum] erstellt und zuletzt am [Datum] überprüft.

Sie beruht auf [einer Selbstbewertung durch Name der Stelle | einer Prüfung durch Name
der prüfenden Stelle nach Prüfverfahren, zum Beispiel BIK BITV-Test, Prüfbericht vom
Datum].

## Feedback und Kontakt

Sind Ihnen Barrieren im Webmailer aufgefallen, oder brauchen Sie Inhalte in einer
barrierefreien Form? Dann melden Sie sich bei uns:

- Barriere melden: [URL des Formulars]
- E-Mail: [Adresse]
- Telefon: [Nummer]
- Post: [Anschrift]

## Schlichtungsverfahren

[Für öffentliche Stellen des Bundes:]
Wenn Sie auf Ihre Meldung keine zufriedenstellende Antwort erhalten haben, können Sie
einen Antrag auf ein Schlichtungsverfahren bei der Schlichtungsstelle nach § 16 BGG
stellen. Die Schlichtungsstelle hilft, Konflikte zur Barrierefreiheit zwischen Menschen
mit Behinderungen und öffentlichen Stellen des Bundes außergerichtlich zu lösen. Das
Verfahren ist kostenlos, und Sie brauchen keinen Rechtsbeistand.

Kontakt: Schlichtungsstelle nach dem Behindertengleichstellungsgesetz,
[Anschrift, Telefon und E-Mail laut https://www.schlichtungsstelle-bgg.de]

[Für öffentliche Stellen eines Landes:]
[Name, Anschrift und Kontakt der Durchsetzungs- oder Schlichtungsstelle nach Landesrecht]
```

English:

```markdown
# Accessibility statement

[Name of the organisation] is committed to making its webmail accessible in accordance
with [the German Disability Equality Act (BGG) and the Barrier-Free Information
Technology Ordinance (BITV 2.0) | state law: name | national law: name].

This accessibility statement applies to [URL of the webmail]. The webmail is based on
the open source software Bulwark Webmail, version [version].

## Compliance status

[This webmail is fully compliant with BITV 2.0.]
[This webmail is partially compliant with BITV 2.0 due to the non-compliances and
exemptions listed below.]
[This webmail is not compliant with BITV 2.0.]

The basis is the harmonised standard EN 301 549 V3.2.1. [It was also checked against
EN 301 549 V4.1.1 (WCAG 2.2).]

## Non-accessible content

The content listed below is not accessible, or not fully accessible.

### Non-compliance with BITV 2.0

- [Description of the barrier, the requirement it fails, the alternative available]
- [When the barrier is expected to be fixed]

### Disproportionate burden

- [Only if assessed and documented: the content and the reason]

### Content outside the scope of the applicable law

- Messages and attachments you receive come from third parties. [Name of the
  organisation] has no control over how they are made, for example missing image
  descriptions, low contrast or text in images. In the webmail you can show such
  messages as plain text, enlarge them, set a minimum text size and use your own fonts
  and colours.
- [Third-party plugins or themes, if enabled]

## Preparation of this accessibility statement

This statement was prepared on [date] and last reviewed on [date].

It is based on [a self-assessment by name of the organisation | a test by name of the
testing body using test method, for example BIK BITV-Test, report dated date].

## Feedback and contact information

If you notice a barrier in the webmail, or need content in an accessible format,
contact us:

- Report a barrier: [URL of the form]
- Email: [address]
- Phone: [number]
- Post: [address]

## Enforcement procedure

[For federal public bodies in Germany:]
If you did not get a satisfactory answer to your feedback, you can apply for conciliation
at the Schlichtungsstelle nach § 16 BGG (conciliation body under the Disability Equality
Act). It helps to settle disputes about accessibility between people with disabilities
and federal public bodies out of court. The procedure is free of charge, and you don't
need a lawyer.

Contact: Schlichtungsstelle nach dem Behindertengleichstellungsgesetz,
[address, phone and email from https://www.schlichtungsstelle-bgg.de]

[For public bodies of a German state, or outside Germany:]
[Name, address and contact of the enforcement or conciliation body under your law]
```

## BFSG information template

This block covers the information BFSG §14 with Anlage 3 asks for. Put it in your terms and conditions or on a page that is easy to find, keep it accessible itself, and keep it for as long as you offer the service. The list of features comes from Bulwark; remove anything you have turned off, restricted or not checked.

```markdown
# Barrierefreiheit unseres E-Mail-Dienstes

Informationen nach § 14 Barrierefreiheitsstärkungsgesetz (BFSG) in Verbindung mit
Anlage 3

## Beschreibung des Dienstes

[Name des Anbieters] bietet unter [URL] einen E-Mail-Dienst für Verbraucherinnen und
Verbraucher an. Sie können damit E-Mails lesen, schreiben, ordnen und durchsuchen
[sowie Kalender, Kontakte und Dateien verwalten]. Sie nutzen den Dienst im Webbrowser
[und in der App: Name]. Zur Anmeldung brauchen Sie [Ihre E-Mail-Adresse und Ihr Passwort
| weitere Anmeldewege].

## So nutzen Sie den Dienst

- Hilfe und Anleitungen: [URL]
- Alle Tastenkürzel zeigt die Taste ? im Webmailer.
- Die Einstellungen zur Barrierefreiheit finden Sie unter Einstellungen >
  Barrierefreiheit. Alt+Umschalt+A öffnet die wichtigsten davon von überall, auch auf
  der Anmeldeseite über die Schaltfläche "Barrierefreiheit".
- Kundendienst: [Kontaktwege, zum Beispiel E-Mail, Telefon, Formular, Gebärdensprache]

## So erfüllt der Dienst die Anforderungen an die Barrierefreiheit

Der Webmailer beruht auf der Open-Source-Software Bulwark Webmail, Version [Version].
Maßstab sind die Anforderungen der Verordnung zum BFSG (BFSGV), in der Praxis die
harmonisierte Norm EN 301 549 V3.2.1 [und V4.1.1].

Wahrnehmbar:
- Die Textgröße lässt sich von 87,5 % bis 200 % der im Browser eingestellten Größe
  ändern, für die Oberfläche und für Nachrichten getrennt.
- Ein Modus mit mehr Kontrast, unterstrichene Links und Farben, die bei
  Farbfehlsichtigkeit unterscheidbar bleiben. Informationen hängen nicht allein von der
  Farbe ab.
- Empfangene Nachrichten lassen sich als reiner Text, mit Mindestschriftgröße und in
  eigenen Schriften und Farben anzeigen und vorlesen.
- Hinweise erscheinen als Text, auf Wunsch auch als visuelles Signal statt eines Tons.

Bedienbar:
- Alle Funktionen sind mit der Tastatur erreichbar. Einzeltasten-Kürzel lassen sich
  abschalten, zum Beispiel für Spracheingabe.
- Große Bedienelemente, Aktionen ohne Ziehen und ohne Überfahren mit der Maus,
  einstellbare Anzeigedauer von Hinweisen und Rückgängig für die letzten Aktionen.
- Bewegungen und animierte Bilder lassen sich anhalten. Der Dienst folgt den
  Einstellungen Ihres Geräts für Bewegung, Kontrast und Transparenz.

Verständlich:
- Einfachere Formulierungen für Einstellungen und Fehlermeldungen (Deutsch und Englisch),
  ein vereinfachtes Layout und Rückfragen vor dem Senden, Löschen oder Archivieren.

Robust und mit Hilfsmitteln nutzbar:
- Der Webmailer nutzt Standard-HTML und WAI-ARIA, damit Screenreader wie NVDA, JAWS,
  VoiceOver und TalkBack Aufbau, Namen und Zustände erkennen. Wichtige Änderungen werden
  angesagt.
- Beim Schreiben fragt der Webmailer nach Bildbeschreibungen, und es gibt eine Vorlage
  für barrierefreie Nachrichten.

Bekannte Einschränkungen:
- Empfangene E-Mails stammen von Dritten. Ihre Gestaltung können wir nicht beeinflussen.
- [Weitere bekannte Barrieren und geplante Abhilfe]

Stand: [Datum]. Grundlage: [Selbstbewertung | Prüfung durch Name, Datum].

## Zuständige Marktüberwachungsbehörde

Marktüberwachungsstelle der Länder für die Barrierefreiheit von Produkten und
Dienstleistungen (MLBF)
[Anschrift laut https://www.mlbf-barrierefrei.de], Magdeburg
[E-Mail und Telefon laut https://www.mlbf-barrierefrei.de]
```

## Sources

Standards:

- EN 301 549 V4.1.1 (2026-09), [ETSI PDF](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf)
- AccessibleEU on the update and the current legal reference, [7 September 2026](https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [ATAG 2.0](https://www.w3.org/TR/ATAG20/)

Germany:

- [BITV 2.0](https://www.gesetze-im-internet.de/bitv_2_0/BJNR184300011.html)
- [BGG § 16](https://www.gesetze-im-internet.de/bgg/__16.html) and the [Schlichtungsstelle BGG](https://www.schlichtungsstelle-bgg.de)
- BFSG [§ 1](https://www.gesetze-im-internet.de/bfsg/__1.html), [§ 2](https://www.gesetze-im-internet.de/bfsg/__2.html), [§ 3](https://www.gesetze-im-internet.de/bfsg/__3.html), [§ 14](https://www.gesetze-im-internet.de/bfsg/__14.html), [§ 34](https://www.gesetze-im-internet.de/bfsg/__34.html) and [Anlage 3](https://www.gesetze-im-internet.de/bfsg/anlage_3.html)
- [BFSGV](https://www.gesetze-im-internet.de/bfsgv/index.html)
- [MLBF](https://www.mlbf-barrierefrei.de)
- [BIK BITV-Test](https://bitvtest.de/en/tests-und-beratung/bik-bitv-test-web)

EU:

- European Electronic Communications Code, [Directive (EU) 2018/1972](https://eur-lex.europa.eu/eli/dir/2018/1972/oj), recitals 15 and 16
- Model accessibility statement, [Implementing Decision (EU) 2018/1523](https://eur-lex.europa.eu/eli/dec_impl/2018/1523/oj)
- Web Accessibility Directive, [Directive (EU) 2016/2102](https://eur-lex.europa.eu/eli/dir/2016/2102/oj)
- European Accessibility Act, [Directive (EU) 2019/882](https://eur-lex.europa.eu/eli/dir/2019/882/oj)
