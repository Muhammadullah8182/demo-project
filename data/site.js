// UAE Rental Car — shared site data.
// SEO meta copied verbatim from static v11 (website/*.html / *.php).
// Prices, phone, email and branding are identical to the static site.

export const SITE_URL = 'https://uaerentcar.com';
export const WHATSAPP_NUMBER = '971555523231';
export const PHONE_DISPLAY = '+971 55 552 3231';
export const EMAIL = 'uaerenatalcar@gmail.com';
export const HERO_IMG = `${SITE_URL}/images/media-generation-hero-dubai-skyline-0-76e8fd38-4e21-4b75-bea0-2db00a426d6e.webp`;

export const waLink = (msg) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export const CARS = [
  {
    id: 'camry',
    name: 'Toyota Camry 2024',
    daily: 99,
    weekly: 599,
    monthly: 2200,
    seats: 5,
    bags: 3,
    trans: 'Automatic',
    fuel: 'Petrol',
    deposit: 'No deposit',
    best: 'Most popular',
    img: '/images/media-generation-car-toyota-camry-0-832835e8-29dd-4b35-890b-294729a52155.webp',
    alt: 'White Toyota Camry 2024 for rent in Dubai',
  },
  {
    id: 'tucson',
    name: 'Hyundai Tucson 2024',
    daily: 129,
    weekly: 799,
    monthly: 2900,
    seats: 5,
    bags: 3,
    trans: 'Automatic',
    fuel: 'Petrol',
    deposit: 'No deposit',
    best: 'Best SUV',
    img: '/images/media-generation-car-hyundai-tucson-0-35ab70b8-cc46-418c-afab-3bf122d707df.webp',
    alt: 'Black Hyundai Tucson 2024 SUV for rent in Dubai',
  },
  {
    id: 'eclass',
    name: 'Mercedes E-Class 2024',
    daily: 350,
    weekly: 2100,
    monthly: 7500,
    seats: 5,
    bags: 3,
    trans: 'Automatic',
    fuel: 'Petrol',
    deposit: 'AED 1,000–3,000',
    best: 'Luxury pick',
    img: '/images/media-generation-car-mercedes-eclass-0-b73519cd-9115-41ea-9ed8-5ef54fede8ab.webp',
    alt: 'White Mercedes-Benz E-Class 2024 luxury rental in Dubai',
  },
];

export const fmtAed = (n) => 'AED ' + n.toLocaleString('en-US');

// ---- SEO meta per page (verbatim from static v11) ----
export const SEO = {
  home: {
    title: 'Rent a Car Dubai from AED 79/day | No Deposit Car Rental | UAE Rental Car',
    description:
      'Rent a car in Dubai from AED 79/day with UAE Rental Car. No deposit options, free delivery, free insurance & 24/7 support. Daily, weekly & monthly rentals.',
    canonical: `${SITE_URL}/`,
    ogTitle: 'Rent a Car Dubai from AED 79/day | UAE Rental Car',
    ogDescription:
      'No deposit options, free delivery, free insurance & 24/7 support. Daily, weekly & monthly car rental in Dubai.',
    ogType: 'website',
    hreflang: [
      { lang: 'en', href: `${SITE_URL}/` },
      { lang: 'ar', href: `${SITE_URL}/ar/` },
      { lang: 'x-default', href: `${SITE_URL}/` },
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: 'UAE Rental Car',
        url: `${SITE_URL}/`,
        image: HERO_IMG,
        description:
          'Car rental in Dubai from AED 79/day. No deposit options, free delivery, free insurance and 24/7 support.',
        priceRange: 'AED 79 - AED 7500',
        telephone: '+971-55-552-3231',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        openingHours: 'Mo-Su 00:00-24:00',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '127',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Can I rent a car in Dubai without a deposit?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. UAE Rental Car offers no-deposit options on selected economy and SUV models, subject to document verification.',
            },
          },
          {
            '@type': 'Question',
            name: 'What documents do I need to rent a car in Dubai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tourists need a passport, visit visa, home-country driving licence and an International Driving Permit. UAE residents need a UAE driving licence and Emirates ID.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is insurance included in the rental price?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, basic insurance is included in every rental. Full coverage upgrades are available.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you deliver the car to my location?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, we offer free delivery anywhere in Dubai — hotels, residences and DXB airport.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the minimum age to rent a car in Dubai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The minimum age is 21 years for economy cars and 25 years for luxury vehicles.',
            },
          },
        ],
      },
    ],
  },
  hotels: {
    title: 'Book Hotels in Dubai | Best Hotel Deals | UAE Rental Car',
    description:
      'Book top-rated hotels in Dubai with UAE Rental Car. Handpicked hotels, honest prices, free cancellation options & 24/7 support. Search hotels now on WhatsApp!',
    canonical: `${SITE_URL}/hotels/`,
    ogTitle: 'Book Hotels in Dubai | UAE Rental Car',
    ogDescription:
      'Handpicked Dubai hotels at honest prices. Free cancellation options & 24/7 support.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        name: 'UAE Rental Car — Hotel Bookings',
        url: `${SITE_URL}/hotels/`,
        description: 'Handpicked hotel bookings across Dubai at honest prices.',
        telephone: '+971-55-552-3231',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        openingHours: 'Mo-Su 00:00-24:00',
      },
    ],
  },
  locations: {
    title: 'Car Rental Locations in Dubai & UAE | Free Delivery',
    description:
      'Rent a car anywhere in Dubai & the UAE with free delivery to your doorstep. Airport pickup at DXB, daily, weekly & monthly rentals. WhatsApp us 24/7!',
    canonical: `${SITE_URL}/locations/`,
    ogTitle: 'Car Rental Locations in Dubai & UAE | UAE Rental Car',
    ogDescription:
      'Free car delivery anywhere in Dubai & the Emirates. Airport pickup, daily, weekly & monthly rentals.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: 'UAE Rental Car',
        url: `${SITE_URL}/locations/`,
        description:
          'Car rental with free delivery across Dubai and the UAE. Airport pickup, daily, weekly and monthly rentals.',
        telephone: '+971-55-552-3231',
        priceRange: 'AED 79 - AED 7500',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        areaServed: [
          'Dubai',
          'Abu Dhabi',
          'Sharjah',
          'Ajman',
          'Ras Al Khaimah',
          'Fujairah',
          'Umm Al Quwain',
        ],
        openingHours: 'Mo-Su 00:00-24:00',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Do you deliver the car to my hotel?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — free delivery to any hotel, home or office in Dubai and across all emirates.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I pick up at DXB airport?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We meet you at arrivals with the car ready, paperwork done in minutes.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I return the car in a different city?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, with our one-way rental option, e.g. pick up in Dubai and drop off in Abu Dhabi or Sharjah.',
            },
          },
          {
            '@type': 'Question',
            name: 'What documents do tourists need?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Passport with visit visa, home-country driving license, and an International Driving Permit for most nationalities.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the minimum age to rent?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '21 years with a valid license.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do Salik tolls work on rentals?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Toll crossings are tracked per car and added to your final bill at cost, with a full statement.',
            },
          },
        ],
      },
    ],
  },
  contact: {
    title: 'Contact Us | UAE Rental Car Dubai — 24/7 Support',
    description:
      'Contact UAE Rental Car Dubai 24/7 — call or WhatsApp +971 55 552 3231, email uaerenatalcar@gmail.com. Free car delivery across Dubai & the UAE.',
    canonical: `${SITE_URL}/contact/`,
    ogTitle: 'Contact Us | UAE Rental Car Dubai',
    ogDescription:
      'Call or WhatsApp +971 55 552 3231 — 24/7 support, free car delivery across the UAE.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact UAE Rental Car',
        url: `${SITE_URL}/contact/`,
        about: {
          '@type': 'AutoRental',
          name: 'UAE Rental Car',
          telephone: '+971-55-552-3231',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dubai',
            addressCountry: 'AE',
          },
          openingHours: 'Mo-Su 00:00-24:00',
        },
      },
    ],
  },
  taxi: {
    title: 'Taxi Service Dubai | Book a Taxi 24/7 | UAE Rental Car',
    description:
      'Book a taxi in Dubai on WhatsApp — 24/7 airport transfers from DXB & DWC, city rides and Dubai to Abu Dhabi. Sedan, SUV & van. No booking fee, pay by card.',
    canonical: `${SITE_URL}/taxi/`,
    ogTitle: 'Taxi Service Dubai | Book a Taxi 24/7 | UAE Rental Car',
    ogDescription:
      'Dubai taxi on WhatsApp — airport transfers, city rides and intercity trips. No app, no booking fee, pay by card or cash.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Taxi',
        name: 'UAE Rental Car — Taxi Service Dubai',
        url: `${SITE_URL}/taxi/`,
        description:
          'Book a taxi in Dubai on WhatsApp, 24/7. Airport transfers from DXB and DWC, city rides and Dubai to Abu Dhabi trips. Sedan, SUV and van. No booking fee, pay by card or cash.',
        telephone: '+971-55-552-3231',
        priceRange: 'AED',
        areaServed: { '@type': 'City', name: 'Dubai' },
        openingHours: 'Mo-Su 00:00-24:00',
        provider: {
          '@type': 'LocalBusiness',
          name: 'UAE Rental Car',
          telephone: '+971-55-552-3231',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dubai',
            addressCountry: 'AE',
          },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I book a taxi in Dubai with UAE Rental Car?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Message us on WhatsApp any time — we are available 24/7, there is no booking fee, and you can pay by card or cash. Tell us your pick-up point, drop-off point, date and time, and we confirm your car and driver.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does a taxi cost in Dubai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our taxis run on the meter: the flag fall is AED 5.00 in the day (6am–10pm) and AED 5.50 at night (10pm–6am), with a minimum fare of AED 12. The per-km rate is set by the RTA — check the meter. We charge no booking fee, while app bookings add AED 4.00–7.50 in fees with a AED 13 minimum fare.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much is a taxi from Dubai Airport (DXB) to Downtown Dubai or Dubai Marina?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'From DXB the meter starts at AED 20 for a car or AED 25 for a van, then AED 2.62 per km. As a guide, DXB to Downtown Dubai is roughly AED 45–80 and DXB to Dubai Marina roughly AED 60–70, plus any Salik tolls — the exact fare is whatever the meter shows.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much is a taxi from Dubai to Abu Dhabi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A metered taxi from Dubai to Abu Dhabi is typically around AED 250–350 one way for the roughly 140 km, 75–90-minute trip. We do one-way and round-trip bookings in a sedan, SUV or van.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I pay by card or cash?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — both card and cash are accepted, with no booking fee.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you provide child seats?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — child seats are available on request when you book. Just mention it in your WhatsApp message.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I book a taxi in advance, and do you operate at night?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — we operate 24/7, including advance bookings on WhatsApp. For airport pickups, share your flight number and terminal (DXB T1, T2 or T3, or DWC) and the driver will meet you at arrivals.',
            },
          },
        ],
      },
    ],
  },
  compare: {
    title: 'Compare Car Rental Prices in Dubai | Cost Calculator',
    description:
      'Compare rental cars in Dubai side by side and calculate your exact trip cost with weekly & monthly discounts. No hidden charges — book on WhatsApp 24/7!',
    canonical: `${SITE_URL}/compare/`,
    ogTitle: 'Compare Car Rental Prices in Dubai | UAE Rental Car',
    ogDescription:
      'Compare cars side by side and calculate your exact rental cost. Weekly & monthly discounts, no hidden charges.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: 'UAE Rental Car',
        url: `${SITE_URL}/compare/`,
        description:
          'Compare rental cars in Dubai side by side and calculate your exact trip cost with weekly and monthly discounts.',
        telephone: '+971-55-552-3231',
        priceRange: 'AED 79 - AED 7500',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        openingHours: 'Mo-Su 00:00-24:00',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How does the rental cost calculator work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pick a car and the number of days. The calculator applies weekly and monthly rates automatically, so longer rentals cost less per day. The total shown is your exact rental price.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I compare more than 3 cars?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The table compares up to 3 cars at a time. Tick any 3 cars above to compare them — or ask us on WhatsApp and we will compare more models for you.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are the prices shown final?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — the price you see is the price you pay. Insurance is included and Salik tolls are billed at cost only, with a full statement.',
            },
          },
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy | UAE Rental Car Dubai',
    description:
      'How UAE Rental Car Dubai collects, uses and protects your information — bookings, WhatsApp messages and rental documents. Contact +971 55 552 3231.',
    canonical: `${SITE_URL}/privacy/`,
    ogTitle: 'Privacy Policy | UAE Rental Car Dubai',
    ogDescription:
      'How we collect, use and protect your information when you book a car with us.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy Policy',
        url: `${SITE_URL}/privacy/`,
        about: {
          '@type': 'AutoRental',
          name: 'UAE Rental Car',
          telephone: '+971-55-552-3231',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dubai',
            addressCountry: 'AE',
          },
          openingHours: 'Mo-Su 00:00-24:00',
        },
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions | UAE Rental Car Dubai',
    description:
      'Rental terms for UAE Rental Car Dubai — bookings, deposits, mileage, insurance, tolls and cancellations. Questions? WhatsApp +971 55 552 3231, 24/7.',
    canonical: `${SITE_URL}/terms/`,
    ogTitle: 'Terms & Conditions | UAE Rental Car Dubai',
    ogDescription:
      'The rental terms for booking a car with UAE Rental Car — simple, fair and in plain words.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Terms & Conditions',
        url: `${SITE_URL}/terms/`,
        about: {
          '@type': 'AutoRental',
          name: 'UAE Rental Car',
          telephone: '+971-55-552-3231',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dubai',
            addressCountry: 'AE',
          },
          openingHours: 'Mo-Su 00:00-24:00',
        },
      },
    ],
  },
  ar: {
    title: 'تأجير سيارات دبي من 79 درهم | بدون وديعة | UAE Rental Car',
    description:
      'استأجر سيارة في دبي بدون وديعة. توصيل مجاني، تأمين مجاني، ودعم 24/7. سيارات اقتصادية وSUV وفاخرة. أسعار تبدأ من 79 درهم في اليوم. احجز عبر واتساب الآن!',
    canonical: `${SITE_URL}/ar/`,
    ogTitle: 'تأجير سيارات دبي | UAE Rental Car',
    ogDescription:
      'تأجير سيارات في دبي بدون وديعة. توصيل مجاني، تأمين مجاني، ودعم 24/7.',
    ogType: 'website',
    ogLocale: 'ar_AE',
    hreflang: [
      { lang: 'ar', href: `${SITE_URL}/ar/` },
      { lang: 'en', href: `${SITE_URL}/` },
      { lang: 'x-default', href: `${SITE_URL}/` },
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: 'UAE Rental Car',
        url: `${SITE_URL}/ar/`,
        description:
          'تأجير سيارات في دبي بدون وديعة. توصيل مجاني، تأمين مجاني، ودعم 24/7.',
        telephone: '+971-55-552-3231',
        priceRange: 'AED 79 - AED 7500',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        openingHours: 'Mo-Su 00:00-24:00',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'هل يمكنني استئجار سيارة في دبي بدون وديعة؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'نعم. نوفر خيارات بدون وديعة على سيارات اقتصادية وSUV مختارة، بعد تحقق سريع من المستندات.',
            },
          },
          {
            '@type': 'Question',
            name: 'ما هي المستندات المطلوبة؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'للسياح: جواز السفر، تأشيرة الزيارة، رخصة القيادة من بلدك، ورخصة قيادة دولية. للمقيمين: رخصة قيادة إماراتية وبطاقة الهوية الإماراتية.',
            },
          },
          {
            '@type': 'Question',
            name: 'هل التأمين مشمول؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'نعم، التأمين الأساسي مشمول في كل إيجار. ويمكن ترقية التغطية الكاملة عند الطلب.',
            },
          },
          {
            '@type': 'Question',
            name: 'هل توصلون السيارة؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'نعم — توصيل مجاني في أي مكان في دبي، بما في ذلك الفنادق والمنازل ومطار دبي الدولي.',
            },
          },
          {
            '@type': 'Question',
            name: 'ما هو الحد الأدنى للعمر؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '21 سنة للسيارات الاقتصادية، و25 سنة للسيارات الفاخرة.',
            },
          },
        ],
      },
    ],
  },
  monthly: {
    title: 'Monthly Car Rental Dubai from AED 1,199 | Long-Term Deals',
    description:
      'Monthly car rental in Dubai from AED 1,199/month. One fixed price, free delivery, maintenance included & free replacement car. Book on WhatsApp 24/7 today!',
    canonical: `${SITE_URL}/monthly-rental/`,
    ogTitle: 'Monthly Car Rental Dubai | UAE Rental Car',
    ogDescription:
      'Monthly car rental in Dubai from AED 1,199/month. Fixed price, maintenance included, free delivery & 24/7 support.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: 'UAE Rental Car',
        url: `${SITE_URL}/monthly-rental/`,
        description:
          'Monthly car rental in Dubai from AED 1,199/month. One fixed price, free delivery, maintenance included, free replacement car and 24/7 support.',
        telephone: '+971-55-552-3231',
        priceRange: 'AED 1199 - AED 7500',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        openingHours: 'Mo-Su 00:00-24:00',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the cheapest monthly car rental in Dubai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Monthly rentals with UAE Rental Car start from AED 1,199 per month for economy cars. The exact price depends on the model — for example the Toyota Camry is AED 2,200 per month.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is included in a monthly rental?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'One fixed monthly price covering the car, basic insurance, maintenance, free delivery anywhere in Dubai and a free replacement car if yours needs service.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I swap my monthly rental car?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. You can change to a different model at the end of your month, or upgrade mid-month — just message us on WhatsApp and we arrange the swap.',
            },
          },
          {
            '@type': 'Question',
            name: 'What documents do I need for a monthly rental?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Residents need an Emirates ID and UAE driving licence; tourists need a passport, visit visa, home-country licence and International Driving Permit. Proof of address is needed for monthly plans.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I cancel my monthly rental early?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Monthly rentals can be cancelled with notice — unused days are calculated fairly and any refundable deposit is returned after the car check.',
            },
          },
        ],
      },
    ],
  },
  nodeposit: {
    title: 'No Deposit Car Rental Dubai | Rent a Car with 0 Deposit',
    description:
      'Rent a car in Dubai with zero deposit. No-deposit options on economy & SUV models, free delivery, free insurance & 24/7 support. Book on WhatsApp today!',
    canonical: `${SITE_URL}/no-deposit/`,
    ogTitle: 'No Deposit Car Rental Dubai | UAE Rental Car',
    ogDescription:
      'Zero-deposit car rental in Dubai. Economy & SUV models, free delivery, free insurance & 24/7 support.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: 'UAE Rental Car',
        url: `${SITE_URL}/no-deposit/`,
        description:
          'No-deposit car rental in Dubai. Zero deposit on selected economy and SUV models, free delivery, free insurance and 24/7 support.',
        telephone: '+971-55-552-3231',
        priceRange: 'AED 79 - AED 7500',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        openingHours: 'Mo-Su 00:00-24:00',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Which cars can I rent without a deposit in Dubai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No-deposit options are available on selected economy and SUV models, such as the Toyota Camry and Hyundai Tucson, subject to quick document verification.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does the no-deposit verification work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Share your documents on WhatsApp — passport and visa for tourists, Emirates ID and UAE licence for residents. Verification usually takes a few minutes.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is there any hidden charge instead of the deposit?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. The rental price is the price — no hidden charges. Insurance is included and Salik tolls are billed at cost only.',
            },
          },
          {
            '@type': 'Question',
            name: 'What happens if the car is damaged?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Basic insurance is included in every rental. Any damage beyond the insurance cover is charged at actual repair cost, with a full statement provided.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the minimum age for no-deposit rental?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '21 years for economy cars and 25 years for luxury vehicles, with a valid driving licence.',
            },
          },
        ],
      },
    ],
  },
  blog: {
    title: 'Blog | Dubai Car Rental Guides, Tips & Deals | UAE Rental Car',
    description:
      'Dubai car rental guides: no-deposit rentals, monthly deals, required documents, Salik tolls and money-saving tips from UAE Rental Car.',
    canonical: `${SITE_URL}/blog/`,
    ogTitle: 'Blog | Dubai Car Rental Guides, Tips & Deals | UAE Rental Car',
    ogDescription:
      'Dubai car rental guides: no-deposit rentals, monthly deals, required documents, Salik tolls and money-saving tips from UAE Rental Car.',
    ogType: 'article',
    jsonLd: [],
  },
};

// ---- Blog posts (seed post from admin/data/posts/*.json) ----
export const POSTS = [
  {
    slug: 'rent-a-car-dubai-without-deposit',
    title: 'How to Rent a Car in Dubai Without a Deposit (2026 Guide)',
    date: '2026-10-23',
    updated: '2026-10-23 22:40:00',
    keyword: 'rent a car dubai no deposit',
    excerpt:
      'Yes, you can rent a car in Dubai without a deposit. Here is how no-deposit rentals work, which cars qualify, and what documents you need.',
    meta_title: 'Rent a Car Dubai Without Deposit | No Deposit Rentals from AED 79/day',
    meta_desc:
      'Rent a car in Dubai with no deposit. Learn which cars qualify, what documents you need, and how no-deposit rentals work at UAE Rental Car.',
    content: `<p>One of the most common questions we hear is: <strong>can I rent a car in Dubai without a deposit?</strong> The answer is yes — <a href="https://uaerentcar.com/">UAE Rental Car</a> offers no-deposit options on selected economy cars and SUVs, so you can hit the road without a large hold on your credit card.</p><h2>How no-deposit car rental works in Dubai</h2><p>Normally, rental companies block AED 1,000–3,000 on your card as a security deposit. With a no-deposit rental, that hold is waived after a quick document check. You simply pay the rental amount — daily, weekly or <a href="https://uaerentcar.com/#fleet">monthly</a> — and drive away.</p><h2>Which cars qualify for no deposit?</h2><ul><li><strong>Economy sedans</strong> — e.g. Toyota Camry from AED 99/day</li><li><strong>Compact SUVs</strong> — e.g. Hyundai Tucson from AED 129/day</li><li><strong>Monthly rentals</strong> — deposits are often waived entirely on 30-day bookings</li></ul><h2>Documents you need</h2><p><strong>Tourists:</strong> passport, visit visa, home-country driving licence and an International Driving Permit. <strong>UAE residents:</strong> UAE driving licence and Emirates ID. Minimum age is 21.</p><h2>Tips to keep it hassle-free</h2><ul><li>Inspect the car and photograph any existing scratches at pick-up</li><li>Ask about the mileage limit (ours is 250 km/day) and Salik toll charges</li><li>Return the car with the same fuel level to avoid refuelling fees</li></ul><blockquote>Want a no-deposit car today? Message us on WhatsApp and we will confirm availability within minutes — with free delivery anywhere in Dubai.</blockquote>`,
  },
];

export const postUrl = (slug) => `${SITE_URL}/blog/${slug}/`;

export const fmtDate = (ymd) => {
  const t = new Date(ymd + 'T00:00:00');
  return isNaN(t)
    ? ''
    : t.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ---- Home FAQ (same 5 questions as static index.html) ----
export const HOME_FAQS = [
  {
    q: 'Can I rent a car in Dubai without a deposit?',
    a: 'Yes. We offer no-deposit options on selected economy and SUV models, subject to quick document verification.',
  },
  {
    q: 'What documents do I need?',
    a: 'Tourists: passport, visit visa, home-country driving licence and International Driving Permit. UAE residents: UAE driving licence and Emirates ID.',
  },
  {
    q: 'Is insurance included?',
    a: 'Yes, basic insurance is included in every rental. Full coverage upgrades are available on request.',
  },
  {
    q: 'Do you deliver the car?',
    a: 'Yes — free delivery anywhere in Dubai, including hotels, residences and DXB airport.',
  },
  {
    q: 'What is the minimum age?',
    a: '21 years for economy cars, 25 years for luxury vehicles.',
  },
];
