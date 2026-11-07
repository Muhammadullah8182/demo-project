import { useEffect, useRef, useState } from 'react';

// Travellers stepper dropdown — same behaviour as static v11:
// Adults min 1, Children min 0, Rooms min 1, all max 9.
// Taxi summary: "1 Adult" / "2 Adults, 1 Child".
// Hotel summary: "2 Persons, 1 Room".
export function taxiSummary(adults, children) {
  let s = adults + (adults === 1 ? ' Adult' : ' Adults');
  if (children > 0) s += ', ' + children + (children === 1 ? ' Child' : ' Children');
  return s;
}
export function hotelSummary(adults, children, rooms) {
  const persons = adults + children;
  return persons + (persons === 1 ? ' Person' : ' Persons') + ', ' + rooms + (rooms === 1 ? ' Room' : ' Rooms');
}

export default function Travellers({ kind, adults, children, rooms, onChange, id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const step = (field, delta) => {
    const min = field === 'children' ? 0 : 1;
    const cur = field === 'adults' ? adults : field === 'children' ? children : rooms;
    const next = Math.max(min, Math.min(9, cur + delta));
    onChange({ adults, children, rooms, [field]: next });
  };

  const summary = kind === 'hotel' ? hotelSummary(adults, children, rooms) : taxiSummary(adults, children);

  const row = (label, sub, field, value) => (
    <div className="trav-row" key={field}>
      <span>
        {label} {sub}
      </span>
      <span className="stepper">
        <button
          type="button"
          className="step-btn"
          data-kind={field}
          data-step="-1"
          aria-label={'Fewer ' + label}
          onClick={() => step(field, -1)}
        >
          −
        </button>
        <span className="step-val" data-kind={field}>
          {value}
        </span>
        <button
          type="button"
          className="step-btn"
          data-kind={field}
          data-step="1"
          aria-label={'More ' + label}
          onClick={() => step(field, 1)}
        >
          +
        </button>
      </span>
    </div>
  );

  return (
    <div className="trav-dropdown" ref={ref} id={id} data-hotel-trav={kind === 'hotel' ? '' : undefined}>
      <button
        type="button"
        className="trav-btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {summary}
      </button>
      <div className="trav-panel" hidden={!open}>
        {row('Adults', null, 'adults', adults)}
        {row('Children', <small>(0–11)</small>, 'children', children)}
        {kind === 'hotel' && row('Rooms', null, 'rooms', rooms)}
        <button type="button" className="trav-done" onClick={() => setOpen(false)}>
          Done
        </button>
      </div>
    </div>
  );
}
