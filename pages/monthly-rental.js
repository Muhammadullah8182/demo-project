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
const MONTHLY_FAQS = [
  {
    q: 'What is the cheapest monthly car rental in Dubai?',
    a: 'Monthly rentals start from AED 1,199 per month for economy cars. For example, the Toyota Camry is AED 2,200 per month — about AED 73 per day.',
  },
  {
    q: 'What is included in a monthly rental?',
    a: 'One fixed monthly price covering the car, basic insurance, maintenance, free delivery anywhere in Dubai and a free replacement car if yours needs service.',
  },
  {
    q: 'Can I swap my monthly rental car?',
    a: 'Yes. Change to a different model at the end of your month, or upgrade mid-month — just message us on WhatsApp and we arrange the swap.',
  },
  {
    q: 'What documents do I need for a monthly rental?',
    a: 'Residents: Emirates ID and UAE driving licence. Tourists: passport, visit visa, home-country licence and International Driving Permit. Proof of address is needed for monthly plans.',
  },
  {
    q: 'Can I cancel my monthly rental early?',
    a: 'Yes. Monthly rentals can be cancelled with notice — unused days are calculated fairly and any refundable deposit is returned after the car check.',
  },
];

export default function MonthlyRental({ site }) {
  const live = useSite();
  const page = site.pages['monthly-rental'] || {};
  const cars = site.cars;
  return (
    <Layout active="monthly">
      <Seo meta={pageMeta('monthly-rental', page, site.settings)} />

      <section className="page-hero">
        <div className="container">
          <h1>{page.h1 || 'Monthly Car Rental in Dubai'}</h1>
          <p className="hero-sub">{page.hero_subtitle || 'One fixed monthly price — up to 29% cheaper per day than daily rental.'}</p>
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
          <h2 style={{ textAlign: 'center' }}>Your Car for the Whole Month — From AED 1,199</h2>
          <p style={{ textAlign: 'center' }} className="muted">
            Staying in Dubai for a month or more? Monthly rental is our most popular plan — and the cheapest
            way to drive. One fixed price covers the car, insurance and maintenance. No daily bookings, no
            surge pricing, no surprises. We deliver free, anywhere in Dubai, and if your car ever needs
            service, we bring you a free replacement.
          </p>
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <a
              className="btn btn-whatsapp"
              style={{ width: 'auto', display: 'inline-block' }}
              href={live.waLink('Hi UAE Rental Car, I want a monthly rental.')}
              target="_blank"
              rel="noopener"
            >
              📲 Book a Monthly Rental
            </a>
          </div>
        </div>
      </section>

      <section className="section section-alt fleet">
        <div className="container">
          <h2>Monthly Prices</h2>
          <p className="section-sub">Monthly rental saves up to 29% per day versus the daily rate. More cars on request.</p>
          <div className="car-grid">
            {cars.slice(0, 3).map((car, i) => (
              <CarCard
                key={car.id}
                car={car}
                badge={['POPULAR', 'BESTSELLER', 'LUXURY'][i]}
                perks={[
                  `✓ ~AED ${Math.round(car.monthly / 30)}/day on monthly`,
                  '✓ Free Insurance',
                  '✓ 250 km/day included',
                  '✓ 24/7 Support',
                ]}
                waText={`Hi, I want the ${car.name} on a monthly rental.`}
              />
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '20px' }} className="muted">
            Economy monthly rentals start from AED 1,199/month.{' '}
            <a
              href={live.waLink('Hi UAE Rental Car, what is your cheapest monthly rental?')}
              target="_blank"
              rel="noopener"
              style={{ color: '#0b5c43', fontWeight: 700 }}
            >
              Ask us on WhatsApp →
            </a>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>What Your Monthly Price Includes</h2>
          <p className="section-sub">Everything is in the one fixed price — no extras at the end of the month.</p>
          <div className="prog-grid">
            <div className="prog-card">
              <h3>🛡️ Insurance Included</h3>
              <p>Basic insurance on every monthly rental. Full coverage upgrades available.</p>
            </div>
            <div className="prog-card">
              <h3>🔧 Maintenance Included</h3>
              <p>Servicing and wear-and-tear are on us. If the car needs the workshop, you get a free replacement car.</p>
            </div>
            <div className="prog-card">
              <h3>🚗 Free Delivery</h3>
              <p>We deliver to your home, hotel or office anywhere in Dubai — and collect it the same way.</p>
            </div>
            <div className="prog-card">
              <h3>🔁 Swap Anytime</h3>
              <p>Change to a different model at month end, or upgrade mid-month. Just message us on WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>Who Monthly Rental Is For</h2>
          <p className="section-sub">If you are staying a while, monthly is almost always cheaper than daily.</p>
          <div className="req-cards">
            <div className="req-card">
              <h3>🏠 Residents</h3>
              <ul>
                <li>Cheaper than owning — no loan, no depreciation, no service bills</li>
                <li>One fixed monthly cost, easy to budget</li>
                <li>Swap cars whenever your needs change</li>
              </ul>
            </div>
            <div className="req-card">
              <h3>🧳 Long-Stay Visitors</h3>
              <ul>
                <li>Tourists staying 30+ days save up to 29% per day</li>
                <li>Free delivery to your hotel or apartment</li>
                <li>Drive anywhere in the UAE — Abu Dhabi, Sharjah, Ras Al Khaimah</li>
              </ul>
            </div>
            <div className="req-card">
              <h3>🏢 Companies</h3>
              <ul>
                <li>Monthly billing, one invoice for the whole fleet</li>
                <li>Cars for staff, clients and site visits</li>
                <li>Dedicated support and priority replacement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section steps">
        <div className="container">
          <h2>Monthly Rental in 3 Steps</h2>
          <div className="steps-grid">
            <div className="step">
              <span className="step-num">1</span>
              <h3>Choose Your Car</h3>
              <p>Pick a model above or tell us your budget on WhatsApp — we will suggest the best monthly deal.</p>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <h3>Documents &amp; Payment</h3>
              <p>Emirates ID + UAE licence for residents; passport, visa, licence + IDP for visitors. Pay the first month.</p>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <h3>We Deliver the Car</h3>
              <p>Free delivery to your door, clean and fueled. Drive for the month — we handle the rest.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Monthly Rental FAQ</h2>
          <Faq items={MONTHLY_FAQS} />
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Start Your Monthly Rental Today</h2>
          <p>Message us your dates and budget — we will confirm your car and deliver it free, anywhere in Dubai.</p>
          <a
            className="btn btn-whatsapp"
            style={{ width: 'auto', display: 'inline-block' }}
            href={live.waLink('Hi UAE Rental Car, I want a monthly rental in Dubai.')}
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
