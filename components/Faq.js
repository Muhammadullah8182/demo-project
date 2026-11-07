import { useState, useRef } from 'react';

// FAQ accordion — single-open, like the static site (main.js).
// The answer's max-height is set to its scrollHeight so the CSS transition runs.
export default function Faq({ items }) {
  const [openIdx, setOpenIdx] = useState(null);
  const answerRefs = useRef([]);

  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={i} className={'faq-item' + (openIdx === i ? ' open' : '')}>
          <button
            className="faq-q"
            aria-expanded={openIdx === i}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            {item.q}
            <span className="faq-icon">+</span>
          </button>
          <div
            className="faq-a"
            ref={(el) => (answerRefs.current[i] = el)}
            style={
              openIdx === i && answerRefs.current[i]
                ? { maxHeight: answerRefs.current[i].scrollHeight + 'px' }
                : undefined
            }
          >
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
