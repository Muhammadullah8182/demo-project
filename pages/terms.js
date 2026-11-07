import Seo from '../components/Seo';
import Layout from '../components/Layout';
import { pageMeta } from '../lib/page-meta';
import { useSite } from '../lib/site-context';
export async function getServerSideProps() {
  // Dynamic import: lib/site-data pulls in mysql2 (Node-only), so it must
  // never be a top-level import of a page, or the browser build breaks.
  const { getSiteData } = await import('../lib/site-data');
  const site = await getSiteData();
  return { props: { site } };
}

export default function Terms({ site }) {
  const live = useSite();
  const page = site.pages['terms'] || {};
  return (
    <Layout active="terms">
      <Seo meta={pageMeta('terms', page, site.settings)} />

      <section className="page-hero">
        <div className="container">
          <h1>{page.h1 || 'Terms &amp; Conditions'}</h1>
          <p className="hero-sub">{page.hero_subtitle || 'Simple, fair terms for renting with us — in plain words.'}</p>
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
        <div className="container narrow legal-doc">
          <p className="updated">Last updated: 30 October 2026</p>
          <p>
            By booking a car with UAE Rental Car (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), based in
            Dubai, United Arab Emirates, you agree to the terms below. If anything is unclear, message us on
            WhatsApp before you book — we reply 24/7.
          </p>

          <h2>1. Bookings &amp; Confirmation</h2>
          <p>
            You can book through this website, our contact form, or WhatsApp. A booking is confirmed only
            when we confirm it to you on WhatsApp with your booking reference (format URC-YYYYMMDD-XXXX).
            Until then, availability is not guaranteed.
          </p>

          <h2>2. Who Can Rent</h2>
          <ul>
            <li>
              Minimum age: <strong>21 years</strong> for economy cars, <strong>25 years</strong> for luxury
              vehicles.
            </li>
            <li>
              A valid driving licence. Tourists need their home-country licence plus an International Driving
              Permit where required, along with a passport and visit visa. UAE residents need a UAE driving
              licence and Emirates ID.
            </li>
            <li>Only the named driver(s) on the booking may drive the car.</li>
          </ul>

          <h2>3. Pricing &amp; Payment</h2>
          <ul>
            <li>
              Rates start from <strong>AED 79/day</strong>; weekly and monthly rates are discounted and shown
              on the Monthly Rental page.
            </li>
            <li>
              A refundable security deposit of <strong>AED 1,000–3,000</strong> (depending on the car) is
              blocked on your card for most rentals. Selected cars are available with{' '}
              <strong>no deposit</strong>, subject to document verification.
            </li>
            <li>
              We accept card and cash. The deposit hold is released after the car is returned and checked,
              usually within 14–21 days depending on your bank.
            </li>
          </ul>

          <h2>4. Mileage &amp; Fuel</h2>
          <ul>
            <li>
              <strong>250 km per day</strong> is included in the rental price. Extra kilometres are charged
              at the rate stated for your car at booking.
            </li>
            <li>
              Please return the car with the same fuel level as at pick-up, or a refuelling charge applies.
            </li>
          </ul>

          <h2>5. Insurance</h2>
          <p>
            Basic third-party insurance is included in every rental, as required by UAE law. It covers damage
            to other vehicles and property — not to the rental car itself. Full-cover / CDW upgrades are
            available; an excess (deductible) applies per incident, and the exact amount is confirmed before
            you drive.
          </p>

          <h2>6. Salik Tolls &amp; Traffic Fines</h2>
          <p>
            Salik tolls, parking charges and any traffic fines incurred during your rental are your
            responsibility and will be charged to you, based on the official records.
          </p>

          <h2>7. Fair &amp; Prohibited Use</h2>
          <p>
            The car must not be used for racing, off-road driving, towing, commercial transport of
            passengers or goods without our written agreement, subletting to another person, or driving under
            the influence of alcohol or drugs. Breach of this section makes you liable for all resulting
            damage and costs.
          </p>

          <h2>8. Damage &amp; Accidents</h2>
          <p>
            If the car is damaged or involved in an accident, tell us immediately on WhatsApp and, where
            required, call the police and obtain a police report — insurance claims in the UAE require one. Do
            not admit fault or arrange repairs without our approval.
          </p>

          <h2>9. Cancellation</h2>
          <p>
            You can cancel free of charge up to <strong>24 hours before</strong> your scheduled pick-up —
            just message us on WhatsApp. Later cancellations may incur one day&apos;s rental charge.
          </p>

          <h2>10. Our Liability</h2>
          <p>
            Our total liability for any booking is limited to the amount you paid for that rental. We are not
            liable for indirect losses such as missed flights or meetings.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These terms are governed by the laws of the United Arab Emirates, and any disputes will be
            handled by the courts of Dubai.
          </p>

          <h2>12. Contact Us</h2>
          <p>Questions about these terms? We are here 24/7:</p>
          <ul>
            <li>
              📞 <a href={live.telLink}>{live.phoneDisplay}</a> (24/7)
            </li>
            <li>
              ✉️ <a href={live.mailLink}>{live.email}</a>
            </li>
            <li>📍 Dubai, United Arab Emirates</li>
          </ul>
          <a
            className="btn btn-whatsapp"
            style={{ marginTop: '14px' }}
            href={live.waLink('Hi UAE Rental Car, I have a question about your terms.')}
            target="_blank"
            rel="noopener"
          >
            💬 Ask on WhatsApp
          </a>
        </div>
      </section>
    </Layout>
  );
}
