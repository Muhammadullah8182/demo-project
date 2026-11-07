import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSite } from '../lib/site-context';
import { useLang } from '../lib/i18n';

// Shared WhatsApp icon (official glyph, as in the static site)
export function WaIcon({ white }) {
  return (
    <svg className="wa-svg" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={white ? '#ffffff' : '#1faa53'}
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

const NAV = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/#fleet', label: 'Fleet', key: 'fleet' },
  { href: '/taxi/', label: 'Taxi', key: 'taxi' },
  { href: '/compare/', label: 'Compare', key: 'compare' },
  { href: '/monthly-rental/', label: 'Monthly Rental', key: 'monthly' },
  { href: '/no-deposit/', label: 'No Deposit', key: 'nodeposit' },
  { href: '/hotels/', label: 'Hotels', key: 'hotels' },
  { href: '/locations/', label: 'Locations', key: 'locations' },
  { href: '/blog/', label: 'Blog', key: 'blog' },
  { href: '/contact/', label: 'Contact', key: 'contact' },
];

export default function Layout({ children, active, navWaMsg }) {
  const { lang, toggleLang } = useLang();
  const site = useSite();
  const [navOpen, setNavOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on route change is handled by links calling closeNav.
  const closeNav = () => setNavOpen(false);

  return (
    <>
      {/* ============ TOP UTILITY BAR ============ */}
      <div className="topbar">
        <div className="container topbar-inner">
          <a className="topbar-phone" href={site.telLink}>
            📞 <span>Call:</span> <span dir="ltr">{site.phoneDisplay}</span>
          </a>
          <div className="topbar-right">
            <span className="topbar-support">🕘 24/7 Support</span>
            <button
              className="lang-switch"
              type="button"
              aria-label="Switch language"
              onClick={toggleLang}
            >
              {lang === 'ar' ? 'EN ▾' : 'العربي ▾'}
            </button>
          </div>
        </div>
      </div>

      {/* ============ HEADER ============ */}
      <header className="site-header" id="siteHeader">
        <div className="container header-inner">
          <Link className="logo" href="/" aria-label="UAE Rental Car — Premium Car Rental Dubai">
            <img
              className="logo-lockup"
              src="/images/logo.png?v=5"
              alt="UAE Rental Car — Premium Car Rental Dubai"
              width="800"
              height="221"
            />
          </Link>
          <nav
            className={'main-nav' + (navOpen ? ' open' : '')}
            id="mainNav"
            aria-label="Main navigation"
          >
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={active === item.key ? 'active' : ''}
                onClick={closeNav}
              >
                {item.label}
              </Link>
            ))}
            <a
              className="btn btn-whatsapp nav-cta"
              href={site.waLink(navWaMsg || 'Hi UAE Rental Car, I want to rent a car.')}
              target="_blank"
              rel="noopener"
              onClick={closeNav}
            >
              WhatsApp Us
            </a>
          </nav>
          <button
            className={'hamburger' + (navOpen ? ' open' : '')}
            id="hamburger"
            aria-label="Open menu"
            aria-expanded={navOpen}
            aria-controls="mainNav"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      {navOpen && <div className="nav-overlay show" onClick={closeNav}></div>}

      <main>{children}</main>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer" id="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <span className="footer-logo">
              <img className="logo-mark" src="/images/logo.svg" alt="UAE Rental Car logo" width="75" height="30" />
              <strong>UAE Rental Car</strong>
            </span>
            <p>
              Premium car rental service in Dubai. Reliable, affordable, hassle-free rentals with
              no deposit options.
            </p>
            <div className="social">
              <a href="#" aria-label="Instagram">
                📸
              </a>
              <a href="#" aria-label="Facebook">
                📘
              </a>
              <a href="#" aria-label="TikTok">
                🎵
              </a>
            </div>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <strong>Quick Links</strong>
            <Link href="/">Home</Link>
            <Link href="/#fleet">Fleet</Link>
            <Link href="/monthly-rental/">Monthly Rental</Link>
            <Link href="/no-deposit/">No Deposit</Link>
            <Link href="/hotels/">Hotels</Link>
            <Link href="/blog/">Blog</Link>
            <Link href="/locations/">Locations</Link>
            <Link href="/contact/">Contact</Link>
          </nav>
          <div className="footer-contact">
            <strong>Contact Us</strong>
            <p>📍 Dubai, UAE</p>
            <p>
              📞 <a href={site.telLink}>{site.phoneDisplay}</a>
            </p>
            <p>
              ✉️ <a href={site.mailLink}>{site.email}</a>
            </p>
            <p>🕘 24/7 Customer Support</p>
          </div>
          <div className="footer-pay">
            <strong>We Accept</strong>
            <div className="pay-badges">
              <span>VISA</span>
              <span>Mastercard</span>
              <span>AMEX</span>
              <span>Cash</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            © <span id="year">2026</span> UAE Rental Car. All rights reserved. |{' '}
            <Link href="/privacy/">Privacy Policy</Link> |{' '}
            <Link href="/terms/">Terms &amp; Conditions</Link>
          </div>
        </div>
      </footer>

      {/* ============ Floating buttons ============ */}
      <a
        className="wa-float"
        href={site.waLink('Hi UAE Rental Car, I want to rent a car.')}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
      >
        <WaIcon white />
      </a>
      <button
        className="to-top"
        id="toTop"
        aria-label="Back to top"
        style={{ display: showTop ? 'block' : 'none' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </>
  );
}
