import { useEffect, useState } from 'react';
import Link from 'next/link';
import Seo from '../components/Seo';
import Faq from '../components/Faq';
import { WaIcon } from '../components/Layout';
import { pageMeta } from '../lib/page-meta';
import { useSite } from '../lib/site-context';

// Native RTL Arabic landing page — same content as static ar.html.
// The language switcher here is a link back to the English homepage
// (not the i18n toggle), exactly as in the static page.
export async function getServerSideProps() {
  // Dynamic import: lib/site-data pulls in mysql2 (Node-only), so it must
  // never be a top-level import of a page, or the browser build breaks.
  const { getSiteData } = await import('../lib/site-data');
  const site = await getSiteData();
  return { props: { site } };
}
const AR_FAQS = [
  {
    q: 'هل يمكنني استئجار سيارة في دبي بدون وديعة؟',
    a: 'نعم. نوفر خيارات بدون وديعة على سيارات اقتصادية وSUV مختارة، بعد تحقق سريع من المستندات.',
  },
  {
    q: 'ما هي المستندات المطلوبة؟',
    a: 'للسياح: جواز السفر، تأشيرة الزيارة، رخصة القيادة من بلدك، ورخصة قيادة دولية. للمقيمين: رخصة قيادة إماراتية وبطاقة الهوية الإماراتية.',
  },
  {
    q: 'هل التأمين مشمول؟',
    a: 'نعم، التأمين الأساسي مشمول في كل إيجار. ويمكن ترقية التغطية الكاملة عند الطلب.',
  },
  {
    q: 'هل توصلون السيارة؟',
    a: 'نعم — توصيل مجاني في أي مكان في دبي، بما في ذلك الفنادق والمنازل ومطار دبي الدولي.',
  },
  {
    q: 'ما هو الحد الأدنى للعمر؟',
    a: '21 سنة للسيارات الاقتصادية، و25 سنة للسيارات الفاخرة.',
  },
];

const AR_CAR_META = [
  {
    badge: 'الأكثر طلباً',
    alt: 'تويوتا كامري 2024 تأجير دبي',
    perks: ['✓ بدون وديعة', '✓ تأمين مجاني', '✓ 250 كم/يوم', '✓ دعم 24/7'],
    wa: 'مرحباً، أريد استئجار تويوتا كامري 2024.',
  },
  {
    badge: 'الأفضل',
    alt: 'هيونداي توسان 2024 تأجير دبي',
    perks: ['✓ بدون وديعة', '✓ تأمين مجاني', '✓ 250 كم/يوم', '✓ دعم 24/7'],
    wa: 'مرحباً، أريد استئجار هيونداي توسان 2024.',
  },
  {
    badge: 'فاخرة',
    alt: 'مرسيدس E-Class 2024 تأجير دبي',
    perks: ['✓ تأمين مجاني', '✓ 250 كم/يوم', '✓ دعم 24/7', '✓ توصيل مجاني'],
    wa: 'مرحباً، أريد استئجار مرسيدس E-Class 2024.',
  },
];

const AR_NAV = [
  { href: '/ar/', label: 'الرئيسية', key: 'ar' },
  { href: '/#fleet', label: 'الأسطول', key: 'fleet' },
  { href: '/taxi/', label: 'تاكسي', key: 'taxi' },
  { href: '/compare/', label: 'مقارنة', key: 'compare' },
  { href: '/monthly-rental/', label: 'الإيجار الشهري', key: 'monthly' },
  { href: '/no-deposit/', label: 'بدون وديعة', key: 'nodeposit' },
  { href: '/hotels/', label: 'الفنادق', key: 'hotels' },
  { href: '/locations/', label: 'المواقع', key: 'locations' },
  { href: '/blog/', label: 'المدونة', key: 'blog' },
  { href: '/contact/', label: 'اتصل بنا', key: 'contact' },
];

export default function Ar({ site }) {
  const live = useSite();
  const page = site.pages['ar'] || {};
  const cars = site.cars;
  const arCars = cars.slice(0, 3).map((car, i) => ({ car, ...(AR_CAR_META[i] || AR_CAR_META[0]) }));
  const [navOpen, setNavOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  // This page is natively Arabic: force lang/dir, restore on unmount.
  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      let l = 'en';
      try {
        l = localStorage.getItem('urc-lang') || 'en';
      } catch (e) {}
      document.documentElement.lang = l === 'ar' ? 'ar' : 'en';
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    };
  }, []);

  const closeNav = () => setNavOpen(false);

  return (
    <>
      <Seo meta={pageMeta('ar', page, site.settings)} />

      <div className="topbar">
        <div className="container topbar-inner">
          <a className="topbar-phone" href={live.telLink}>
            📞 <span>اتصل:</span> <span dir="ltr">{live.phoneDisplay}</span>
          </a>
          <div className="topbar-right">
            <span className="topbar-support">🕘 دعم 24/7</span>
            <Link className="lang-switch" href="/" style={{ textDecoration: 'none' }}>
              English
            </Link>
          </div>
        </div>
      </div>

      <header className="site-header" id="siteHeader">
        <div className="container header-inner">
          <Link className="logo" href="/ar/" aria-label="UAE Rental Car — تأجير سيارات دبي">
            <img className="logo-lockup" src="/images/logo.png?v=5" alt="UAE Rental Car — تأجير سيارات دبي" width="800" height="221" />
          </Link>
          <nav className={'main-nav' + (navOpen ? ' open' : '')} id="mainNav" aria-label="التنقل الرئيسي">
            {AR_NAV.map((item) => (
              <Link key={item.key} href={item.href} className={item.key === 'ar' ? 'active' : ''} onClick={closeNav}>
                {item.label}
              </Link>
            ))}
            <a
              className="btn btn-whatsapp nav-cta"
              href={live.waLink('مرحباً UAE Rental Car، أريد استئجار سيارة.')}
              target="_blank"
              rel="noopener"
              onClick={closeNav}
            >
              واتساب
            </a>
          </nav>
          <button
            className={'hamburger' + (navOpen ? ' open' : '')}
            id="hamburger"
            aria-label="فتح القائمة"
            aria-expanded={navOpen}
            aria-controls="mainNav"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      {navOpen && <div className="nav-overlay show" onClick={closeNav}></div>}

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>{page.h1 || 'تأجير سيارات في دبي'}</h1>
            <p className="hero-sub">{page.hero_subtitle || 'بدون وديعة • توصيل مجاني • دعم 24/7'}</p>
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
          <div className="container narrow">
            <h2 style={{ textAlign: 'center' }}>استأجر سيارة في دبي ابتداءً من 79 درهم في اليوم</h2>
            <p style={{ textAlign: 'center' }} className="muted">
              سيارات اقتصادية وSUV وفاخرة بأفضل الأسعار في دبي. بدون وديعة على سيارات مختارة، تأمين مجاني،
              وتوصيل مجاني إلى فندقك أو منزلك أو مطار دبي. السعر الذي تراه هو السعر الذي تدفعه — بدون رسوم
              خفية.
            </p>
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <a
                className="btn btn-whatsapp"
                style={{ width: 'auto', display: 'inline-block' }}
                href={live.waLink('مرحباً UAE Rental Car، أريد استئجار سيارة في دبي.')}
                target="_blank"
                rel="noopener"
              >
                📲 احجز عبر واتساب
              </a>
            </div>
          </div>
        </section>

        <section className="section section-alt fleet">
          <div className="container">
            <h2>سياراتنا المميزة</h2>
            <p className="section-sub">
              أسعار يومية وأسبوعية وشهرية شفافة — بدون رسوم خفية.{' '}
              <Link href="/compare/" style={{ color: '#0b5c43', fontWeight: 700 }}>
                قارن بين السيارات واحسب التكلفة ←
              </Link>
            </p>
            <div className="car-grid">
              {arCars.map(({ car, badge, alt, perks, wa }) => (
                <article key={car.id} className="car-card">
                  <span className="badge badge-gold">{badge}</span>
                  <img src={car.img} alt={alt} loading="lazy" width="640" height="400" />
                  <h3>{car.id === 'eclass' ? 'Mercedes-Benz E-Class 2024' : car.name}</h3>
                  <div className="price-row">
                    <div>
                      <small>يومي</small>
                      <strong>AED {car.daily}</strong>
                    </div>
                    <div>
                      <small>أسبوعي</small>
                      <strong>AED {car.weekly}</strong>
                    </div>
                    <div>
                      <small>شهري</small>
                      <strong>AED {car.monthly.toLocaleString('en-US')}</strong>
                    </div>
                  </div>
                  <ul className="car-perks">
                    {perks.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <div className="car-actions">
                    <a className="btn btn-whatsapp" href={live.waLink(wa)} target="_blank" rel="noopener">
                      واتساب
                    </a>
                    <a className="btn btn-outline" href={live.telLink}>
                      اتصل
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section steps">
          <div className="container">
            <h2>كيف تستأجر سيارة؟</h2>
            <div className="steps-grid">
              <div className="step">
                <span className="step-num">1</span>
                <h3>اختر سيارتك</h3>
                <p>تصفح الأسطول واختر السيارة المناسبة لاحتياجك وميزانيتك.</p>
              </div>
              <div className="step">
                <span className="step-num">2</span>
                <h3>المستندات والدفع</h3>
                <p>أرسل مستنداتك عبر واتساب وادفع سعر الإيجار فقط — بدون وديعة على سيارات مختارة.</p>
              </div>
              <div className="step">
                <span className="step-num">3</span>
                <h3>استلم السيارة وقد</h3>
                <p>نوصل السيارة إليك مجاناً، نظيفة وجاهزة. قد في أي مكان في الإمارات.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2>الأسئلة الشائعة</h2>
            <Faq items={AR_FAQS} />
          </div>
        </section>

        <section className="cta-band">
          <div className="container">
            <h2>احجز سيارتك الآن</h2>
            <p>راسلنا عبر واتساب — أخبرنا بتواريخك وسنؤكد سيارتك خلال دقائق.</p>
            <a
              className="btn btn-whatsapp"
              style={{ width: 'auto', display: 'inline-block' }}
              href={live.waLink('مرحباً UAE Rental Car، أريد استئجار سيارة في دبي.')}
              target="_blank"
              rel="noopener"
            >
              📲 واتساب الآن
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src="/images/logo.svg" alt="UAE Rental Car" width="140" height="46" />
            <p>تأجير سيارات فاخر في دبي والإمارات. خيارات بدون وديعة، توصيل مجاني، دعم 24/7.</p>
          </div>
          <nav className="footer-links" aria-label="التذييل">
            <strong>روابط سريعة</strong>
            <Link href="/ar/">الرئيسية</Link>
            <Link href="/#fleet">الأسطول</Link>
            <Link href="/monthly-rental/">الإيجار الشهري</Link>
            <Link href="/no-deposit/">بدون وديعة</Link>
            <Link href="/blog/">المدونة</Link>
            <Link href="/locations/">المواقع</Link>
            <Link href="/contact/">اتصل بنا</Link>
          </nav>
          <div className="footer-contact">
            <strong>اتصل بنا</strong>
            <p>📍 دبي، الإمارات</p>
            <p>
              📞 <a href={live.telLink}>{live.phoneDisplay}</a>
            </p>
            <p>
              ✉️ <a href={live.mailLink}>{live.email}</a>
            </p>
            <p>🕘 دعم 24/7</p>
          </div>
          <div className="footer-pay">
            <strong>نقبل</strong>
            <div className="pay-badges">
              <span>VISA</span>
              <span>Mastercard</span>
              <span>AMEX</span>
              <span>نقداً</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            © <span id="year">2026</span> UAE Rental Car. جميع الحقوق محفوظة. |{' '}
            <Link href="/privacy/">سياسة الخصوصية</Link> | <Link href="/terms/">الشروط والأحكام</Link>
          </div>
        </div>
      </footer>

      <a
        className="wa-float"
        href={live.waLink('مرحباً UAE Rental Car، أريد استئجار سيارة.')}
        target="_blank"
        rel="noopener"
        aria-label="محادثة واتساب"
      >
        <WaIcon white />
      </a>
      <button
        className="to-top"
        id="toTop"
        aria-label="العودة للأعلى"
        style={{ display: showTop ? 'block' : 'none' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </>
  );
}
