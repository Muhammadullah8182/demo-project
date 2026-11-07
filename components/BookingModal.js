import { useEffect, useState } from 'react';
import { useSite } from '../lib/site-context';
import { WaIcon } from './Layout';

// 2-step booking modal — same flow, validation and messages as static v11.
// Step 1 details → Step 2 review → Step 3 success with URC-YYYYMMDD-XXXX ref.
// POSTs to /api/booking (saves to MySQL); falls back to a locally generated
// ref + WhatsApp when the API is unreachable or the database is down.
const VEHICLES = {
  selfdrive: [
    { id: 'camry', name: 'Toyota Camry', sub: 'Economy sedan · 5 seats', price: 'AED 99/day' },
    { id: 'tucson', name: 'Hyundai Tucson', sub: 'SUV · 5 seats', price: 'AED 149/day' },
    { id: 'eclass', name: 'Mercedes E-Class', sub: 'Luxury sedan · 5 seats', price: 'AED 349/day' },
    { id: 'any', name: 'Best available', sub: 'Let us pick the perfect car', price: 'Best price' },
  ],
  taxi: [
    { id: 'sedan', name: 'Sedan', sub: 'Comfortable · up to 3 guests', price: 'Metered' },
    { id: 'suv', name: 'SUV', sub: 'Spacious · up to 5 guests', price: 'Metered' },
    { id: 'van', name: 'Van', sub: 'Group travel · up to 7 guests', price: 'Metered' },
  ],
};

function localRef() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return (
    'URC-' +
    d.getFullYear() +
    p(d.getMonth() + 1) +
    p(d.getDate()) +
    '-' +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

function taxiWaText(d, vehicle) {
  const n = ['Hi UAE Rental Car, I want to book.'];
  n.push('Service: Taxi (' + d.trip + ')');
  n.push('Pick-up: ' + d.pickup);
  n.push('Drop-off: ' + d.dropoff);
  n.push('Date: ' + d.date + (d.time ? ' at ' + d.time : ''));
  if (d.return_date) n.push('Return: ' + d.return_date + (d.return_time ? ' at ' + d.return_time : ''));
  n.push('Travellers: ' + d.travellers);
  if (vehicle) n.push('Vehicle: ' + vehicle);
  return n.join('\n');
}

function selfdriveWaText(d, vehicle) {
  const n = ['Hi UAE Rental Car, I want to rent a car.'];
  n.push('Pick-up: ' + d.location);
  n.push('From: ' + d.from + '  To: ' + d.to);
  if (vehicle) n.push('Vehicle: ' + vehicle);
  return n.join('\n');
}

export default function BookingModal({ open, type, details, onClose }) {
  const site = useSite();
  const [pane, setPane] = useState(1);
  const [vehicle, setVehicle] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [flight, setFlight] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [ref, setRef] = useState('');
  const [sending, setSending] = useState(false);

  // Reset the form every time the modal opens (same as static main.js).
  useEffect(() => {
    if (open) {
      setPane(1);
      setVehicle(VEHICLES[type] ? VEHICLES[type][0].name : '');
      setName('');
      setPhone('');
      setEmail('');
      setFlight('');
      setNotes('');
      setError('');
      setRef('');
      setSending(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, type]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !details) return null;

  const vehicles = VEHICLES[type] || VEHICLES.selfdrive;

  const chips = () => {
    if (type === 'taxi') {
      return (
        <>
          <span className="chip">🚕 <b>Taxi</b> · {details.trip}</span>
          <span className="chip">{details.pickup} → {details.dropoff}</span>
          <span className="chip">📅 {details.date}{details.time ? ' · ' + details.time : ''}</span>
          <span className="chip">👥 {details.travellers}</span>
        </>
      );
    }
    return (
      <>
        <span className="chip">🚗 <b>Self-drive</b></span>
        <span className="chip">📍 {details.location}</span>
        <span className="chip">📅 {details.from} → {details.to}</span>
      </>
    );
  };

  const validate = () => {
    if (name.trim().length < 2) return 'Please enter your full name.';
    if (!/^[+\d][\d\s\-()]{6,18}$/.test(phone.trim())) return 'Please enter a valid mobile number.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.';
    return '';
  };

  const reviewRows = () => {
    const rows = [];
    const add = (label, value) => {
      if (value) rows.push([label, value]);
    };
    if (type === 'taxi') {
      add('Service', 'Taxi · ' + details.trip);
      add('Vehicle', vehicle);
      add('Pick-up', details.pickup);
      add('Drop-off', details.dropoff);
      add('Date', details.date + (details.time ? ' at ' + details.time : ''));
      if (details.return_date) {
        add('Return pick-up', details.return_pickup);
        add('Return drop-off', details.return_dropoff);
        add('Return date', details.return_date + (details.return_time ? ' at ' + details.return_time : ''));
        add('Return travellers', details.return_travellers);
      }
      add('Travellers', details.travellers);
      add('Flight', flight.trim());
    } else {
      add('Service', 'Self-drive rental');
      add('Vehicle', vehicle);
      add('Pick-up', details.location);
      add('From', details.from);
      add('To', details.to);
    }
    add('Name', name.trim());
    add('Mobile', phone.trim());
    add('Email', email.trim());
    add('Notes', notes.trim());
    return rows;
  };

  const handleNext = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setPane(2);
  };

  const handleConfirm = async () => {
    setSending(true);
    const payload = {
      type,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      vehicle,
      flight: flight.trim(),
      notes: notes.trim(),
      details,
    };
    let refValue = localRef();
    try {
      const res = await fetch('/api/booking/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.ok && data.ref) refValue = data.ref;
    } catch (e) {
      // PHP unreachable (e.g. static preview) — local ref + WhatsApp fallback.
    }
    setRef(refValue);
    setPane(3);
    setSending(false);
  };

  const confirmWaText = () => {
    const n = ['New booking ' + ref + ' — UAE Rental Car'];
    n.push('Service: ' + (type === 'taxi' ? 'Taxi (' + details.trip + ')' : 'Self-drive rental'));
    n.push('Vehicle: ' + vehicle);
    if (type === 'taxi') {
      n.push('Pick-up: ' + details.pickup);
      n.push('Drop-off: ' + details.dropoff);
      n.push('Date: ' + details.date + (details.time ? ' at ' + details.time : ''));
      if (details.return_date) {
        n.push('Return: ' + details.return_pickup + ' → ' + details.return_dropoff);
        n.push('Return date: ' + details.return_date + (details.return_time ? ' at ' + details.return_time : ''));
      }
      n.push('Travellers: ' + details.travellers);
      if (flight.trim()) n.push('Flight: ' + flight.trim());
    } else {
      n.push('Pick-up: ' + details.location);
      n.push('From: ' + details.from);
      n.push('To: ' + details.to);
    }
    n.push('Name: ' + name.trim());
    n.push('Mobile: ' + phone.trim());
    if (email.trim()) n.push('Email: ' + email.trim());
    if (notes.trim()) n.push('Notes: ' + notes.trim());
    return n.join('\n');
  };

  const skipWaText = () =>
    type === 'taxi' ? taxiWaText(details, vehicle) : selfdriveWaText(details, vehicle);

  return (
    <div className="booking-modal" id="bookingModal" role="dialog" aria-modal="true" aria-labelledby="bmTitle">
      <div className="bm-backdrop" data-bm-close onClick={onClose}></div>
      <div className="bm-card" role="document">
        <button className="bm-close" data-bm-close aria-label="Close booking form" onClick={onClose}>
          ×
        </button>
        <div className="bm-head">
          <h2 id="bmTitle">Complete Your Booking</h2>
          <div className="bm-steps">
            <span className={'bm-step' + (pane === 1 ? ' active' : '') + (pane > 1 ? ' done' : '')} data-s="1">
              <i>1</i> Your details
            </span>
            <span className={'bm-step' + (pane === 2 ? ' active' : '') + (pane > 2 ? ' done' : '')} data-s="2">
              <i>2</i> Review
            </span>
          </div>
        </div>
        <div className="bm-summary" id="bmSummary">
          {chips()}
        </div>
        <div className="bm-body">
          <div className="bm-pane" data-pane="1" hidden={pane !== 1}>
            <h3>Choose your vehicle</h3>
            <div className="bm-vehicles" id="bmVehicles">
              {vehicles.map((v) => (
                <label key={v.id} className="bm-vehicle">
                  <input
                    type="radio"
                    name="bmVehicle"
                    value={v.name}
                    checked={vehicle === v.name}
                    onChange={() => setVehicle(v.name)}
                  />
                  <span className="v-card">
                    <strong>{v.name}</strong>
                    <small>{v.sub}</small>
                    <span className="v-price">{v.price}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="bm-form">
              <div className="bm-field">
                <label htmlFor="bmName">Full name *</label>
                <input id="bmName" autoComplete="name" placeholder="e.g. Ahmed Khan" maxLength="80" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="bm-field">
                <label htmlFor="bmPhone">Mobile / WhatsApp *</label>
                <input id="bmPhone" inputMode="tel" autoComplete="tel" placeholder="+971 50 123 4567" maxLength="25" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="bm-field">
                <label htmlFor="bmEmail">
                  Email <span className="opt">(optional)</span>
                </label>
                <input id="bmEmail" type="email" autoComplete="email" placeholder="you@email.com" maxLength="80" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="bm-field" id="bmFlightWrap" hidden={type !== 'taxi'}>
                <label htmlFor="bmFlight">
                  Flight number <span className="opt">(for airport pickup)</span>
                </label>
                <input id="bmFlight" placeholder="e.g. EK 512" maxLength="20" value={flight} onChange={(e) => setFlight(e.target.value)} />
              </div>
              <div className="bm-field bm-full">
                <label htmlFor="bmNotes">
                  Notes / special requests <span className="opt">(optional)</span>
                </label>
                <textarea id="bmNotes" rows="2" maxLength="500" placeholder="Child seat, extra driver, delivery location…" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
            <div className="bm-error" id="bmError" hidden={!error}>
              {error}
            </div>
            <button className="bm-next" id="bmNext" type="button" onClick={handleNext}>
              Continue →
            </button>
            <div className="bm-or">
              <span>or</span>
            </div>
            <button className="bm-wa-direct" id="bmWaDirect" type="button" onClick={() => window.open(site.waLink(skipWaText()), '_blank')}>
              <span className="wa-badge">
                <WaIcon />
              </span>{' '}
              Skip the form — book on WhatsApp
            </button>
          </div>
          <div className="bm-pane" data-pane="2" hidden={pane !== 2}>
            <h3>Review your booking</h3>
            <dl className="bm-review" id="bmReview">
              {reviewRows().map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="bm-actions">
              <button className="bm-back" id="bmBack" type="button" onClick={() => setPane(1)}>
                ← Back
              </button>
              <button className="bm-confirm" id="bmConfirm" type="button" onClick={handleConfirm} disabled={sending}>
                {sending ? 'Sending…' : 'Confirm Booking'}
              </button>
            </div>
          </div>
          <div className="bm-pane" data-pane="3" hidden={pane !== 3}>
            <div className="bm-success">
              <div className="bm-check">✓</div>
              <h3>Booking received!</h3>
              <p>Your booking reference is</p>
              <div className="bm-ref" id="bmRef">
                {ref || '—'}
              </div>
              <p className="muted">Our team will contact you shortly on WhatsApp to confirm.</p>
              <div className="bm-actions bm-centered">
                <button className="bm-wa" id="bmWhatsApp" type="button" onClick={() => window.open(site.waLink(confirmWaText()), '_blank')}>
                  <span className="wa-badge">
                    <WaIcon />
                  </span>{' '}
                  Confirm on WhatsApp
                </button>
                <button className="bm-done" data-bm-close type="button" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
