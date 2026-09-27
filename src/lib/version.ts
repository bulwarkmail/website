/**
 * The Bulwark release that works with Stalwart 1.0. A placeholder until that
 * release is tagged: set it here once and the whole site follows. Docs
 * markdown writes the token {{BULWARK_VERSION}}, which lib/docs.ts replaces
 * with this value. public/press/README.md is served as it is, so it spells
 * the placeholder out: replace it there by hand.
 */
export const BULWARK_VERSION = "[BULWARK VERSION]";

/**
 * Whether the site shows Stalwart 1.0 support: the announcement bar, the
 * upgrade guide and every 1.0 note in the docs. Off unless the build sets
 * NEXT_PUBLIC_STALWART_1_0=1, which the beta workflow does and production
 * doesn't, so bulwarkmail.org keeps describing the released Bulwark until
 * {@link BULWARK_VERSION} ships. Next.js inlines the value at build time, on
 * the server as well, so the docs search agrees with the pages.
 *
 * Docs markdown gates text with {{#stalwart-1.0}}…{{/stalwart-1.0}}, with an
 * optional {{else}} for the text production shows instead, and a whole page
 * with `release: stalwart-1.0` in its front matter.
 */
export const STALWART_1_0 = process.env.NEXT_PUBLIC_STALWART_1_0 === "1";
