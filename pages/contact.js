import { useState } from 'react';
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

export default function Contact({ site }) {
  const live = useSite();
  const page = site.pages['contact'] || {};
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    const p = phone.trim();
    const m = message.trim();
    if (!n || !p || !m) return;
    const text =
      'Hi UAE Rental Car, you have a new website enquiry.\n' +
      'Name: ' +
      n +
      '\nPhone: ' +
      p +
      (email.trim() ? '\nEmail: ' + email.trim() : '') +
      '\nMessage: ' +
      m;
    window.open(live.waLink(text), '_blank');
  };

  return (
    <Layout active="contact">
      <Seo meta={pageMeta('contact', page, site.settings)} />

      {/* ============ PAGE HERO ============ */}
      <section className="page-hero">
        <div className="container">
          <h1>{page.h1 || 'Contact Us'}</h1>
          <p className="hero-sub">{page.hero_subtitle || 'Questions, comments or suggestions? Message us — we reply fast, 24/7.'}</p>
        </div>
      </section>

      {page.body_html ? (
  <section className="section" style={{ paddingBottom: 0 }}>
    <div className="container">
      <div dangerouslySetInnerHTML={{ __html: page.body_html }} />
    </div>
  </section>
) : null}

      {/* ============ CONTACT CARD ============ */}
      <section className="section">
        <div className="container">
          <div className="contact-card">
            <form className="contact-form" id="contactForm" onSubmit={submit}>
              <h2>Send Us a Message</h2>
              <div className="cfield">
                <label htmlFor="cName">Name *</label>
                <input type="text" id="cName" name="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="cfield">
                <label htmlFor="cPhone">Phone *</label>
                <input type="tel" id="cPhone" name="phone" required autoComplete="tel" placeholder="+971 ..." value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="cfield">
                <label htmlFor="cEmail">Email</label>
                <input type="email" id="cEmail" name="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="cfield">
                <label htmlFor="cMsg">Message / Comments *</label>
                <textarea id="cMsg" name="message" rows="5" required placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <button className="btn btn-search" type="submit">
                Send via WhatsApp →
              </button>
              <p className="muted" style={{ fontSize: '.85rem', marginTop: '10px' }}>
                Your message opens in WhatsApp — no waiting on email replies.
              </p>
            </form>
            <aside className="contact-info">
              <h2>Get in Touch</h2>
              <div className="ci-row">
                <span className="ci-ic">📍</span>
                <div>
                  <strong>Office Address</strong>
                  <p>Dubai, UAE</p>
                </div>
              </div>
              <div className="ci-row">
                <span className="ci-ic">🕘</span>
                <div>
                  <strong>Opening Hours</strong>
                  <p>24/7 — every day of the year</p>
                </div>
              </div>
              <div className="ci-row">
                <span className="ci-ic">📞</span>
                <div>
                  <strong>Telephone</strong>
                  <p>
                    <a href={live.telLink}>{live.phoneDisplay}</a>
                  </p>
                </div>
              </div>
              <div className="ci-row">
                <span className="ci-ic">✉️</span>
                <div>
                  <strong>Email</strong>
                  <p>
                    <a href={live.mailLink}>{live.email}</a>
                  </p>
                </div>
              </div>
              <a
                className="btn btn-whatsapp"
                style={{ width: '100%', marginTop: '8px' }}
                href={live.waLink('Hi UAE Rental Car, I have a question.')}
                target="_blank"
                rel="noopener"
              >
                💬 Chat on WhatsApp
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* ============ MAP ============ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 style={{ textAlign: 'center' }}>Find Us in Dubai</h2>
          <p className="section-sub">We deliver cars across the whole city — meet us anywhere.</p>
          <div className="map-wrap">
            <iframe
              title="UAE Rental Car — Dubai map"
              src="https://www.google.com/maps?q=Dubai,United+Arab+Emirates&z=11&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </Layout>
  );
}
