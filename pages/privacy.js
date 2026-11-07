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

export default function Privacy({ site }) {
  const live = useSite();
  const page = site.pages['privacy'] || {};
  return (
    <Layout active="privacy">
      <Seo meta={pageMeta('privacy', page, site.settings)} />

      <section className="page-hero">
        <div className="container">
          <h1>{page.h1 || 'Privacy Policy'}</h1>
          <p className="hero-sub">{page.hero_subtitle || 'How we collect, use and protect your information.'}</p>
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
            UAE Rental Car (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a car rental service based in
            Dubai, United Arab Emirates. This policy explains what information we collect when you use our
            website or book with us, and how we use and protect it.
          </p>

          <h2>1. Information We Collect</h2>
          <p>When you enquire or book, we may collect:</p>
          <ul>
            <li>
              <strong>Contact details</strong> — your name, phone number and email address.
            </li>
            <li>
              <strong>Rental documents</strong> — copies of your passport, visit visa, driving licence (and
              International Driving Permit where required) or Emirates ID, needed to verify you are eligible
              to rent.
            </li>
            <li>
              <strong>Booking details</strong> — pick-up and drop-off locations, dates, car type and any
              messages you send us.
            </li>
            <li>
              <strong>Website basics</strong> — your language preference (stored on your own device) and
              standard, anonymous visit statistics.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information only to:</p>
          <ul>
            <li>Process and confirm your booking and deliver your car.</li>
            <li>Communicate with you about your booking — usually on WhatsApp.</li>
            <li>Provide 24/7 customer support during your rental.</li>
            <li>Meet legal requirements, such as rental and insurance records.</li>
          </ul>
          <p>
            We do not sell your personal information to anyone, and we do not use it for advertising
            unrelated to your booking.
          </p>

          <h2>3. WhatsApp Communication</h2>
          <p>
            Most of our bookings are confirmed through WhatsApp. Messages you send us there are also subject
            to WhatsApp&apos;s own privacy policy. Please do not send us sensitive information (such as card
            PINs) over chat.
          </p>

          <h2>4. Sharing Your Information</h2>
          <p>
            We share your information only when necessary to complete your booking — for example with our
            rental partner or insurer. We never share it for marketing by third parties.
          </p>

          <h2>5. Data Security &amp; Retention</h2>
          <p>
            We take reasonable steps to keep your information safe and limit access to the people who need it
            to serve you. We keep rental records only as long as required by UAE law and for handling any
            post-rental matters (such as fines or damage claims), then delete them.
          </p>

          <h2>6. Cookies</h2>
          <p>
            This website uses minimal storage on your device — for example to remember your language choice.
            We do not run advertising trackers.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            You may ask us at any time for a copy of the information we hold about you, or ask us to correct
            or delete it, by contacting us below. We will respond as quickly as we can.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. The latest version will always be on this page, with
            the updated date shown above.
          </p>

          <h2>9. Contact Us</h2>
          <p>For any privacy question, reach us any time:</p>
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
            href={live.waLink('Hi UAE Rental Car, I have a privacy question.')}
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
