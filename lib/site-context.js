// Site settings + WhatsApp/phone/email for the browser.
// Public pages get their settings from getServerSideProps (pageProps.site);
// components read them from this context so an admin change to the phone
// or WhatsApp number shows up everywhere immediately — no rebuild.
// Falls back to the hardcoded values in data/site.js when no DB data
// is present (e.g. admin pages, or before the database is connected).
import { createContext, useContext } from 'react';
import { SITE_URL, WHATSAPP_NUMBER, PHONE_DISPLAY, EMAIL } from '../data/site';

export const SiteContext = createContext(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  const s = (ctx && ctx.settings) || {};
  const whatsapp = s.whatsapp || WHATSAPP_NUMBER;
  const phoneDisplay = s.phone_display || PHONE_DISPLAY;
  const phoneTel = s.phone_tel || '971555523231';
  const email = s.email || EMAIL;
  return {
    siteName: s.site_name || 'UAE Rental Car',
    siteUrl: s.site_url || SITE_URL,
    whatsapp,
    phoneDisplay,
    phoneTel,
    email,
    waLink: (msg) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,
    telLink: `tel:+${phoneTel}`,
    mailLink: `mailto:${email}`,
  };
}
