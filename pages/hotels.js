import { useEffect, useRef, useState } from 'react';
import Seo from '../components/Seo';
import Layout from '../components/Layout';
import Travellers, { hotelSummary } from '../components/Travellers';
import { pageMeta } from '../lib/page-meta';
import { useSite } from '../lib/site-context';

export async function getServerSideProps() {
  // Dynamic import: lib/site-data pulls in mysql2 (Node-only), so it must
  // never be a top-level import of a page, or the browser build breaks.
  const { getSiteData } = await import('../lib/site-data');
  const site = await getSiteData();
  return { props: { site } };
}
const HOTEL_PLACES = [
  'Dubai Marina',
  'Downtown Dubai / Burj Khalifa',
  'Palm Jumeirah',
  'JBR / Jumeirah Beach',
  'Deira',
  'Business Bay',
  'Atlantis The Palm',
  'Burj Al Arab Jumeirah',
  'Armani Hotel Dubai',
  'Abu Dhabi',
  'Sharjah',
];

const EXPERIENCES = [
  { emoji: '👨‍👩‍👧‍👦', name: 'Family Holidays', bg: 'linear-gradient(150deg,#0e6a4d,#084a36)', msg: 'Hi UAE Rental Car, I want a family holiday hotel.' },
  { emoji: '💑', name: 'Honeymoon & Romance', bg: 'linear-gradient(150deg,#c2526b,#8e2f45)', msg: 'Hi UAE Rental Car, I want a honeymoon hotel.' },
  { emoji: '🏖️', name: 'Staycation', bg: 'linear-gradient(150deg,#d9a441,#a86f1c)', msg: 'Hi UAE Rental Car, I want a staycation deal.' },
  { emoji: '🪂', name: 'Adventure', bg: 'linear-gradient(150deg,#d06a2c,#93390f)', msg: 'Hi UAE Rental Car, I want an adventure holiday.' },
  { emoji: '🧳', name: 'Long Holiday', bg: 'linear-gradient(150deg,#4d5fb5,#2c3570)', msg: 'Hi UAE Rental Car, I want a long holiday stay.' },
  { emoji: '🌆', name: 'City Break', bg: 'linear-gradient(150deg,#14957f,#0a5a4d)', msg: 'Hi UAE Rental Car, I want a city break hotel.' },
];

const iso = (d) => d.toISOString().split('T')[0];

export default function Hotels({ site }) {
  const live = useSite();
  const page = site.pages['hotels'] || {};
  const [where, setWhere] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [trav, setTrav] = useState({ adults: 2, children: 0, rooms: 1 });
  const rowRef = useRef(null);

  useEffect(() => {
    const t = new Date();
    const p3 = new Date();
    p3.setDate(t.getDate() + 3);
    setCheckin(iso(t));
    setCheckout(iso(p3));
  }, []);

  const search = (e) => {
    e.preventDefault();
    const msg = [
      'Hi UAE Rental Car, I want to book a hotel.',
      'Where: ' + where,
      'Check-in: ' + checkin,
      'Check-out: ' + checkout,
      'Guests: ' + hotelSummary(trav.adults, trav.children, trav.rooms),
    ].join('\n');
    window.open(live.waLink(msg), '_blank');
  };

  return (
    <Layout active="hotels">
      <Seo meta={pageMeta('hotels', page, site.settings)} />

      {/* ============ HOTEL HERO ============ */}
      <section className="hotel-hero">
        <div className="container">
          <h1>{page.h1 || 'Your Home Away From Home'}</h1>
          <p className="hero-sub">{page.hero_subtitle || 'Handpicked hotels across Dubai at honest prices.'}</p>
        </div>
      </section>

      {page.body_html ? (
  <section className="section" style={{ paddingBottom: 0 }}>
    <div className="container">
      <div dangerouslySetInnerHTML={{ __html: page.body_html }} />
    </div>
  </section>
) : null}

      {/* ============ HOTEL SEARCH ============ */}
      <section className="hotel-search-wrap">
        <div className="container">
          <form className="hotel-search-card" id="hotelSearch" aria-label="Hotel search" onSubmit={search}>
            <div className="hfield h-wide">
              <label htmlFor="hWhere">Where To</label>
              <input
                type="text"
                id="hWhere"
                list="hotel-places"
                placeholder="Search for a city or hotel"
                autoComplete="off"
                required
                value={where}
                onChange={(e) => setWhere(e.target.value)}
              />
            </div>
            <div className="hfield">
              <label htmlFor="hCheckin">Check In</label>
              <input type="date" id="hCheckin" required min={iso(new Date())} value={checkin} onChange={(e) => setCheckin(e.target.value)} />
            </div>
            <div className="hfield">
              <label htmlFor="hCheckout">Check Out</label>
              <input type="date" id="hCheckout" required min={checkin || iso(new Date())} value={checkout} onChange={(e) => setCheckout(e.target.value)} />
            </div>
            <div className="hfield">
              <label>Travellers</label>
              <Travellers kind="hotel" id="hTrav" adults={trav.adults} children={trav.children} rooms={trav.rooms} onChange={(v) => setTrav(v)} />
            </div>
            <button className="btn btn-search h-search" type="submit">
              Search
            </button>
            <datalist id="hotel-places">
              {HOTEL_PLACES.map((p) => (
                <option key={p} value={p}></option>
              ))}
            </datalist>
          </form>
        </div>
      </section>

      {/* ============ EXPERIENCES ============ */}
      <section className="section experiences">
        <div className="container">
          <div className="exp-head">
            <h2>Explore Our Best Experiences</h2>
            <div className="exp-arrows">
              <button type="button" id="expPrev" aria-label="Previous" onClick={() => rowRef.current && rowRef.current.scrollBy({ left: -280, behavior: 'smooth' })}>
                ←
              </button>
              <button type="button" id="expNext" aria-label="Next" onClick={() => rowRef.current && rowRef.current.scrollBy({ left: 280, behavior: 'smooth' })}>
                →
              </button>
            </div>
          </div>
          <div className="exp-row" id="expRow" ref={rowRef}>
            {EXPERIENCES.map((x) => (
              <a key={x.name} className="exp-card" style={{ background: x.bg }} href={live.waLink(x.msg)}>
                <span className="exp-emoji">{x.emoji}</span>
                <strong>{x.name}</strong>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROMO BANNER ============ */}
      <section className="section promo-wrap">
        <div className="container">
          <div className="promo-banner">
            <div>
              <span className="promo-tag">Limited offer</span>
              <h2>Secret Hotel Deals — up to 30% off</h2>
              <p>Handpicked Dubai hotels at members-only rates. This week only.</p>
            </div>
            <a
              className="btn btn-whatsapp"
              href={live.waLink('Hi UAE Rental Car, I want the secret hotel deals.')}
              target="_blank"
              rel="noopener"
            >
              Get the Deals
            </a>
          </div>
        </div>
      </section>

      {/* ============ WHY BOOK ============ */}
      <section className="section why-book">
        <div className="container">
          <h2>Why Book With Us</h2>
          <div className="why-grid">
            <div className="why-card">
              <span className="why-ic">⚡</span>
              <h3>Fast</h3>
              <p>Online booking in minutes — anytime, anywhere, no office visits.</p>
            </div>
            <div className="why-card">
              <span className="why-ic">🎯</span>
              <h3>Convenient</h3>
              <p>Compare handpicked hotels and honest prices in one place.</p>
            </div>
            <div className="why-card">
              <span className="why-ic">🔒</span>
              <h3>Secure</h3>
              <p>A trusted local operator — your payment and data are protected.</p>
            </div>
            <div className="why-card">
              <span className="why-ic">💰</span>
              <h3>Great Value</h3>
              <p>Real-time deals and last-minute offers, no hidden charges.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
