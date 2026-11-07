import Link from 'next/link';
import Seo from '../components/Seo';
import Layout from '../components/Layout';
import Faq from '../components/Faq';
import CarCard from '../components/CarCard';
import { pageMeta } from '../lib/page-meta';
import { useSite } from '../lib/site-context';

export async function getServerSideProps() {
  // Dynamic import: lib/site-data pulls in mysql2 (Node-only), so it must
  // never be a top-level import of a page, or the browser build breaks.
  const { getSiteData } = await import('../lib/site-data');
  const site = await getSiteData();
  return { props: { site } };
}
const NODEPOSIT_FAQS = [
  {
    q: 'Which cars can I rent without a deposit in Dubai?',
    a: 'Selected economy and SUV models — for example the Toyota Camry and Hyundai Tucson — are available with zero deposit, subject to quick document verification.',
  },
  {
    q: 'How does the no-deposit verification work?',
    a: 'Send your documents on WhatsApp: tourists need a passport, visit visa, home-country licence and International Driving Permit; residents need an Emirates ID and UAE driving licence. Verification usually takes a few minutes.',
  },
  {
    q: 'Is there any hidden charge instead of the deposit?',
    a: 'No. The rental price is the price. Insurance is included and Salik tolls are billed at cost only, with a full statement.',
  },
  {
    q: 'What happens if the car is damaged?',
    a: 'Basic insurance is included in every rental. Damage beyond the insurance cover is charged at actual repair cost, with a full statement provided.',
  },
  {
    q: 'What is the minimum age for no-deposit rental?',
    a: '21 years for economy cars and 25 years for luxury vehicles, with a valid driving licence.',
  },
];

const ND_PERKS = ['✓ Zero Deposit', '✓ Free Insurance', '✓ 250 km/day included', '✓ 24/7 Support'];

export default function NoDeposit({ site }) {
  const live = useSite();
  const page = site.pages['no-deposit'] || {};
  const cars = site.cars;
  const ndCars = (() => {
    const nd = cars.filter((c) => (c.deposit || '').toLowerCase().includes('no deposit'));
    return nd.length ? nd.slice(0, 2) : cars.slice(0, 2);
  })();
  return (
    <Layout active="nodeposit">
      <Seo meta={pageMeta('no-deposit', page, site.settings)} />

      <section className="page-hero">
        <div className="container">
          <h1>{page.h1 || 'No Deposit Car Rental in Dubai'}</h1>
          <p className="hero-sub">{page.hero_subtitle || 'Rent a car with zero deposit — no big security hold, no blocked credit card.'}</p>
        </div>
      </section>

      {page.body_html ? (
  <section className="section" style={{ paddingBottom: 0 }}>
    <div className="container">
      <div dangerouslySetInnerHTML={{ __html: page.body_html }} />
    </div>
  </section>
) : null}

      <section className="section">
        <div className="container narrow">
          <h2 style={{ textAlign: 'center' }}>Drive Away Without Paying a Deposit</h2>
          <p style={{ textAlign: 'center' }} className="muted">
            Most Dubai rental companies block AED 1,000–3,000 on your card as a security deposit. With UAE
            Rental Car, selected economy and SUV models need no deposit at all — just a quick document check
            on WhatsApp, and the car is yours. The price you see is the price you pay: no hidden charges,
            free insurance included.
          </p>
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <a
              className="btn btn-whatsapp"
              style={{ width: 'auto', display: 'inline-block' }}
              href={live.waLink('Hi UAE Rental Car, I want a no-deposit car.')}
              target="_blank"
              rel="noopener"
            >
              📲 Book a No-Deposit Car
            </a>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>How No-Deposit Rental Works</h2>
          <p className="section-sub">Three steps, no deposit blocked on your card.</p>
          <div className="steps-grid">
            <div className="step">
              <span className="step-num">1</span>
              <h3>Choose Your Car</h3>
              <p>Pick any no-deposit economy or SUV model below — or ask us on WhatsApp what is available today.</p>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <h3>Quick Verification</h3>
              <p>Send your documents on WhatsApp. Tourists: passport, visa, licence + IDP. Residents: Emirates ID + UAE licence.</p>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <h3>Drive — No Deposit</h3>
              <p>Pay only the rental price. We deliver the car free, anywhere in Dubai, with insurance included.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section fleet">
        <div className="container">
          <h2>Available With Zero Deposit</h2>
          <p className="section-sub">Selected economy &amp; SUV models — more cars on request.</p>
          <div className="car-grid">
            {ndCars.map((car) => (
              <CarCard key={car.id} car={car} badge="NO DEPOSIT" perks={ND_PERKS} waText={`Hi, I want to rent the ${car.name} with no deposit.`} />
            ))}
            <article className="car-card">
              <span className="badge badge-gold">NO DEPOSIT</span>
              <img
                src={ndCars[0] ? ndCars[0].img : ""}
                alt="Economy cars available with no deposit in Dubai"
                loading="lazy"
                width="640"
                height="400"
              />
              <h3>More Economy Cars</h3>
              <div className="price-row">
                <div>
                  <small>Daily</small>
                  <strong>from AED 79</strong>
                </div>
                <div>
                  <small>Weekly</small>
                  <strong>from AED 499</strong>
                </div>
                <div>
                  <small>Monthly</small>
                  <strong>from AED 1,800</strong>
                </div>
              </div>
              <ul className="car-perks">
                {ND_PERKS.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="car-actions">
                <a
                  className="btn btn-whatsapp"
                  href={live.waLink('Hi UAE Rental Car, which economy cars are available with no deposit today?')}
                  target="_blank"
                  rel="noopener"
                >
                  WhatsApp
                </a>
                <a className="btn btn-outline" href={live.telLink}>
                  Call
                </a>
              </div>
            </article>
          </div>
          <p style={{ textAlign: 'center', marginTop: '20px' }} className="muted">
            Luxury and sports cars need a refundable security deposit.{' '}
            <Link href="/#fleet" style={{ color: '#0b5c43', fontWeight: 700 }}>
              See all cars →
            </Link>
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container narrow">
          <h2 style={{ textAlign: 'center' }}>No Deposit vs Standard Deposit</h2>
          <div className="req-cards">
            <div className="req-card">
              <h3>✅ No Deposit</h3>
              <ul>
                <li>No money blocked on your card</li>
                <li>Economy &amp; SUV models</li>
                <li>Quick document verification</li>
                <li>Same free insurance &amp; delivery</li>
              </ul>
            </div>
            <div className="req-card">
              <h3>🔒 With Deposit</h3>
              <ul>
                <li>Refundable security hold (AED 1,000–3,000)</li>
                <li>All cars, including luxury &amp; sports</li>
                <li>Hold released after return check</li>
                <li>Same free insurance &amp; delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>No Deposit FAQ</h2>
          <Faq items={NODEPOSIT_FAQS} />
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Rent With Zero Deposit Today</h2>
          <p>Message us on WhatsApp — tell us your dates and we will confirm a no-deposit car in minutes.</p>
          <a
            className="btn btn-whatsapp"
            style={{ width: 'auto', display: 'inline-block' }}
            href={live.waLink('Hi UAE Rental Car, I want a no-deposit car in Dubai.')}
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
