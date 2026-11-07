import '../styles/globals.css';
import { LangContext, useI18n } from '../lib/i18n';
import { SiteContext } from '../lib/site-context';

// App shell: loads the site CSS and runs the EN/AR language engine
// (same dictionary + text-node translation as the static site's i18n.js).
// Public pages pass their DB-loaded data in pageProps.site; the SiteContext
// makes the live settings (phone, WhatsApp, email) available to every
// component without prop-drilling. When pageProps.site is absent (admin
// pages, errors) components fall back to the hardcoded values.
export default function App({ Component, pageProps }) {
  const [lang, toggleLang] = useI18n();
  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      <SiteContext.Provider value={pageProps.site || null}>
        <Component {...pageProps} />
      </SiteContext.Provider>
    </LangContext.Provider>
  );
}
