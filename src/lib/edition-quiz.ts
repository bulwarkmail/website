// Questions and scoring for the "Which Bulwark fits you?" quiz (/choose).
// Kept free of React and path aliases so a plain Node script can import it
// and check the spread of results.
//
// Two rules for everything in here:
//
// 1. Plain words. No JMAP, CORS, OIDC or Node.js in anything a reader sees.
// 2. Honest results. Only recommend what actually works for the answers
//    given, and say so when Bulwark isn't the right fit. Every claim must be
//    traceable to the docs (editions.md, lite.md, static.md, pwa.md,
//    files.md, authentication.md). If a row changes there, change it here.

export type Edition = "full" | "lite";

export type Link = { label: string; href: string };
export type Card = { title: string; text: string; link: Link };

export type Choice = {
  id: string;
  label: string;
  hint?: string;
  /** A lean: positive toward Bulwark, negative toward Lite. */
  lean?: number;
  /** Short phrase for the result, e.g. "Single sign-on". */
  tag?: string;
  /** Something only Bulwark can do. */
  bulwarkOnly?: boolean;
  /** Lite can do it too when this returns true for the answers so far. */
  liteIf?: (answers: Answers) => boolean;
  /** Shown as a full-width tile above the others. */
  wide?: boolean;
  /** Only offered when this returns true for the answers so far. */
  showIf?: (answers: Answers) => boolean;
};

export type Question = {
  id: string;
  title: string;
  help?: string;
  multi?: boolean;
  choices: Choice[];
};

export type Answers = Record<string, string[]>;

export const NONE = "none";

export const QUESTIONS: Question[] = [
  {
    id: "server",
    title: "Which mail server do you use?",
    help: "Bulwark is the part you see in the browser. It works with the Stalwart mail server.",
    choices: [
      { id: "own", label: "Stalwart, and I run it", hint: "Or I'm about to set it up" },
      {
        id: "hosted",
        label: "Stalwart, run by someone else",
        hint: "A provider, or the IT team",
        // Lite would depend on them switching on a setting; Bulwark works
        // without their help, so it is the realistic default here.
        lean: 3,
        tag: "Someone else runs your mail server",
      },
      { id: "none", label: "I don't have one yet" },
      { id: "other", label: "A different mail server", hint: "Dovecot, Postfix, or a mailbox from my hosting company" },
    ],
  },
  {
    id: "where",
    title: "Where do you want to put it?",
    choices: [
      {
        id: "webhost",
        label: "On a simple website host",
        hint: "Where you'd upload an ordinary website: shared hosting, GitHub Pages, Netlify",
        lean: -3,
        tag: "A simple website host",
      },
      {
        // Stalwart 0.16.6 and later, 1.0 included, serves Lite itself as an Application
        // (docs/deployment/stalwart-app.md). Only Lite can live there, and only
        // someone with Stalwart can pick it.
        id: "stalwart",
        label: "Inside Stalwart itself",
        hint: "Stalwart serves it, at an address like mail.example.com/webmail",
        lean: -3,
        tag: "Served by Stalwart",
        showIf: (answers) => pick(answers, "server") !== "other",
      },
      { id: "server", label: "On a server", hint: "A rented server, a home server, or the one my mail runs on" },
      { id: "unsure", label: "Not sure yet" },
    ],
  },
  {
    id: "upkeep",
    title: "How much looking after do you want?",
    choices: [
      {
        id: "minimal",
        label: "As little as possible",
        hint: "Upload some files, and replace them when a new version comes out",
        lean: -2,
        tag: "Little upkeep",
      },
      {
        id: "fine",
        label: "Running an app is fine",
        hint: "One more program to keep running, which tells me about updates",
        lean: 1,
        tag: "Happy to run an app",
      },
      { id: "any", label: "No preference" },
    ],
  },
  {
    id: "login",
    title: "How will people log in?",
    choices: [
      { id: "password", label: "Email and password", hint: "With an optional code from an app", lean: -1, tag: "Password login" },
      {
        id: "sso",
        label: "With single sign-on",
        hint: "Through a login service your mail server trusts, like Keycloak or Authentik",
        bulwarkOnly: true,
        // Lite served by Stalwart sends people to the login service Stalwart
        // uses for their account (webmail lib/auth/lite-oauth.ts). Lite on a
        // website host has no single sign-on.
        liteIf: servedByStalwart,
        tag: "Single sign-on",
      },
      { id: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "musthave",
    title: "Is there anything you can't do without?",
    help: "These only come with Bulwark. Pick only what you really need; you can switch later.",
    multi: true,
    choices: [
      {
        id: NONE,
        label: "No, the basics are enough",
        hint: "Mail, calendar, contacts, files and search are in both",
        lean: -1,
        tag: "The basics are enough",
        wide: true,
      },
      { id: "addons", label: "Add-ons", hint: "Extra apps and plugins", bulwarkOnly: true, tag: "Add-ons" },
      {
        // Lite takes the logo from config.json and everyone's settings from
        // policy.json; only the page to change them in is Bulwark's.
        id: "admin",
        label: "An admin page",
        hint: "Change your logo and everyone's settings in the browser, not in files",
        bulwarkOnly: true,
        tag: "Admin page",
      },
      { id: "sync", label: "Same settings everywhere", hint: "On every device you use", bulwarkOnly: true, tag: "Settings on every device" },
      {
        id: "office",
        label: "Edit Word and Excel files",
        hint: "Also needs an office server, such as Collabora",
        bulwarkOnly: true,
        tag: "Office editing",
        // Files live in Stalwart. Through Legacy Proxy there are none to edit.
        showIf: (answers) => pick(answers, "server") !== "other",
      },
      {
        id: "notify",
        label: "New-mail notifications",
        hint: "Pop-ups even when the tab is closed",
        bulwarkOnly: true,
        tag: "Notifications",
      },
    ],
  },
  {
    id: "who",
    title: "Who will use it?",
    choices: [
      { id: "me", label: "Just me", lean: -1, tag: "Just you" },
      { id: "family", label: "Family or friends" },
      { id: "team", label: "A team or company", lean: 1, tag: "A team" },
    ],
  },
];

// -----------------------------------------------------------------------------
// Results
// -----------------------------------------------------------------------------

export type Reason = {
  tag: string;
  toward: Edition;
  must: boolean;
  /** Overrides the badge when the usual "Needs Bulwark" wouldn't be true. */
  badge?: string;
};

export type Kind =
  | "lite" // Bulwark Lite
  | "full" // Bulwark
  | "proxy" // Bulwark with Legacy Proxy, for a mail server other than Stalwart
  | "classic" // Not Bulwark: a classic webmail fits better
  | "stuck"; // Needs Bulwark, has no server, and can't make Lite work either

export type Verdict = {
  kind: Kind;
  /** The edition the quiz recommends, or null for neither. */
  pick: Edition | null;
  /** Nothing forced it and the leans are within a point: either would do. */
  close: boolean;
  /** A sentence put in front of the pitch, when the title needs one. */
  lead?: string;
  title: string;
  pitch: string;
  primary?: Link;
  secondary?: Link;
  reasons: Reason[];
  /** Other ways to go, shown as cards. */
  options: Card[];
  /** Things to know before you start, shown as notes. */
  caveats: { text: string; link?: Link }[];
  /** The page written for the reader the answers describe. */
  audience?: Link;
};

const LINKS = {
  installFull: { label: "Install Bulwark", href: "/docs/getting-started/installation" },
  installLite: { label: "Set up Bulwark Lite", href: "/docs/getting-started/lite" },
  stalwartApp: { label: "Install on Stalwart", href: "/docs/deployment/stalwart-app" },
  stalwart: { label: "Setting up Stalwart", href: "/docs/getting-started/stalwart-setup" },
  proxy: { label: "Legacy Proxy", href: "https://github.com/bulwarkmail/legacy-proxy" },
  roundcube: { label: "Roundcube", href: "https://roundcube.net" },
  snappymail: { label: "SnappyMail", href: "https://snappymail.eu" },
  liteSetting: { label: "The one setting", href: "/docs/getting-started/lite#the-one-server-side-requirement" },
} satisfies Record<string, Link>;

const CLASSIC: Card = {
  title: "Or a classic webmail",
  text: "Roundcube and SnappyMail work with almost any mail server directly, with nothing in between.",
  link: LINKS.roundcube,
};

function pick(answers: Answers, id: string): string | undefined {
  return answers[id]?.[0];
}

/** Stalwart serving Lite as an Application: only Lite fits there. */
function servedByStalwart(answers: Answers): boolean {
  return pick(answers, "where") === "stalwart" && pick(answers, "server") !== "other";
}

/**
 * The audience page that fits the answers: a team that wants single sign-on
 * is an organisation, any other team a small business, and one person or a
 * family runs it at home. No answer to "who", no link.
 */
function audienceFor(answers: Answers): Link | undefined {
  const who = pick(answers, "who");
  if (who === "me" || who === "family") return { label: "Read the page for home and homelab", href: "/homelab" };
  if (who !== "team") return undefined;
  return pick(answers, "login") === "sso"
    ? { label: "Read the page for organisations", href: "/organisations" }
    : { label: "Read the page for small businesses", href: "/small-business" };
}

export function evaluate(answers: Answers): Verdict {
  const verdict = evaluateEdition(answers);
  // Not Bulwark at all: no Bulwark page to send the reader to.
  if (verdict.pick === null && verdict.kind === "classic") return verdict;
  return { ...verdict, audience: audienceFor(answers) };
}

function evaluateEdition(answers: Answers): Verdict {
  const reasons: Reason[] = [];
  let score = 0;
  const server = pick(answers, "server");
  for (const q of QUESTIONS) {
    for (const id of answers[q.id] ?? []) {
      const c = q.choices.find((choice) => choice.id === id);
      if (!c?.tag) continue;
      // An answer given before a later change made it unavailable.
      if (c.showIf && !c.showIf(answers)) continue;
      // Legacy Proxy signs people in with their mail password; that is said
      // in a note on the result instead.
      if (c.id === "sso" && server === "other") continue;
      if (c.bulwarkOnly && c.liteIf?.(answers)) {
        reasons.push({ tag: c.tag, toward: "lite", must: false, badge: "Lite has it there" });
      } else if (c.bulwarkOnly) reasons.push({ tag: c.tag, toward: "full", must: true });
      else if (c.lean) {
        score += c.lean;
        reasons.push({ tag: c.tag, toward: c.lean > 0 ? "full" : "lite", must: false });
      }
    }
  }

  const webhostOnly = pick(answers, "where") === "webhost";
  const inStalwart = servedByStalwart(answers);
  const needs = reasons.filter((r) => r.must);
  const needsList = needs.map((r) => r.tag.toLowerCase()).join(", ");
  const upkeepMinimal = pick(answers, "upkeep") === "minimal";

  // --- A mail server other than Stalwart ------------------------------------
  // Bulwark is built for Stalwart and needs a JMAP server. Anything else
  // needs Legacy Proxy in between, and that is an app of its own: it needs a
  // server, and it makes Lite pointless, since not running an app is Lite's
  // whole point.
  if (server === "other") {
    const why: Reason = { tag: "A mail server other than Stalwart", toward: "full", must: true, badge: "Needs Legacy Proxy" };
    if (webhostOnly) {
      return {
        kind: "classic",
        pick: null,
        close: false,
        lead: "Bulwark isn't the right fit here.",
        title: "A classic webmail",
        pitch:
          "Bulwark is built for Stalwart, and most other mail servers can't talk to it directly. Connecting it to your mail server needs Legacy Proxy, and that needs a server of its own. Roundcube and SnappyMail work with your mail server directly and run on ordinary website hosting.",
        primary: LINKS.roundcube,
        secondary: LINKS.snappymail,
        reasons: [why, { tag: "A simple website host", toward: "lite", must: true, badge: "Can't run the proxy" }],
        options: [
          {
            title: "Bulwark later",
            text: "If you move your mail to Stalwart one day, Bulwark works with it directly. Until then, a small server could run Bulwark and Legacy Proxy.",
            link: LINKS.stalwart,
          },
        ],
        caveats: [{ text: "Both need a host that runs PHP. Most shared hosting does; GitHub Pages and Netlify don't." }],
      };
    }
    return {
      kind: "proxy",
      pick: "full",
      close: false,
      lead: "Possible, with an extra piece.",
      title: "Bulwark + Legacy Proxy",
      pitch:
        "Bulwark is built for Stalwart, and most other mail servers can't talk to it directly. Legacy Proxy sits between it and your mail server, so you run two apps instead of one. Lite doesn't help here, because the proxy needs a server anyway.",
      primary: LINKS.installFull,
      secondary: LINKS.proxy,
      reasons: [why, ...needs],
      options: [CLASSIC],
      caveats: [
        {
          text: "Legacy Proxy is pre-1.0 and has had no outside security audit. It gives you mail, out-of-office replies and contacts (if your mail server has an address book), but no calendar and no files. Try it with your mail server before you move everyone over.",
        },
        ...(answers.login?.includes("sso")
          ? [{ text: "Single sign-on doesn't work through Legacy Proxy. People sign in with their mail server password." }]
          : []),
      ],
    };
  }

  const hosted = server === "hosted";
  const noServer = server === "none";
  const caveats: Verdict["caveats"] = [];
  if (noServer) {
    caveats.push({
      text: "You'll need a mail server first. Stalwart is free and runs on a small server, and Bulwark can run on the same one.",
      link: LINKS.stalwart,
    });
  }

  // --- Something only Bulwark can do ----------------------------------------
  if (needs.length > 0) {
    // Bulwark needs a server. If you run Stalwart, you have one; if someone
    // else does and all you have is a website host, neither version works as
    // things stand.
    if ((webhostOnly || inStalwart) && hosted) {
      const those = needs.length > 1 ? "those" : "that";
      return {
        kind: "stuck",
        pick: null,
        close: false,
        lead: "Not with this setup as it is.",
        title: "Two ways to get there",
        pitch: inStalwart
          ? `Only Bulwark has ${needsList}, and Bulwark is an app of its own that needs a server. Only Lite can live inside Stalwart, and it leaves ${those} out.`
          : `Only Bulwark has ${needsList}, and Bulwark needs a server to run on. Bulwark Lite could use your website host, but it leaves ${those} out.`,
        reasons: [
          ...needs,
          inStalwart
            ? { tag: "Served by Stalwart", toward: "lite", must: true, badge: "Only Lite fits there" }
            : { tag: "A simple website host", toward: "lite", must: true, badge: "Can't run Bulwark" },
          { tag: "Someone else runs your mail server", toward: "full", must: false, badge: "Lite needs their help" },
        ],
        options: [
          {
            title: "Rent a small server for Bulwark",
            text: "Any small rented server can run it, and nothing has to change on your mail provider's side.",
            link: LINKS.installFull,
          },
          inStalwart
            ? {
                title: `Or use Lite without ${needsList}`,
                text: "Your mail provider installs it inside Stalwart for you, since that needs admin rights there. Ask them before you start.",
                link: LINKS.stalwartApp,
              }
            : {
                title: `Or use Lite without ${needsList}`,
                text: "Lite runs on your website host, but your mail provider has to switch on one setting first. Ask them before you start.",
                link: LINKS.liteSetting,
              },
        ],
        caveats,
      };
    }
    return {
      kind: "full",
      pick: "full",
      close: false,
      title: "Bulwark",
      pitch: inStalwart
        ? "An app of its own, so it can't live inside Stalwart the way Lite can. It can run on the same machine, though."
        : webhostOnly
          ? "An app that needs a server rather than a website host. The machine your mail server runs on can run it too."
          : "An app you run on a server, with an admin page and add-ons, and single sign-on if you want it.",
      primary: LINKS.installFull,
      reasons: [...needs, ...reasons.filter((r) => !r.must && r.toward === "full")],
      options: [],
      caveats,
    };
  }

  // --- Nothing forced: the leans decide, a tie goes to Lite -----------------
  const lite = score <= 0;
  const close = Math.abs(score) <= 1;
  const options: Card[] = [];
  if (lite && inStalwart) {
    // Same origin as Stalwart: no setting to switch on, no web host.
    if (hosted) {
      caveats.push({
        text: "Installing it needs admin rights on Stalwart, so your mail provider has to do it. Ask them first; Bulwark doesn't need their help.",
      });
    } else {
      caveats.push({ text: "It needs Stalwart 0.16.6 or later and an admin account there.", link: LINKS.stalwartApp });
    }
    if (answers.login?.includes("sso")) {
      caveats.push({ text: "In Lite, single sign-on works when Stalwart signs those accounts in through your login service." });
    }
    // With a provider, updating is their job too.
    if (upkeepMinimal && !hosted) {
      caveats.push({ text: "Lite doesn't tell you about updates. Watch the release page, then run \"update applications\" in Stalwart, especially for security fixes." });
    }
  } else if (lite) {
    if (hosted) {
      caveats.push({
        text: "Lite only works if your mail provider switches on one setting for it. Ask them first; Bulwark doesn't need it.",
        link: LINKS.liteSetting,
      });
    } else {
      caveats.push({ text: "Lite needs one setting switched on in Stalwart. It takes a minute.", link: LINKS.liteSetting });
      options.push({
        title: "Or let Stalwart host it",
        text: "Stalwart 0.16.6 or later can serve Lite itself, next to its admin page. Then there's no website host and no setting to switch on.",
        link: LINKS.stalwartApp,
      });
    }
    if (upkeepMinimal) {
      caveats.push({ text: "Lite doesn't tell you about updates. Watch the release page, and upload new versions yourself, especially security fixes." });
    }
  }
  return {
    kind: lite ? "lite" : "full",
    pick: lite ? "lite" : "full",
    close,
    lead: close ? "Both would work, and this one fits a little better." : undefined,
    title: lite ? "Bulwark Lite" : "Bulwark",
    pitch: lite
      ? inStalwart
        ? "Stalwart serves it itself, next to its admin page. No website host, no extra app, and no setting to switch on."
        : "Just files you upload to a website host. There's no app to keep running."
      : inStalwart
        ? "An app of its own, so it can't live inside Stalwart the way Lite can. It can run on the same machine, though."
        : "An app you run on a server. It tells you about updates and has room to grow: an admin page, add-ons and single sign-on.",
    primary: lite ? (inStalwart ? LINKS.stalwartApp : LINKS.installLite) : LINKS.installFull,
    secondary: close ? (lite ? { label: "Or Bulwark", href: LINKS.installFull.href } : { label: "Or Bulwark Lite", href: LINKS.installLite.href }) : undefined,
    reasons: reasons.filter((r) => r.toward === (lite ? "lite" : "full")),
    options,
    caveats,
  };
}

