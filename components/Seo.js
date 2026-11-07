import Head from 'next/head';
import { HERO_IMG } from '../data/site';

// SEO head tags — same values as static v11 per page.
// geo tags (AE/Dubai, ICBM 25.2048, 55.2708) on every page, as in static v11.
export default function Seo({ meta }) {
  const ogImage = meta.ogImage || HERO_IMG;
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />
      <meta name="theme-color" content="#0b5c43" />
      <meta name="geo.region" content="AE" />
      <meta name="geo.placename" content="Dubai" />
      <meta name="geo.position" content="25.2048;55.2708" />
      <meta name="ICBM" content="25.2048, 55.2708" />
      <meta property="og:type" content={meta.ogType || 'website'} />
      <meta property="og:title" content={meta.ogTitle || meta.title} />
      <meta property="og:description" content={meta.ogDescription || meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={meta.ogLocale || 'en_US'} />
      <meta property="og:site_name" content="UAE Rental Car" />
      {(meta.hreflang || []).map((h) => (
        // lowercase `hreflang` (not React's camelCase hrefLang) so the
        // exported HTML matches the static site byte-for-byte.
        <link key={h.lang} rel="alternate" hreflang={h.lang} href={h.href} />
      ))}
      {(meta.jsonLd || []).map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}
