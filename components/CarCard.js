import { fmtAed } from '../data/site';
import { useSite } from '../lib/site-context';

// Featured car card — same markup, prices and perks as static v11.
// Optional overrides: perks (list items), waText (WhatsApp message).
export default function CarCard({ car, badge, perks, waText }) {
  const site = useSite();
  const displayName = car.id === 'eclass' ? 'Mercedes-Benz E-Class 2024' : car.name;
  const perkItems = perks || ['✓ Zero Hidden Charges', '✓ Free Insurance', '✓ 250 km/day included', '✓ 24/7 Support'];
  return (
    <article className="car-card">
      <span className="badge badge-gold">{badge}</span>
      <img
        src={car.img}
        alt={car.alt}
        loading="lazy"
        width="640"
        height="400"
      />
      <h3>{displayName}</h3>
      <div className="price-row">
        <div>
          <small>Daily</small>
          <strong>{fmtAed(car.daily)}</strong>
        </div>
        <div>
          <small>Weekly</small>
          <strong>{fmtAed(car.weekly)}</strong>
        </div>
        <div>
          <small>Monthly</small>
          <strong>{fmtAed(car.monthly)}</strong>
        </div>
      </div>
      <ul className="car-perks">
        {perkItems.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div className="car-actions">
        <a
          className="btn btn-whatsapp"
          href={site.waLink(waText || `Hi, I want to rent the ${car.name}.`)}
          target="_blank"
          rel="noopener"
        >
          WhatsApp
        </a>
        <a className="btn btn-outline" href={site.telLink}>
          Call
        </a>
      </div>
    </article>
  );
}
