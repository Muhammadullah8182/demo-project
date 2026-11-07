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
const PROGRAMS = [
  { icon: '🚗', title: 'Daily Rental', text: 'Perfect for short trips and weekend plans. From AED 79/day with free delivery.', cta: 'Book daily →', msg: 'Hi UAE Rental Car, I want a daily rental.' },
  { icon: '📅', title: 'Weekly Rental', text: 'Staying a week? Weekly rates save you up to 20% versus daily pricing.', cta: 'Book weekly →', msg: 'Hi UAE Rental Car, I want a weekly rental.' },
  { icon: '🗓️', title: 'Monthly Rental', text: 'Our most popular plan. One fixed monthly price, maintenance included, free replacement car.', cta: 'Book monthly →', msg: 'Hi UAE Rental Car, I want a monthly rental.' },
  { icon: '✈️', title: 'Airport Pickup', text: 'Land at DXB or DWC and drive off. We meet you at arrivals with your car ready.', cta: 'Book pickup →', msg: 'Hi UAE Rental Car, I need airport pickup.' },
  { icon: '🔁', title: 'One-Way Rental', text: 'Pick up in Dubai, drop off in Abu Dhabi or Sharjah. One-way trips made simple.', cta: 'Book one-way →', msg: 'Hi UAE Rental Car, I want a one-way rental.' },
  { icon: '🤵', title: 'Chauffeur-Driven', text: 'Relax in the back seat. Professional drivers for business, events and evenings out.', cta: 'Book chauffeur →', msg: 'Hi UAE Rental Car, I need a chauffeur-driven car.' },
  { icon: '🏢', title: 'Corporate Rental', text: 'Fleet solutions for companies — monthly billing, dedicated support, multiple vehicles.', cta: 'Enquire →', msg: 'Hi UAE Rental Car, I need corporate rental.' },
  { icon: '📜', title: 'Long-Term Lease', text: '3, 6 or 12-month leases at the lowest rates. Ideal for residents and businesses.', cta: 'Enquire →', msg: 'Hi UAE Rental Car, I want a long-term lease.' },
];

const CITIES = [
  ['Dubai', '— the city that never slows down. Marina, Downtown, JBR and beyond, delivered in under an hour.'],
  ['Abu Dhabi', "— the capital's Corniche, Yas Island and Saadiyat, with inter-emirate one-way options."],
  ['Sharjah', '— affordable monthly rentals minutes from Dubai, perfect for commuters.'],
  ['Ajman', '— beach-side stays and budget-friendly long-term deals.'],
  ['Ras Al Khaimah', '— mountain roads and resorts; we deliver to every hotel on Marjan Island.'],
  ['Fujairah', '— east-coast escapes with full insurance for long drives.'],
  ['Umm Al Quwain', '— quiet getaways, delivered to your door.'],
];

const LOC_FAQS = [
  {
    q: 'Do you deliver the car to my hotel?',
    a: 'Yes — free delivery to any hotel, home or office in Dubai, and across all emirates. Just share your location on WhatsApp.',
  },
  {
    q: 'Can I pick up at DXB airport?',
    a: 'Absolutely. We meet you at arrivals with the car ready, paperwork done in minutes.',
  },
  {
    q: 'Can I return the car in a different city?',
    a: 'Yes, with our one-way rental option — e.g. pick up in Dubai, drop off in Abu Dhabi or Sharjah.',
  },
  {
    q: 'What documents do tourists need?',
    a: 'Passport with visit visa, your home-country driving license, and an International Driving Permit (IDP) for most nationalities.',
  },
  {
    q: 'What is the minimum age to rent?',
    a: '21 years with a valid license. Drivers under 25 may have a small young-driver surcharge on luxury cars.',
  },
  {
    q: 'How do Salik tolls work on rentals?',
    a: 'Toll crossings are tracked per car and added to your final bill at cost — no markup, full statement provided.',
  },
];

export default function Locations({ site }) {
  const live = useSite();
  const page = site.pages['locations'] || {};
  return (
    <Layout active="locations">
      <Seo meta={pageMeta('locations', page, site.settings)} />

      {/* ============ PAGE HERO ============ */}
      <section className="page-hero">
        <div className="container">
          <h1>{page.h1 || 'Car Rental Locations Across the UAE'}</h1>
          <p className="hero-sub">{page.hero_subtitle || 'Free delivery to your doorstep — anywhere in Dubai & the Emirates.'}</p>
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
          <h2 style={{ textAlign: 'center' }}>Rent a Car Anywhere in Dubai &amp; the UAE</h2>
          <p style={{ textAlign: 'center' }} className="muted">
            No need to visit an office. Tell us where you are — hotel, home, office or airport
            arrivals — and we bring the car to you, clean, fueled and ready to drive. Pickup and
            drop-off anywhere in the seven emirates, 24/7.
          </p>
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <a
              className="btn btn-whatsapp"
              style={{ width: 'auto', display: 'inline-block' }}
              href={live.waLink('Hi UAE Rental Car, I need a car delivered to my location.')}
              target="_blank"
              rel="noopener"
            >
              📲 Get a Car Delivered Now
            </a>
          </div>
        </div>
      </section>

      {/* ============ RENTAL PROGRAMS ============ */}
      <section className="section section-alt">
        <div className="container">
          <h2>Rental Programs for Every Need</h2>
          <p className="section-sub">Daily, weekly, monthly — or a driver at your service.</p>
          <div className="prog-grid">
            {PROGRAMS.map((p) => (
              <div key={p.title} className="prog-card">
                <h3>
                  {p.icon} {p.title}
                </h3>
                <p>{p.text}</p>
                <a href={live.waLink(p.msg)} target="_blank" rel="noopener">
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ REQUIREMENTS ============ */}
      <section className="section">
        <div className="container">
          <h2>What You Need to Rent a Car in the UAE</h2>
          <p className="section-sub">Minimum driving age is 21. Here is the paperwork:</p>
          <div className="req-cards">
            <div className="req-card">
              <h3>🧳 For Tourists</h3>
              <ul>
                <li>Passport + visit visa / entry stamp</li>
                <li>Driving license from your home country</li>
                <li>International Driving Permit (IDP) — required for most nationalities</li>
                <li>Credit card or cash for the security deposit</li>
              </ul>
            </div>
            <div className="req-card">
              <h3>🏠 For UAE Residents</h3>
              <ul>
                <li>Emirates ID (original)</li>
                <li>Valid UAE driving license</li>
                <li>Credit card or cash for the security deposit</li>
                <li>Proof of address for monthly rentals</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ POPULAR CITIES ============ */}
      <section className="section section-alt">
        <div className="container">
          <h2>Rent a Car in These Popular Cities</h2>
          <p className="section-sub">We deliver across all seven emirates.</p>
          <ol className="city-list">
            {CITIES.map(([city, text]) => (
              <li key={city}>
                <strong>{city}</strong> {text}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ TOP PICKUP LOCATIONS ============ */}
      <section className="section">
        <div className="container">
          <h2>Top Pickup Locations</h2>
          <p className="section-sub">Meet us — or we come to you.</p>
          <div className="loc-groups">
            <div className="loc-group">
              <h3>✈️ Airports</h3>
              <ul>
                <li>
                  <strong>Dubai International (DXB)</strong> — meet &amp; greet at arrivals, all terminals.
                </li>
                <li>
                  <strong>Al Maktoum (DWC)</strong> — pickup right outside arrivals.
                </li>
                <li>
                  <strong>Abu Dhabi (AUH)</strong> — inter-emirate delivery available.
                </li>
                <li>
                  <strong>Sharjah (SHJ)</strong> — quick handover at the terminal.
                </li>
              </ul>
            </div>
            <div className="loc-group">
              <h3>🏙️ Neighborhoods</h3>
              <ul>
                <li>
                  <strong>Downtown Dubai</strong> — Burj Khalifa, Dubai Mall area.
                </li>
                <li>
                  <strong>Dubai Marina &amp; JBR</strong> — hotels and residences.
                </li>
                <li>
                  <strong>Palm Jumeirah</strong> — villa and hotel delivery.
                </li>
                <li>
                  <strong>Jumeirah</strong> — beach road hotels and homes.
                </li>
                <li>
                  <strong>Business Bay</strong> — offices and towers.
                </li>
                <li>
                  <strong>Deira &amp; Bur Dubai</strong> — the classic districts.
                </li>
                <li>
                  <strong>Al Barsha &amp; JLT</strong> — quick 30-minute delivery.
                </li>
              </ul>
            </div>
            <div className="loc-group">
              <h3>🚇 Metro Stations</h3>
              <ul>
                <li>
                  <strong>Mall of the Emirates</strong> — handover at the station exit.
                </li>
                <li>
                  <strong>BurJuman</strong> — central, easy to reach.
                </li>
                <li>
                  <strong>Union Square</strong> — Deira side connections.
                </li>
                <li>
                  <strong>Dubai Internet City</strong> — for the business crowd.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DRIVING IN THE UAE ============ */}
      <section className="section section-alt">
        <div className="container narrow">
          <h2 style={{ textAlign: 'center' }}>Driving in the UAE — Good to Know</h2>
          <ul className="drive-list">
            <li>
              <strong>Speed limits:</strong> 60 km/h in cities, 100–140 km/h on highways. Radars are
              everywhere — stick to the limit.
            </li>
            <li>
              <strong>Salik tolls:</strong> automated gates on Sheikh Zayed Road and key routes (AED
              4–6 per crossing), billed to your rental.
            </li>
            <li>
              <strong>Main roads:</strong> E11 (Sheikh Zayed Road) runs the coast; E311 and E611 bypass
              the city.
            </li>
            <li>
              <strong>Fuel:</strong> among the cheapest in the region — fill up before returning the car.
            </li>
            <li>
              <strong>Parking:</strong> paid zones in busy areas; malls and hotels usually validate or
              offer free parking.
            </li>
          </ul>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section">
        <div className="container">
          <h2>Locations FAQ</h2>
          <Faq items={LOC_FAQS} />
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="cta-band">
        <div className="container">
          <h2>Need a Car Delivered Right Now?</h2>
          <p>Message us your location — we will bring the car to you, anywhere in the UAE.</p>
          <a
            className="btn btn-whatsapp"
            style={{ width: 'auto', display: 'inline-block' }}
            href={live.waLink('Hi UAE Rental Car, please deliver a car to my location.')}
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
