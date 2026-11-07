import { useState } from 'react';
import Link from 'next/link';
import Seo from '../components/Seo';
import Layout from '../components/Layout';
import Faq from '../components/Faq';
import CarCard from '../components/CarCard';
import SearchWidget from '../components/SearchWidget';
import BookingModal from '../components/BookingModal';
import { HOME_FAQS } from '../data/site';
import { pageMeta } from '../lib/page-meta';
import { useSite } from '../lib/site-context';

export async function getServerSideProps() {
  // Dynamic import: lib/site-data pulls in mysql2 (Node-only), so it must
  // never be a top-level import of a page, or the browser build breaks.
  const { getSiteData } = await import('../lib/site-data');
  const site = await getSiteData();
  return { props: { site } };
}
const REVIEWS = [
  {
    initial: 'A',
    bg: '#0b5c43',
    name: 'Ahmed K.',
    when: '2 weeks ago',
    text: '"Excellent service! Car was delivered to my hotel within 30 minutes. No deposit was a huge plus."',
  },
  {
    initial: 'S',
    bg: '#c9a227',
    name: 'Sarah M.',
    when: 'a month ago',
    text: '"Great prices and the SUV was clean and brand new. Customer support was responsive 24/7."',
  },
  {
    initial: 'O',
    bg: '#1a73e8',
    name: 'Omar R.',
    when: 'a month ago',
    text: '"Smooth monthly rental experience. Transparent pricing, no hidden fees. Highly recommend!"',
  },
];

export default function Home({ site }) {
  const live = useSite();
  const page = site.pages['home'] || {};
  const cars = site.cars;
  const [modal, setModal] = useState({ open: false, type: 'selfdrive', details: null });

  const openBooking = (type, details) => setModal({ open: true, type, details });
  const closeBooking = () => setModal({ open: false, type: 'selfdrive', details: null });

  return (
    <Layout active="home">
      <Seo meta={pageMeta('home', page, site.settings)} />

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container hero-inner">
          <h1>{page.h1 || 'Rent a Car in Dubai from AED 79/day'}</h1>
          <p className="hero-sub">{page.hero_subtitle || (<>✓ No Deposit Options &nbsp; ✓ Free Delivery &nbsp; ✓ 24/7 Support</>)}</p>
          <SearchWidget onBook={openBooking} />
        </div>
      </section>

      {page.body_html ? (
  <section className="section" style={{ paddingBottom: 0 }}>
    <div className="container">
      <div dangerouslySetInnerHTML={{ __html: page.body_html }} />
    </div>
  </section>
) : null}

      {/* ============ TRUST BADGES ============ */}
      <section className="trust-strip" aria-label="Why choose us">
        <div className="container trust-grid">
          <div className="trust-item">🛡️ <span>Zero Hidden Charges</span></div>
          <div className="trust-item">✓ <span>Free Insurance Included</span></div>
          <div className="trust-item">🛠️ <span>24/7 Roadside Assistance</span></div>
          <div className="trust-item">📍 <span>Drop-off Anywhere in Dubai</span></div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="section categories">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="cat-grid">
            <Link className="cat-card" href="/#fleet">
              <span className="cat-icon">🚗</span>
              <strong>Economy</strong>
              <small>24 cars</small>
            </Link>
            <Link className="cat-card" href="/#fleet">
              <span className="cat-icon">🚙</span>
              <strong>SUV</strong>
              <small>18 cars</small>
            </Link>
            <Link className="cat-card" href="/#fleet">
              <span className="cat-icon">🏎️</span>
              <strong>Luxury</strong>
              <small>12 cars</small>
            </Link>
            <Link className="cat-card" href="/monthly-rental/">
              <span className="cat-icon">📅</span>
              <strong>Monthly Deals</strong>
              <small>from AED 1,199</small>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURED FLEET ============ */}
      <section className="section fleet" id="fleet">
        <div className="container">
          <h2>Featured Cars</h2>
          <p className="section-sub">
            Transparent daily, weekly &amp; monthly rates — no hidden fees.{' '}
            <Link href="/compare/" style={{ color: '#0b5c43', fontWeight: 700 }}>
              Compare cars side by side &amp; calculate your cost →
            </Link>
          </p>
          <div className="car-grid">
            {cars.slice(0, 3).map((car, i) => (
              <CarCard key={car.id} car={car} badge={['POPULAR', 'BESTSELLER', 'LUXURY'][i]} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section steps">
        <div className="container">
          <h2>Rent in 4 Easy Steps</h2>
          <div className="steps-grid">
            <div className="step">
              <span className="step-num">1</span>
              <h3>Choose Your Car</h3>
              <p>Browse our fleet and pick the perfect car for your needs.</p>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <h3>Book Online</h3>
              <p>Select dates, location and confirm your booking instantly.</p>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <h3>Documents &amp; Payment</h3>
              <p>Quick verification with no deposit or minimal deposit.</p>
            </div>
            <div className="step">
              <span className="step-num">4</span>
              <h3>Pick-up &amp; Drive</h3>
              <p>Free delivery or pick-up at your location. Enjoy your ride.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="section testimonials">
        <div className="container">
          <h2>What Our Customers Say</h2>
          {/* Google reviews widget. To add a review, copy one g-card block below and change the initial, name, date, stars and text. Replace the sample reviews with real Google reviews as they come in. */}
          <div className="g-summary">
            <div className="g-logo" aria-hidden="true">
              G
            </div>
            <div className="g-score">
              4.9<small>out of 5</small>
            </div>
            <div>
              <div className="g-stars" aria-label="4.9 out of 5 stars">
                ★★★★★
              </div>
              <div className="g-meta">Based on 127 reviews on Google</div>
            </div>
            <a
              className="btn btn-whatsapp g-review-btn"
              href="https://www.google.com/search?q=UAE+Rental+Car+Dubai"
              target="_blank"
              rel="noopener"
            >
              ★ Review us on Google
            </a>
          </div>
          <div className="g-grid">
            {REVIEWS.map((r) => (
              <article key={r.name} className="g-card">
                <div className="g-head">
                  <div className="g-avatar" style={{ background: r.bg }}>
                    {r.initial}
                  </div>
                  <div>
                    <div className="g-name">{r.name}</div>
                    <div className="g-when">{r.when}</div>
                  </div>
                </div>
                <div className="stars" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                <p>{r.text}</p>
                <div className="g-src">
                  <b>G</b> Posted on Google
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section faq" id="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <Faq items={HOME_FAQS} />
        </div>
      </section>

      {/* ============ BOOKING MODAL ============ */}
      <BookingModal open={modal.open} type={modal.type} details={modal.details} onClose={closeBooking} />
    </Layout>
  );
}
