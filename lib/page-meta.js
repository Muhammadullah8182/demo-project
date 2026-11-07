// Client-safe page meta: merges a DB page row over the hardcoded SEO meta.
// No database import here — pages import this at the top level, so it must
// stay free of Node-only modules (mysql2). The DB reading lives in
// lib/site-data.js, which is dynamic-imported inside getServerSideProps.
import { SEO, PHONE_DISPLAY } from '../data/site';

// Map a page route slug to its key in the SEO table (data/site.js).
export const PAGE_SEO_KEY = {
  home: 'home',
  hotels: 'hotels',
  locations: 'locations',
  contact: 'contact',
  taxi: 'taxi',
  compare: 'compare',
  privacy: 'privacy',
  terms: 'terms',
  ar: 'ar',
  'monthly-rental': 'monthly',
  'no-deposit': 'nodeposit',
  blog: 'blog',
};

export const PAGE_SLUGS = Object.keys(PAGE_SEO_KEY);

// Merge a DB page row over the hardcoded SEO meta (title/description only;
// canonical, hreflang and JSON-LD stay exactly as in v2).
export function pageMeta(slug, dbRow, settings) {
  const key = PAGE_SEO_KEY[slug] || slug;
  const base = SEO[key] || SEO.home;
  const meta = { ...base, jsonLd: base.jsonLd };
  if (dbRow) {
    if (dbRow.title) {
      meta.title = dbRow.title;
      meta.ogTitle = dbRow.title;
    }
    if (dbRow.meta_description) {
      meta.description = dbRow.meta_description;
      meta.ogDescription = dbRow.meta_description;
    }
  }
  // If the admin changed the phone number, keep the JSON-LD telephone honest.
  const phone = settings && settings.phone_display ? settings.phone_display : PHONE_DISPLAY;
  if (phone !== PHONE_DISPLAY && meta.jsonLd) {
    try {
      const json = JSON.stringify(meta.jsonLd).split('+971-55-552-3231').join(phone);
      meta.jsonLd = JSON.parse(json);
    } catch {
      /* keep the original schema on any error */
    }
  }
  return meta;
}
