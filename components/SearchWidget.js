import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSite } from '../lib/site-context';
import { WaIcon } from './Layout';
import Travellers, { taxiSummary, hotelSummary } from './Travellers';

// Hero search widget — same markup, defaults and behaviour as static v11.
// Tabs: Self Drive / Taxi / Hotels. Submit opens the booking modal (self-drive
// or taxi) or WhatsApp (hotels). WhatsApp buttons pre-fill the current values.
const DXB_PLACES = [
  'Dubai International Airport (DXB)',
  'Dubai Marina',
  'Downtown Dubai / Burj Khalifa',
  'JBR / Jumeirah Beach',
  'Palm Jumeirah',
  'Deira',
  'Business Bay',
  'Abu Dhabi',
  'Sharjah',
];
const HOTEL_PLACES = [
  'Dubai Marina',
  'Downtown Dubai / Burj Khalifa',
  'Palm Jumeirah',
  'JBR / Jumeirah Beach',
  'Deira',
  'Business Bay',
  'Atlantis The Palm',
  'Burj Al Arab Jumeirah',
  'Armani Hotel Dubai',
  'Abu Dhabi',
  'Sharjah',
];

const iso = (d) => d.toISOString().split('T')[0];
const today = () => new Date();
const plusDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

export default function SearchWidget({ onBook }) {
  const site = useSite();
  const [tab, setTab] = useState('selfdrive');
  const [trip, setTrip] = useState('oneway');

  // Self-drive
  const [location, setLocation] = useState('Dubai International Airport (DXB)');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Taxi — out leg
  const [tPickup, setTPickup] = useState('');
  const [tDropoff, setTDropoff] = useState('');
  const [tDate, setTDate] = useState('');
  const [tTime, setTTime] = useState('');
  const [tTrav, setTTrav] = useState({ adults: 1, children: 0, rooms: 1 });
  // Taxi — return leg
  const [rPickup, setRPickup] = useState('');
  const [rDropoff, setRDropoff] = useState('');
  const [rDate, setRDate] = useState('');
  const [rTime, setRTime] = useState('');
  const [rTrav, setRTrav] = useState({ adults: 1, children: 0, rooms: 1 });

  // Hotels
  const [wWhere, setWWhere] = useState('');
  const [wCheckin, setWCheckin] = useState('');
  const [wCheckout, setWCheckout] = useState('');
  const [hTrav, setHTrav] = useState({ adults: 2, children: 0, rooms: 1 });
  const whereRef = useRef(null);

  // Date defaults (same as static main.js: pickup today, return +3, taxi return +1)
  useEffect(() => {
    setPickupDate(iso(today()));
    setReturnDate(iso(plusDays(3)));
    setTDate(iso(today()));
    setRDate(iso(plusDays(1)));
    setWCheckin(iso(today()));
    setWCheckout(iso(plusDays(3)));
  }, []);

  const minToday = iso(today());

  const taxiDetails = () => {
    const d = {
      trip: trip === 'roundtrip' ? 'Round Trip' : 'One Way',
      pickup: tPickup,
      dropoff: tDropoff,
      date: tDate,
      time: tTime,
      travellers: taxiSummary(tTrav.adults, tTrav.children),
    };
    if (trip === 'roundtrip') {
      d.return_pickup = rPickup;
      d.return_dropoff = rDropoff;
      d.return_date = rDate;
      d.return_time = rTime;
      d.return_travellers = taxiSummary(rTrav.adults, rTrav.children);
    }
    return d;
  };

  const taxiWaText = (details, vehicle) => {
    const n = ['Hi UAE Rental Car, I want to book.'];
    n.push('Service: Taxi (' + details.trip + ')');
    n.push('Pick-up: ' + details.pickup);
    n.push('Drop-off: ' + details.dropoff);
    n.push('Date: ' + details.date + (details.time ? ' at ' + details.time : ''));
    if (details.return_date) {
      n.push('Return: ' + details.return_date + (details.return_time ? ' at ' + details.return_time : ''));
    }
    n.push('Travellers: ' + details.travellers);
    if (vehicle) n.push('Vehicle: ' + vehicle);
    return n.join('\n');
  };

  const hotelWa = (requireDest) => {
    if (requireDest && !wWhere.trim()) {
      if (whereRef.current) whereRef.current.focus();
      return;
    }
    const msg = [
      'Hi UAE Rental Car, I want to book a hotel.',
      'Where: ' + wWhere,
      'Check-in: ' + wCheckin,
      'Check-out: ' + wCheckout,
      'Guests: ' + hotelSummary(hTrav.adults, hTrav.children, hTrav.rooms),
    ].join('\n');
    window.open(site.waLink(msg), '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'hotels') {
      hotelWa(true);
      return;
    }
    if (tab === 'taxi') {
      onBook('taxi', taxiDetails());
    } else {
      onBook('selfdrive', { location, from: pickupDate, to: returnDate });
    }
  };

  const swap = (leg) => {
    if (leg === 'out') {
      setTPickup(tDropoff);
      setTDropoff(tPickup);
    } else {
      setRPickup(rDropoff);
      setRDropoff(rPickup);
    }
  };

  const legFields = (leg, pickup, setPickup, dropoff, setDropoff, date, setDate, time, setTime, trav, setTrav) => (
    <div className="field-grid transfer-grid">
      <div className="route-pair">
        <div className="route-field">
          <label htmlFor={leg === 'out' ? 'tPickup' : 'rPickup'}>Pick-up Point</label>
          <input
            type="text"
            id={leg === 'out' ? 'tPickup' : 'rPickup'}
            list="dxb-places"
            placeholder="Enter Destination"
            autoComplete="off"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
        </div>
        <button type="button" className="swap-btn" aria-label="Swap pick-up and drop-off points" title="Swap" onClick={() => swap(leg)}>
          ⇄
        </button>
        <div className="route-field">
          <label htmlFor={leg === 'out' ? 'tDropoff' : 'rDropoff'}>Drop-off Point</label>
          <input
            type="text"
            id={leg === 'out' ? 'tDropoff' : 'rDropoff'}
            list="dxb-places"
            placeholder="Enter Destination"
            autoComplete="off"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          />
        </div>
      </div>
      <div className="field t-col">
        <label htmlFor={leg === 'out' ? 'tDate' : 'rDate'}>{leg === 'out' ? 'Pick-up Date' : 'Return Date'}</label>
        <input type="date" id={leg === 'out' ? 'tDate' : 'rDate'} min={minToday} value={date} onChange={(e) => setDate(e.target.value)} />
        <small className="field-hint">Enter your exact flight date and time</small>
      </div>
      <div className="field t-col">
        <label htmlFor={leg === 'out' ? 'tTime' : 'rTime'}>{leg === 'out' ? 'Pickup Time' : 'Return Time'}</label>
        <input type="time" id={leg === 'out' ? 'tTime' : 'rTime'} value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div className="field t-col">
        <label>Travellers</label>
        <Travellers kind="taxi" adults={trav.adults} children={trav.children} rooms={1} onChange={(v) => setTrav({ adults: v.adults, children: v.children, rooms: 1 })} />
      </div>
    </div>
  );

  return (
    <form className="search-widget" id="searchWidget" aria-label="Booking search" onSubmit={handleSubmit}>
      <div className="widget-tabs" role="tablist" aria-label="Booking type">
        <button type="button" className={'widget-tab' + (tab === 'selfdrive' ? ' active' : '')} data-tab="selfdrive" role="tab" aria-selected={tab === 'selfdrive'} onClick={() => setTab('selfdrive')}>
          🚗 Self Drive
        </button>
        <button type="button" className={'widget-tab' + (tab === 'taxi' ? ' active' : '')} data-tab="taxi" role="tab" aria-selected={tab === 'taxi'} onClick={() => setTab('taxi')}>
          🚕 Taxi
        </button>
        <button type="button" className={'widget-tab' + (tab === 'hotels' ? ' active' : '')} data-tab="hotels" role="tab" aria-selected={tab === 'hotels'} onClick={() => setTab('hotels')}>
          🏨 Hotels
        </button>
      </div>

      {/* ---- Self Drive ---- */}
      <div className="widget-panel active" id="panel-selfdrive" role="tabpanel" hidden={tab !== 'selfdrive'}>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="pickupLocation">Pick-up Location</label>
            <select id="pickupLocation" name="pickupLocation" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option>Dubai International Airport (DXB)</option>
              <option>Dubai Marina</option>
              <option>Downtown Dubai</option>
              <option>Deira</option>
              <option>JBR</option>
              <option>Business Bay</option>
              <option>Abu Dhabi</option>
              <option>Sharjah</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="pickupDate">Pick-up Date</label>
            <input type="date" id="pickupDate" name="pickupDate" required min={minToday} value={pickupDate} onChange={(e) => { setPickupDate(e.target.value); }} />
          </div>
          <div className="field">
            <label htmlFor="returnDate">Return Date</label>
            <input type="date" id="returnDate" name="returnDate" required min={pickupDate || minToday} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          </div>
          <button className="btn btn-search" type="submit">
            Search
          </button>
          <button
            className="btn btn-wa-form"
            type="button"
            id="selfdriveWaBtn"
            onClick={() =>
              window.open(
                site.waLink(
                  ['Hi UAE Rental Car, I want to rent a car.', 'Pick-up: ' + location, 'From: ' + pickupDate + '  To: ' + returnDate].join('\n')
                ),
                '_blank'
              )
            }
          >
            <span className="wa-badge">
              <WaIcon />
            </span>{' '}
            WhatsApp
          </button>
        </div>
      </div>

      {/* ---- Taxi ---- */}
      <div className="widget-panel panel-card" id="panel-taxi" role="tabpanel" hidden={tab !== 'taxi'}>
        <div className="trip-toggle" role="group" aria-label="Trip type">
          <button type="button" className={'toggle-pill' + (trip === 'oneway' ? ' active' : '')} data-trip="oneway" onClick={() => setTrip('oneway')}>
            One Way
          </button>
          <button type="button" className={'toggle-pill' + (trip === 'roundtrip' ? ' active' : '')} data-trip="roundtrip" onClick={() => setTrip('roundtrip')}>
            Round Trip
          </button>
        </div>
        <div className="transfer-leg" data-leg="out">
          {legFields('out', tPickup, setTPickup, tDropoff, setTDropoff, tDate, setTDate, tTime, setTTime, tTrav, setTTrav)}
        </div>
        <div className="transfer-leg return-leg" data-leg="ret" hidden={trip !== 'roundtrip'}>
          {legFields('ret', rPickup, setRPickup, rDropoff, setRDropoff, rDate, setRDate, rTime, setRTime, rTrav, setRTrav)}
        </div>
        <div className="taxi-cta-row">
          <button className="btn btn-search btn-transfer-search" type="submit">
            Find My Taxi →
          </button>
          <button className="btn btn-wa-form" type="button" id="taxiWaBtn" onClick={() => window.open(site.waLink(taxiWaText(taxiDetails(), '')), '_blank')}>
            <span className="wa-badge">
              <WaIcon />
            </span>{' '}
            WhatsApp
          </button>
        </div>
        <div className="taxi-badges">
          <span>✓ No booking fee</span>
          <span>✓ Pay by card or cash</span>
          <span>✓ Child seats on request</span>
        </div>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link href="/taxi/" style={{ color: '#0b5c43', fontWeight: 700 }}>
            Taxi fares, airport routes &amp; details →
          </Link>
        </p>
        <datalist id="dxb-places">
          {DXB_PLACES.map((p) => (
            <option key={p} value={p}></option>
          ))}
        </datalist>
      </div>

      {/* ---- Hotels ---- */}
      <div className="widget-panel panel-card" id="panel-hotels" role="tabpanel" hidden={tab !== 'hotels'}>
        <div className="field-grid hotel-grid">
          <div className="field h-wide">
            <label htmlFor="wWhere">Where To</label>
            <input
              type="text"
              id="wWhere"
              list="hotel-places"
              placeholder="Search for a city or hotel"
              autoComplete="off"
              ref={whereRef}
              value={wWhere}
              onChange={(e) => setWWhere(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="wCheckin">Check In</label>
            <input type="date" id="wCheckin" min={minToday} value={wCheckin} onChange={(e) => setWCheckin(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="wCheckout">Check Out</label>
            <input type="date" id="wCheckout" min={wCheckin || minToday} value={wCheckout} onChange={(e) => setWCheckout(e.target.value)} />
          </div>
          <div className="field">
            <label>Travellers</label>
            <Travellers kind="hotel" adults={hTrav.adults} children={hTrav.children} rooms={hTrav.rooms} onChange={(v) => setHTrav(v)} />
          </div>
        </div>
        <div className="taxi-cta-row">
          <button className="btn btn-search btn-transfer-search" type="button" id="hotelsSearchBtn" onClick={() => hotelWa(true)}>
            Search Hotels →
          </button>
          <button className="btn btn-wa-form" type="button" id="hotelsWaBtn" onClick={() => hotelWa(false)}>
            <span className="wa-badge">
              <WaIcon />
            </span>{' '}
            WhatsApp
          </button>
        </div>
        <datalist id="hotel-places">
          {HOTEL_PLACES.map((p) => (
            <option key={p} value={p}></option>
          ))}
        </datalist>
      </div>
    </form>
  );
}
