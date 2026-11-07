import { useState } from 'react';
import Seo from '../components/Seo';
import Layout from '../components/Layout';
import Faq from '../components/Faq';
import { fmtAed } from '../data/site';
import { pageMeta } from '../lib/page-meta';
import { useSite } from '../lib/site-context';

export async function getServerSideProps() {
  // Dynamic import: lib/site-data pulls in mysql2 (Node-only), so it must
  // never be a top-level import of a page, or the browser build breaks.
  const { getSiteData } = await import('../lib/site-data');
  const site = await getSiteData();
  return { props: { site } };
}
const COMPARE_FAQS = [
  {
    q: 'How does the rental cost calculator work?',
    a: 'Pick a car and the number of days. The calculator applies weekly and monthly rates automatically, so longer rentals cost less per day. The total shown is your exact rental price.',
  },
  {
    q: 'Can I compare more than 3 cars?',
    a: 'The table compares up to 3 cars at a time. Tick any 3 cars above to compare them — or ask us on WhatsApp and we will compare more models for you.',
  },
  {
    q: 'Are the prices shown final?',
    a: 'Yes — the price you see is the price you pay. Insurance is included and Salik tolls are billed at cost only, with a full statement.',
  },
];

export default function Compare({ site }) {
  const live = useSite();
  const page = site.pages['compare'] || {};
  const cars = site.cars;
  const [sel, setSel] = useState(() => cars.slice(0, 3).map((c) => c.id));
  const [calcCar, setCalcCar] = useState(() => (cars[0] ? cars[0].id : ''));
  const [days, setDays] = useState(7);

  const toggleCar = (id, checked) => {
    if (checked) {
      if (sel.length >= 3) {
        alert('Pick up to 3 cars to compare.');
        return;
      }
      setSel([...sel, id]);
    } else {
      const next = sel.filter((x) => x !== id);
      if (!next.length) return; // keep at least one car selected
      setSel(next);
    }
  };

  const selCars = sel.map((id) => cars.find((c) => c.id === id)).filter(Boolean);
  const minDaily = Math.min(...selCars.map((c) => c.daily));

  const tableRows = [
    ['Car', selCars.map((c) => (
      <span key={c.id}>
        <img src={c.img} alt={c.name} />
        <br />
        <strong>{c.name}</strong>
        <br />
        <span className="best-tag">{c.best}</span>
      </span>
    ))],
    ['Daily', selCars.map((c) => (
      <span key={c.id} className={'cmp-price' + (c.daily === minDaily ? ' winner' : '')}>
        {fmtAed(c.daily)}
        <small>per day</small>
      </span>
    ))],
    ['Weekly', selCars.map((c) => (
      <span key={c.id} className="cmp-price">
        {fmtAed(c.weekly)}
        <small>per week</small>
      </span>
    ))],
    ['Monthly', selCars.map((c) => (
      <span key={c.id} className="cmp-price">
        {fmtAed(c.monthly)}
        <small>per month</small>
      </span>
    ))],
    ['Seats', selCars.map((c) => <span key={c.id}>{c.seats} seats</span>)],
    ['Luggage', selCars.map((c) => <span key={c.id}>{c.bags} large bags</span>)],
    ['Gearbox', selCars.map((c) => <span key={c.id}>{c.trans}</span>)],
    ['Fuel', selCars.map((c) => <span key={c.id}>{c.fuel}</span>)],
    ['Deposit', selCars.map((c) => <span key={c.id}>{c.deposit}</span>)],
    ['', selCars.map((c) => (
      <span key={c.id} className="cmp-cta">
        <a className="btn btn-whatsapp" href={live.waLink(`Hi, I want to rent the ${c.name}.`)} target="_blank" rel="noopener">
          WhatsApp
        </a>
        <a className="btn btn-outline" href={live.telLink}>
          Call
        </a>
      </span>
    ))],
  ];

  // ---- Calculator (same math as static compare.html) ----
  const car = cars.find((c) => c.id === calcCar) || cars[0];
  const months = Math.floor(days / 30);
  const rem = days % 30;
  const weeks = Math.floor(rem / 7);
  const remDays = rem % 7;
  const total = months * car.monthly + weeks * car.weekly + remDays * car.daily;
  const dailyOnly = days * car.daily;
  const save = dailyOnly - total;
  const parts = [];
  if (months) parts.push(['Monthly × ' + months, fmtAed(months * car.monthly)]);
  if (weeks) parts.push(['Weekly × ' + weeks, fmtAed(weeks * car.weekly)]);
  if (remDays) parts.push(['Daily × ' + remDays, fmtAed(remDays * car.daily)]);
  const calcWa = live.waLink(`Hi UAE Rental Car, I want to rent the ${car.name} for ${days} days. Total: ${fmtAed(total)}.`);

  return (
    <Layout active="compare">
      <Seo meta={pageMeta('compare', page, site.settings)} />

      {/* ============ PAGE HERO ============ */}
      <section className="page-hero">
        <div className="container">
          <h1>{page.h1 || 'Compare Car Rental Prices in Dubai'}</h1>
          <p className="hero-sub">{page.hero_subtitle || 'Side-by-side prices, then your exact trip cost — no hidden charges.'}</p>
        </div>
      </section>

      {page.body_html ? (
  <section className="section" style={{ paddingBottom: 0 }}>
    <div className="container">
      <div dangerouslySetInnerHTML={{ __html: page.body_html }} />
    </div>
  </section>
) : null}

      {/* ============ CAR COMPARISON ============ */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center' }}>Compare Cars Side by Side</h2>
          <p className="section-sub" style={{ textAlign: 'center' }}>
            Tick up to 3 cars and see the difference instantly.
          </p>
          <div className="pick-row" id="pickRow">
            {cars.map((c) => {
              const on = sel.includes(c.id);
              return (
                <label key={c.id} className={'pick-chip' + (on ? ' on' : '')}>
                  <input
                    type="checkbox"
                    data-id={c.id}
                    checked={on}
                    onChange={(e) => toggleCar(c.id, e.target.checked)}
                  />{' '}
                  {c.name}
                </label>
              );
            })}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="compare-table" id="cmpTable">
              <tbody>
                <tr>
                  <th></th>
                  {cars.map((c) => (
                    <th key={c.id}>{c.name}</th>
                  ))}
                </tr>
                {tableRows.map(([label, cells], i) => (
                  <tr key={i}>
                    <td>{label}</td>
                    {cells.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ textAlign: 'center', marginTop: '20px' }} className="muted">
            More cars coming soon — 50+ models on request.{' '}
            <a
              href={live.waLink('Hi UAE Rental Car, what other cars do you have?')}
              target="_blank"
              rel="noopener"
              style={{ color: '#0b5c43', fontWeight: 700 }}
            >
              Ask us on WhatsApp →
            </a>
          </p>
        </div>
      </section>

      {/* ============ COST CALCULATOR ============ */}
      <section className="section section-alt">
        <div className="container">
          <h2 style={{ textAlign: 'center' }}>Rental Cost Calculator</h2>
          <p className="section-sub" style={{ textAlign: 'center' }}>
            Pick a car and your days — see your exact total, including weekly &amp; monthly discounts.
          </p>
          <div className="calc-wrap">
            <div className="calc-card">
              <h3>Your Trip</h3>
              <div className="calc-field">
                <label htmlFor="calcCar">Choose your car</label>
                <select id="calcCar" value={calcCar} onChange={(e) => setCalcCar(e.target.value)}>
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — from {fmtAed(c.daily)}/day
                    </option>
                  ))}
                </select>
              </div>
              <div className="calc-field">
                <label htmlFor="calcDays">
                  How many days?{' '}
                  <span className="days-big" id="daysOut">
                    {days} {days === 1 ? 'day' : 'days'}
                  </span>
                </label>
                <input
                  type="range"
                  id="calcDays"
                  min="1"
                  max="60"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value, 10))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7a73', fontSize: '13px' }}>
                  <span>1 day</span>
                  <span>30 days = monthly rate</span>
                  <span>60 days</span>
                </div>
              </div>
              <p className="muted" style={{ margin: 0 }}>
                ✓ Free delivery anywhere in Dubai &nbsp; ✓ Free airport delivery (DXB / DWC) &nbsp; ✓ Insurance
                included
              </p>
            </div>
            <div className="calc-result">
              <h3>Your Total</h3>
              <div className="total" id="calcTotal">
                {fmtAed(total)}
              </div>
              <div className="perday" id="calcPerDay">
                {fmtAed(Math.round(total / days))} per day
              </div>
              <div id="calcBreak">
                {parts.map(([label, value]) => (
                  <div key={label} className="break-row">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div id="calcSave">
                {save > 0 ? <span className="save-badge">You save {fmtAed(save)} vs daily rate</span> : null}
              </div>
              <a className="btn btn-whatsapp" id="calcWa" href={calcWa} target="_blank" rel="noopener">
                📲 Book This on WhatsApp
              </a>
              <p style={{ color: '#c9e8d8', fontSize: '13px', margin: '12px 0 0' }}>
                No hidden charges. Insurance included. Salik tolls at cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section">
        <div className="container">
          <h2>Compare &amp; Calculate FAQ</h2>
          <Faq items={COMPARE_FAQS} />
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="cta-band">
        <div className="container">
          <h2>Found Your Car? Book It Now</h2>
          <p>Message us on WhatsApp with your dates — we will confirm your car in minutes.</p>
          <a
            className="btn btn-whatsapp"
            style={{ width: 'auto', display: 'inline-block' }}
            href={live.waLink('Hi UAE Rental Car, I compared the cars and I want to book.')}
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
