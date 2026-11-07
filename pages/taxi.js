import Seo from '../components/Seo';
import Layout from '../components/Layout';
import Faq from '../components/Faq';
import { pageMeta } from '../lib/page-meta';
import { useSite } from '../lib/site-context';

export async function getServerSideProps() {
  // Dynamic import: lib/site-data pulls in mysql2 (Node-only), so it must
  // never be a top-level import of a page, or the browser build breaks.
  const { getSiteData } = await import('../lib/site-data');
  const site = await getSiteData();
  return { props: { site } };
}
const TAXI_FAQS = [
  {
    q: 'How do I book a taxi in Dubai with UAE Rental Car?',
    a: 'Message us on WhatsApp any time — we are available 24/7, there is no booking fee, and you can pay by card or cash. Tell us your pick-up point, drop-off point, date and time, and we confirm your car and driver.',
  },
  {
    q: 'How much does a taxi cost in Dubai?',
    a: 'Our taxis run on the meter: the flag fall is AED 5.00 in the day (6am–10pm) and AED 5.50 at night (10pm–6am), with a minimum fare of AED 12. The per-km rate is set by the RTA — check the meter. We charge no booking fee, while app bookings add AED 4.00–7.50 in fees with a AED 13 minimum fare.',
  },
  {
    q: 'How much is a taxi from Dubai Airport (DXB) to Downtown Dubai or Dubai Marina?',
    a: 'From DXB the meter starts at AED 20 for a car or AED 25 for a van, then AED 2.62 per km. As a guide, DXB to Downtown Dubai is roughly AED 45–80 and DXB to Dubai Marina roughly AED 60–70, plus any Salik tolls — the exact fare is whatever the meter shows.',
  },
  {
    q: 'How much is a taxi from Dubai to Abu Dhabi?',
    a: 'A metered taxi from Dubai to Abu Dhabi is typically around AED 250–350 one way for the roughly 140 km, 75–90-minute trip. We do one-way and round-trip bookings in a sedan, SUV or van.',
  },
  {
    q: 'Can I pay by card or cash?',
    a: 'Yes — both card and cash are accepted, with no booking fee.',
  },
  {
    q: 'Do you provide child seats?',
    a: 'Yes — child seats are available on request when you book. Just mention it in your WhatsApp message.',
  },
  {
    q: 'Can I book a taxi in advance, and do you operate at night?',
    a: 'Yes — we operate 24/7, including advance bookings on WhatsApp. For airport pickups, share your flight number and terminal (DXB T1, T2 or T3, or DWC) and the driver will meet you at arrivals.',
  },
];

const bookTaxi = 'Hi UAE Rental Car, I want to book a taxi in Dubai.';

export default function Taxi({ site }) {
  const live = useSite();
  const page = site.pages['taxi'] || {};
  return (
    <Layout active="taxi" navWaMsg="Hi UAE Rental Car, I want to book a taxi.">
      <Seo meta={pageMeta('taxi', page, site.settings)} />

      {/* ============ PAGE HERO ============ */}
      <section className="page-hero">
        <div className="container">
          <h1>{page.h1 || 'Taxi Service in Dubai — Book a Dubai Taxi in Minutes'}</h1>
          <p className="hero-sub">{page.hero_subtitle || 'Airport transfers, city rides and intercity trips — book on WhatsApp, no app, no booking fee.'}</p>
        </div>
      </section>

      {page.body_html ? (
  <section className="section" style={{ paddingBottom: 0 }}>
    <div className="container">
      <div dangerouslySetInnerHTML={{ __html: page.body_html }} />
    </div>
  </section>
) : null}

      {/* ============ INTRO ============ */}
      <section className="section">
        <div className="container narrow">
          <h2 style={{ textAlign: 'center' }}>Book a Taxi in Dubai Without an App</h2>
          <p style={{ textAlign: 'center' }} className="muted">
            No app to download, no account to create, no booking fee. Message us on WhatsApp with your
            pick-up and drop-off points, and we confirm your car and driver in minutes — 24/7, anywhere
            in Dubai. Sedan, SUV or van, one-way or round-trip, airport or city. You pay by card or
            cash, and the fare runs on the meter, so you always know what you are paying.
          </p>
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <a
              className="btn btn-whatsapp"
              style={{ width: 'auto', display: 'inline-block' }}
              href={live.waLink(bookTaxi)}
              target="_blank"
              rel="noopener"
            >
              📲 Book a Taxi on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section section-alt">
        <div className="container">
          <h2>How Dubai Taxi Booking Works</h2>
          <p className="section-sub">Three steps, no app, no booking fee.</p>
          <div className="steps-grid">
            <div className="step">
              <span className="step-num">1</span>
              <h3>Message Your Route</h3>
              <p>Send your pick-up point, drop-off point, date and time on WhatsApp. For airport pickups, add your flight number and terminal.</p>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <h3>We Confirm Your Car</h3>
              <p>We confirm your sedan, SUV or van and your driver — usually within minutes, any time of day or night.</p>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <h3>Ride &amp; Pay</h3>
              <p>Your driver meets you on time. Pay by card or cash — the fare runs on the meter, with no booking fee added.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FLEET ============ */}
      <section className="section">
        <div className="container">
          <h2>Taxi Cars: Sedan, SUV &amp; Van</h2>
          <p className="section-sub">Metered fares, one-way or round-trip, anywhere in Dubai and across the UAE.</p>
          <div className="req-cards">
            <div className="req-card">
              <h3>🚗 Sedan</h3>
              <ul>
                <li>Up to 4 passengers</li>
                <li>Metered fare</li>
                <li>City rides &amp; airport transfers</li>
                <li>Best for 1–2 people with luggage</li>
              </ul>
              <p style={{ marginTop: '12px' }}>
                <a className="btn btn-whatsapp" href={live.waLink('Hi, I want to book a sedan taxi in Dubai.')} target="_blank" rel="noopener">
                  Book a Sedan
                </a>
              </p>
            </div>
            <div className="req-card">
              <h3>🚙 SUV</h3>
              <ul>
                <li>Up to 6 passengers</li>
                <li>Metered fare</li>
                <li>Families &amp; extra luggage</li>
                <li>Best for groups and airport runs</li>
              </ul>
              <p style={{ marginTop: '12px' }}>
                <a className="btn btn-whatsapp" href={live.waLink('Hi, I want to book an SUV taxi in Dubai.')} target="_blank" rel="noopener">
                  Book an SUV
                </a>
              </p>
            </div>
            <div className="req-card">
              <h3>🚐 Van</h3>
              <ul>
                <li>Groups &amp; lots of luggage</li>
                <li>Metered fare</li>
                <li>Airport &amp; intercity trips</li>
                <li>Best for large families and teams</li>
              </ul>
              <p style={{ marginTop: '12px' }}>
                <a className="btn btn-whatsapp" href={live.waLink('Hi, I want to book a van taxi in Dubai.')} target="_blank" rel="noopener">
                  Book a Van
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AIRPORT TRANSFERS ============ */}
      <section className="section section-alt">
        <div className="container narrow">
          <h2 style={{ textAlign: 'center' }}>Dubai Airport Taxi — DXB &amp; DWC</h2>
          <p style={{ textAlign: 'center' }} className="muted">
            Airport pickups from all terminals — DXB Terminal 1, 2 and 3, and Al Maktoum (DWC). Share your
            flight number and terminal when you book and your driver meets you at arrivals. Fares below
            are the official metered airport rates; the exact fare is whatever the meter shows, plus any
            Salik tolls.
          </p>
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table className="compare-table">
              <tbody>
                <tr>
                  <th>Airport fare</th>
                  <th>Rate</th>
                </tr>
                <tr>
                  <td>Flag fall — car (DXB / DWC)</td>
                  <td>
                    <strong>AED 20</strong>
                  </td>
                </tr>
                <tr>
                  <td>Flag fall — van (DXB / DWC)</td>
                  <td>
                    <strong>AED 25</strong>
                  </td>
                </tr>
                <tr>
                  <td>Per kilometre</td>
                  <td>
                    <strong>AED 2.62 / km</strong>
                  </td>
                </tr>
                <tr>
                  <td>DXB → Downtown Dubai (guide)</td>
                  <td>
                    <strong>~AED 45–80</strong>
                  </td>
                </tr>
                <tr>
                  <td>DXB → Dubai Marina (guide)</td>
                  <td>
                    <strong>~AED 60–70</strong>
                  </td>
                </tr>
                <tr>
                  <td>Salik tolls</td>
                  <td>Added at cost</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <a
              className="btn btn-whatsapp"
              style={{ width: 'auto', display: 'inline-block' }}
              href={live.waLink('Hi UAE Rental Car, I need an airport taxi from DXB.')}
              target="_blank"
              rel="noopener"
            >
              📲 Book an Airport Taxi
            </a>
          </div>
        </div>
      </section>

      {/* ============ INTERCITY ============ */}
      <section className="section">
        <div className="container">
          <h2>Intercity Taxi: Dubai to Abu Dhabi, Sharjah &amp; Ajman</h2>
          <p className="section-sub">One-way or round-trip, sedan, SUV or van — across the UAE.</p>
          <div className="req-cards">
            <div className="req-card">
              <h3>Dubai → Abu Dhabi</h3>
              <ul>
                <li>~140 km, 75–90 minutes</li>
                <li>Metered, typically ~AED 250–350 one way</li>
                <li>One-way &amp; round-trip</li>
                <li>Sedan, SUV or van</li>
              </ul>
            </div>
            <div className="req-card">
              <h3>Dubai → Sharjah</h3>
              <ul>
                <li>Metered fare — ask on WhatsApp for an estimate</li>
                <li>One-way &amp; round-trip</li>
                <li>Daily commutes welcome</li>
                <li>Sedan, SUV or van</li>
              </ul>
            </div>
            <div className="req-card">
              <h3>Dubai → Ajman</h3>
              <ul>
                <li>Metered fare — ask on WhatsApp for an estimate</li>
                <li>One-way &amp; round-trip</li>
                <li>Airport &amp; city pickups</li>
                <li>Sedan, SUV or van</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FARES GUIDE ============ */}
      <section className="section section-alt">
        <div className="container narrow">
          <h2 style={{ textAlign: 'center' }}>Dubai Taxi Fares — What You Pay</h2>
          <p style={{ textAlign: 'center' }} className="muted">
            Honest metered fares. We add no booking fee — app bookings in Dubai add AED 4.00–7.50 in fees
            with a AED 13 minimum fare.
          </p>
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table className="compare-table">
              <tbody>
                <tr>
                  <th>City fare</th>
                  <th>Rate</th>
                </tr>
                <tr>
                  <td>Flag fall — day (6am–10pm)</td>
                  <td>
                    <strong>AED 5.00</strong>
                  </td>
                </tr>
                <tr>
                  <td>Flag fall — night (10pm–6am)</td>
                  <td>
                    <strong>AED 5.50</strong>
                  </td>
                </tr>
                <tr>
                  <td>Minimum fare</td>
                  <td>
                    <strong>AED 12</strong>
                  </td>
                </tr>
                <tr>
                  <td>Per kilometre</td>
                  <td>
                    <strong>RTA metered rate — check the meter</strong>
                  </td>
                </tr>
                <tr>
                  <td>Waiting time</td>
                  <td>
                    <strong>AED 0.50 / minute</strong>
                  </td>
                </tr>
                <tr>
                  <td>Booking fee with us</td>
                  <td>
                    <strong>None — AED 0</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============ PRIVATE VS RTA ============ */}
      <section className="section">
        <div className="container narrow">
          <h2 style={{ textAlign: 'center' }}>Private Taxi vs RTA / App Taxi</h2>
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table className="compare-table">
              <tbody>
                <tr>
                  <th></th>
                  <th>UAE Rental Car taxi</th>
                  <th>RTA / app taxi</th>
                </tr>
                <tr>
                  <td>How to book</td>
                  <td>WhatsApp message</td>
                  <td>Hala / Careem app, or street hail</td>
                </tr>
                <tr>
                  <td>Booking fee</td>
                  <td>None</td>
                  <td>AED 4.00–7.50 on apps</td>
                </tr>
                <tr>
                  <td>Minimum fare</td>
                  <td>AED 12 (metered)</td>
                  <td>AED 13 (app-booked)</td>
                </tr>
                <tr>
                  <td>Advance booking</td>
                  <td>Yes, on WhatsApp</td>
                  <td>Yes, on the app</td>
                </tr>
                <tr>
                  <td>Child seat</td>
                  <td>On request</td>
                  <td>Hala Kids on the app</td>
                </tr>
                <tr>
                  <td>Vehicle choice</td>
                  <td>Sedan, SUV or van</td>
                  <td>Assigned by the app</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section section-alt">
        <div className="container">
          <h2>Dubai Taxi FAQ</h2>
          <Faq items={TAXI_FAQS} />
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="cta-band">
        <div className="container">
          <h2>Book Your Dubai Taxi Now</h2>
          <p>Message us on WhatsApp — tell us where from, where to, and when, and we confirm your taxi in minutes.</p>
          <a
            className="btn btn-whatsapp"
            style={{ width: 'auto', display: 'inline-block' }}
            href={live.waLink(bookTaxi)}
            target="_blank"
            rel="noopener"
          >
            📲 WhatsApp Us Now
          </a>
        </div>
      </section>
    </Layout>
  );
}
