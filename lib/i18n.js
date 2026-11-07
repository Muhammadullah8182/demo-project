// UAE Rental Car — i18n: English ⇄ Arabic switcher (RTL aware).
// Port of the static site's js/i18n.js (same dictionary, same text-node-walk
// engine, same Arabic plural rules). Hand-written Arabic — no translation tool.

import { useEffect, useState, useCallback, createContext, useContext } from 'react';

// Shared language context so Layout (header switcher) and pages read the
// same current language without prop-drilling.
export const LangContext = createContext({ lang: 'en', toggleLang: () => {} });
export const useLang = () => useContext(LangContext);

export const DICT = {
  // ===== Navigation & chrome =====
  Home: 'الرئيسية',
  Fleet: 'الأسطول',
  Taxi: 'تاكسي',
  Compare: 'مقارنة',
  'Monthly Rental': 'الإيجار الشهري',
  'No Deposit': 'بدون تأمين',
  Hotels: 'الفنادق',
  Locations: 'المواقع',
  Blog: 'المدونة',
  Contact: 'اتصل بنا',
  'Contact Us': 'اتصل بنا',
  'WhatsApp Us': 'واتساب',
  'WhatsApp Us Now': 'راسلنا عبر واتساب الآن',
  'Chat on WhatsApp': 'محادثة واتساب',
  WhatsApp: 'واتساب',
  'Quick Links': 'روابط سريعة',
  'We Accept': 'نقبل',
  Cash: 'نقداً',
  'Privacy Policy': 'سياسة الخصوصية',
  'Terms & Conditions': 'الشروط والأحكام',
  'UAE Rental Car. All rights reserved. |': 'UAE Rental Car. جميع الحقوق محفوظة. |',
  'Premium car rental across Dubai & the UAE. No deposit options, free delivery, 24/7 support.':
    'تأجير سيارات فاخر في دبي والإمارات. خيارات بدون تأمين، توصيل مجاني، دعم 24/7.',
  'Premium car rental service in Dubai. Reliable, affordable, hassle-free rentals with no deposit options.':
    'خدمة تأجير سيارات فاخرة في دبي. موثوقة وبأسعار مناسبة وبدون عناء، مع خيارات بدون تأمين.',
  'Dubai, UAE': 'دبي، الإمارات',
  '24/7 Customer Support': 'دعم العملاء 24/7',
  '24/7 Support': 'دعم 24/7',
  '✓ 24/7 Support': '✓ دعم 24/7',
  '🕘 24/7 Support': '🕘 دعم 24/7',
  '🕘 24/7 Customer Support': '🕘 دعم العملاء 24/7',
  '📍 Dubai, UAE': '📍 دبي، الإمارات',
  'Call:': 'اتصل:',
  'uaerenatalcar@gmail.com': 'uaerenatalcar@gmail.com',

  // ===== Hero & widget =====
  'Rent a Car in Dubai from AED 79/day': 'استأجر سيارة في دبي ابتداءً من 79 درهم/يوم',
  '✓ No Deposit Options ✓ Free Delivery ✓ 24/7 Support': '✓ بدون تأمين ✓ توصيل مجاني ✓ دعم 24/7',
  '🚗 Self Drive': '🚗 قيادة ذاتية',
  '🚕 Taxi': '🚕 تاكسي',
  '🏨 Hotels': '🏨 الفنادق',
  'Pick-up Location': 'موقع الاستلام',
  'Pick-up Date': 'تاريخ الاستلام',
  'Return Date': 'تاريخ الإرجاع',
  Search: 'ابحث',
  'Where To': 'إلى أين؟',
  'Check In': 'تاريخ الوصول',
  'Check Out': 'تاريخ المغادرة',
  Travellers: 'المسافرون',
  Adults: 'البالغون',
  Children: 'الأطفال',
  Rooms: 'الغرف',
  Done: 'تم',
  '(0–11)': '(0–11)',
  'Find My Taxi →': '← ابحث عن تاكسي',
  'Search Hotels →': '← ابحث عن فنادق',
  '✓ No booking fee': '✓ بدون رسوم حجز',
  '✓ Pay by card or cash': '✓ الدفع بالبطاقة أو نقداً',
  '✓ Child seats on request': '✓ مقاعد أطفال عند الطلب',
  'One Way': 'ذهاب فقط',
  'Round Trip': 'ذهاب وعودة',
  'Pick-up Point': 'نقطة الاستلام',
  'Drop-off Point': 'نقطة التسليم',
  'Pickup Time': 'وقت الاستلام',
  'Return Time': 'وقت العودة',
  'Enter your exact flight date and time': 'أدخل تاريخ ووقت رحلتك بالضبط',
  '(for airport pickup)': '(للاستلام من المطار)',
  '(optional)': '(اختياري)',
  'Search for a city or hotel': 'ابحث عن مدينة أو فندق',
  'Enter Destination': 'أدخل الوجهة',

  // ===== Booking modal =====
  'Complete Your Booking': 'أكمل حجزك',
  'Your details': 'بياناتك',
  Review: 'مراجعة',
  'Review your booking': 'راجع حجزك',
  'Choose Your Car': 'اختر سيارتك',
  'Choose your vehicle': 'اختر مركبتك',
  'Full name *': 'الاسم الكامل *',
  'Mobile / WhatsApp *': 'الجوال / واتساب *',
  'Notes / special requests': 'ملاحظات / طلبات خاصة',
  'Flight number': 'رقم الرحلة',
  'Confirm Booking': 'تأكيد الحجز',
  'Continue →': '← متابعة',
  '← Back': 'عودة →',
  'Skip the form — book on WhatsApp': 'تخطَّ النموذج — احجز عبر واتساب',
  'Booking received!': 'تم استلام الحجز!',
  'Your booking reference is': 'مرجع حجزك هو',
  'Our team will contact you shortly on WhatsApp to confirm.': 'سيتواصل معك فريقنا قريباً عبر واتساب للتأكيد.',
  'Confirm on WhatsApp': 'أكّد عبر واتساب',
  'Best available': 'أفضل المتاح',
  'Best price': 'أفضل سعر',
  Metered: 'حسب العدّاد',

  // ===== Homepage sections =====
  'Browse by Category': 'تصفح حسب الفئة',
  'Browse our fleet and pick the perfect car for your needs.': 'تصفح أسطولنا واختر السيارة المثالية لاحتياجاتك.',
  Economy: 'اقتصادية',
  Luxury: 'فاخرة',
  BESTSELLER: 'الأكثر مبيعاً',
  POPULAR: 'شائع',
  LUXURY: 'فاخرة',
  '12 cars': '12 سيارة',
  '18 cars': '18 سيارة',
  '24 cars': '24 سيارة',
  'Featured Cars': 'السيارات المميزة',
  'Rent in 4 Easy Steps': 'الاستئجار في 4 خطوات سهلة',
  'Book Online': 'احجز عبر الإنترنت',
  'Select dates, location and confirm your booking instantly.': 'اختر التواريخ والموقع وأكّد حجزك فوراً.',
  'Quick verification with no deposit or minimal deposit.': 'تحقق سريع بدون تأمين أو بتأمين بسيط.',
  'Free delivery or pick-up at your location. Enjoy your ride.': 'توصيل مجاني أو استلام من موقعك. استمتع برحلتك.',
  'Pick-up & Drive': 'استلم وانطلق',
  'Documents & Payment': 'المستندات والدفع',
  'What Our Customers Say': 'ماذا يقول عملاؤنا',
  '"Excellent service! Car was delivered to my hotel within 30 minutes. No deposit was a huge plus."':
    '"خدمة ممتازة! تم توصيل السيارة إلى فندقي خلال 30 دقيقة. ميزة عدم وجود تأمين كانت رائعة."',
  '"Great prices and the SUV was clean and brand new. Customer support was responsive 24/7."':
    '"أسعار رائعة وسيارة الدفع الرباعي كانت نظيفة وجديدة تماماً. دعم العملاء كان متجاوباً على مدار الساعة."',
  '"Smooth monthly rental experience. Transparent pricing, no hidden fees. Highly recommend!"':
    '"تجربة إيجار شهري سلسة. أسعار شفافة وبدون رسوم خفية. أنصح بهم بشدة!"',
  '— Ahmed K., Google Review': '— أحمد ك.، مراجعة جوجل',
  '— Sarah M., Verified Customer': '— سارة م.، عميلة موثّقة',
  '— Omar R., Repeat Customer': '— عمر ر.، عميل دائم',
  'Frequently Asked Questions': 'الأسئلة الشائعة',
  'What documents do I need?': 'ما المستندات التي أحتاجها؟',
  'Tourists: passport, visit visa, home-country driving licence and International Driving Permit. UAE residents: UAE driving licence and Emirates ID.':
    'السياح: جواز سفر وتأشيرة زيارة ورخصة قيادة من بلدك وتصريح قيادة دولي. المقيمون في الإمارات: رخصة قيادة إماراتية وبطاقة هوية إماراتية.',
  'What is the minimum age?': 'ما الحد الأدنى للسن؟',
  '21 years for economy cars, 25 years for luxury vehicles.': '21 عاماً للسيارات الاقتصادية، و25 عاماً للسيارات الفاخرة.',
  'Is insurance included?': 'هل التأمين مشمول؟',
  'Yes, basic insurance is included in every rental. Full coverage upgrades are available on request.':
    'نعم، التأمين الأساسي مشمول في كل إيجار. تتوفر ترقيات للتغطية الكاملة عند الطلب.',
  'Can I rent a car in Dubai without a deposit?': 'هل يمكنني استئجار سيارة في دبي بدون تأمين؟',
  'Yes. We offer no-deposit options on selected economy and SUV models, subject to quick document verification.':
    'نعم. نوفر خيارات بدون تأمين على سيارات اقتصادية وSUV مختارة، بعد تحقق سريع من المستندات.',
  'Do you deliver the car?': 'هل توصّلون السيارة؟',
  'Yes — free delivery anywhere in Dubai, including hotels, residences and DXB airport.':
    'نعم — توصيل مجاني إلى أي مكان في دبي، بما في ذلك الفنادق والمساكن ومطار DXB.',
  '✓ 250 km/day included': '✓ 250 كم/يوم مشمولة',
  '✓ Free Insurance': '✓ تأمين مجاني',
  '✓ Zero Hidden Charges': '✓ بدون رسوم خفية',
  'Zero Hidden Charges': 'بدون رسوم خفية',
  'Free Insurance Included': 'تأمين مجاني مشمول',
  'Drop-off Anywhere in Dubai': 'إرجاع في أي مكان في دبي',
  '24/7 Roadside Assistance': 'مساعدة على الطريق 24/7',
  'Transparent daily, weekly & monthly rates — no hidden fees.': 'أسعار يومية وأسبوعية وشهرية شفافة — بدون رسوم خفية.',

  // ===== Hotels page =====
  'Your Home Away From Home': 'بيتك الثاني بعيداً عن البيت',
  'Handpicked hotels across Dubai at honest prices.': 'فنادق مختارة بعناية في دبي بأسعار صادقة.',
  'Compare handpicked hotels and honest prices in one place.': 'قارن الفنادق المختارة والأسعار الصادقة في مكان واحد.',
  'Explore Our Best Experiences': 'اكتشف أفضل تجاربنا',
  'Family Holidays': 'عطلات عائلية',
  'Honeymoon & Romance': 'شهر العسل والرومانسية',
  Staycation: 'إقامة ترفيهية',
  Adventure: 'مغامرة',
  'Long Holiday': 'عطلة طويلة',
  'City Break': 'عطلة المدينة',
  'Secret Hotel Deals — up to 30% off': 'عروض فنادق سرية — خصم حتى 30%',
  'Handpicked Dubai hotels at members-only rates. This week only.': 'فنادق مختارة بعناية في دبي بأسعار حصرية للأعضاء. هذا الأسبوع فقط.',
  'Get the Deals': 'احصل على العروض',
  'Limited offer': 'عرض محدود',
  'Why Book With Us': 'لماذا تحجز معنا',
  Fast: 'سريع',
  'Online booking in minutes — anytime, anywhere, no office visits.': 'حجز عبر الإنترنت في دقائق — في أي وقت وأي مكان، بدون زيارة مكتب.',
  Convenient: 'مريح',
  'Easily compare prices, hotels, and options to find the perfect deal that suits your needs. Enjoy full control over your booking choices!':
    'قارن الأسعار والفنادق والخيارات بسهولة لتجد العرض المثالي المناسب لاحتياجاتك. تحكم كامل في خيارات حجزك!',
  Secure: 'آمن',
  'A trusted local operator — your payment and data are protected.': 'مشغّل محلي موثوق — دفعتك وبياناتك محمية.',
  'Great Value': 'قيمة رائعة',
  'Real-time deals and last-minute offers, no hidden charges.': 'عروض فورية وعروض اللحظة الأخيرة، بدون رسوم خفية.',

  // ===== Locations page =====
  'Car Rental Locations Across the UAE': 'مواقع تأجير السيارات في الإمارات',
  'Free delivery to your doorstep — anywhere in Dubai & the Emirates.': 'توصيل مجاني إلى باب منزلك — في أي مكان في دبي والإمارات.',
  'Rent a Car Anywhere in Dubai & the UAE': 'استأجر سيارة في أي مكان في دبي والإمارات',
  'No need to visit an office. Tell us where you are — hotel, home, office or airport arrivals — and we bring the car to you, clean, fueled and ready to drive. Pickup and drop-off anywhere in the seven emirates, 24/7.':
    'لا حاجة لزيارة مكتب. أخبرنا أين أنت — فندق أو منزل أو مكتب أو صالة الوصول في المطار — وسنحضر السيارة إليك نظيفة وجاهزة. الاستلام والتسليم في الإمارات السبع، 24/7.',
  '📲 Get a Car Delivered Now': '📲 احصل على سيارة موصلة الآن',
  'Rental Programs for Every Need': 'برامج إيجار لكل حاجة',
  'Daily, weekly, monthly — or a driver at your service.': 'يومي أو أسبوعي أو شهري — أو سائق في خدمتك.',
  '🚗 Daily Rental': '🚗 إيجار يومي',
  'Perfect for short trips and weekend plans. From AED 79/day with free delivery.': 'مثالي للرحلات القصيرة وخطط عطلة نهاية الأسبوع. ابتداءً من 79 درهم/يوم مع توصيل مجاني.',
  'Book daily →': '← احجز يومياً',
  '📅 Weekly Rental': '📅 إيجار أسبوعي',
  'Staying a week? Weekly rates save you up to 20% versus daily pricing.': 'ستبقى أسبوعاً؟ الأسعار الأسبوعية توفر لك حتى 20% مقارنة بالأسعار اليومية.',
  'Book weekly →': '← احجز أسبوعياً',
  '🗓️ Monthly Rental': '🗓️ إيجار شهري',
  'Our most popular plan. One fixed monthly price, maintenance included, free replacement car.':
    'خطتنا الأكثر شعبية. سعر شهري ثابت واحد، الصيانة مشمولة، وسيارة بديلة مجانية.',
  'Book monthly →': '← احجز شهرياً',
  '✈️ Airport Pickup': '✈️ استلام من المطار',
  'Land at DXB or DWC and drive off. We meet you at arrivals with your car ready.': 'اهبط في DXB أو DWC وانطلق. نستقبلك في صالة الوصول وسيارتك جاهزة.',
  'Book pickup →': '← احجز الاستلام',
  '🔁 One-Way Rental': '🔁 إيجار باتجاه واحد',
  'Pick up in Dubai, drop off in Abu Dhabi or Sharjah. One-way trips made simple.': 'استلم في دبي وسلّم في أبوظبي أو الشارقة. الرحلات باتجاه واحد أصبحت سهلة.',
  'Book one-way →': '← احجز باتجاه واحد',
  '🤵 Chauffeur-Driven': '🤵 مع سائق',
  'Relax in the back seat. Professional drivers for business, events and evenings out.': 'استرخ في المقعد الخلفي. سائقون محترفون للأعمال والفعاليات والسهرات.',
  'Book chauffeur →': '← احجز مع سائق',
  '🏢 Corporate Rental': '🏢 إيجار للشركات',
  'Fleet solutions for companies — monthly billing, dedicated support, multiple vehicles.':
    'حلول أساطيل للشركات — فواتير شهرية ودعم مخصص ومركبات متعددة.',
  'Enquire →': '← استفسر',
  '📜 Long-Term Lease': '📜 تأجير طويل الأمد',
  '3, 6 or 12-month leases at the lowest rates. Ideal for residents and businesses.': 'عقود 3 أو 6 أو 12 شهراً بأقل الأسعار. مثالية للمقيمين والشركات.',
  'What You Need to Rent a Car in the UAE': 'ما تحتاجه لاستئجار سيارة في الإمارات',
  'Minimum driving age is 21. Here is the paperwork:': 'الحد الأدنى لسن القيادة 21 عاماً. إليك الأوراق المطلوبة:',
  '🧳 For Tourists': '🧳 للسياح',
  'Passport + visit visa / entry stamp': 'جواز سفر + تأشيرة زيارة / ختم دخول',
  'Driving license from your home country': 'رخصة قيادة من بلدك',
  'International Driving Permit (IDP) — required for most nationalities': 'تصريح قيادة دولي (IDP) — مطلوب لمعظم الجنسيات',
  'Credit card or cash for the security deposit': 'بطاقة ائتمانية أو نقداً للتأمين',
  '🏠 For UAE Residents': '🏠 لمقيمي الإمارات',
  'Emirates ID (original)': 'بطاقة الهوية الإماراتية (الأصلية)',
  'Valid UAE driving license': 'رخصة قيادة إماراتية سارية',
  'Proof of address for monthly rentals': 'إثبات عنوان للإيجارات الشهرية',
  'Rent a Car in These Popular Cities': 'استأجر سيارة في هذه المدن الشهيرة',
  'We deliver across all seven emirates.': 'نوصّل إلى الإمارات السبع كلها.',
  Dubai: 'دبي',
  '— the city that never slows down. Marina, Downtown, JBR and beyond, delivered in under an hour.':
    '— المدينة التي لا تتوقف أبداً. المارينا وداون تاون وJBR وما بعدها، بتوصيل في أقل من ساعة.',
  'Abu Dhabi': 'أبوظبي',
  "— the capital's Corniche, Yas Island and Saadiyat, with inter-emirate one-way options.":
    '— كورنيش العاصمة وجزيرة ياس والسعديات، مع خيارات الذهاب باتجاه واحد بين الإمارات.',
  Sharjah: 'الشارقة',
  '— affordable monthly rentals minutes from Dubai, perfect for commuters.': '— إيجارات شهرية بأسعار مناسبة على بعد دقائق من دبي، مثالية للمترددين يومياً.',
  Ajman: 'عجمان',
  '— beach-side stays and budget-friendly long-term deals.': '— إقامات شاطئية وعروض طويلة الأمد بأسعار مناسبة.',
  'Ras Al Khaimah': 'رأس الخيمة',
  '— mountain roads and resorts; we deliver to every hotel on Marjan Island.': '— طرق جبلية ومنتجعات؛ نوصّل إلى كل فندق في جزيرة المرجان.',
  Fujairah: 'الفجيرة',
  '— east-coast escapes with full insurance for long drives.': '— رحلات الساحل الشرقي مع تأمين كامل للرحلات الطويلة.',
  'Umm Al Quwain': 'أم القيوين',
  '— quiet getaways, delivered to your door.': '— رحلات هادئة، بتوصيل إلى باب منزلك.',
  'Top Pickup Locations': 'أهم مواقع الاستلام',
  'Meet us — or we come to you.': 'قابلنا — أو نأتي إليك.',
  '✈️ Airports': '✈️ المطارات',
  'Dubai International (DXB)': 'دبي الدولي (DXB)',
  '— meet & greet at arrivals, all terminals.': '— استقبال في صالة الوصول، جميع المباني.',
  'Al Maktoum (DWC)': 'آل مكتوم (DWC)',
  '— pickup right outside arrivals.': '— استلام مباشرة خارج صالة الوصول.',
  'Abu Dhabi (AUH)': 'أبوظبي (AUH)',
  '— inter-emirate delivery available.': '— توصيل بين الإمارات متاح.',
  'Sharjah (SHJ)': 'الشارقة (SHJ)',
  '— quick handover at the terminal.': '— تسليم سريع في المبنى.',
  '🏙️ Neighborhoods': '🏙️ الأحياء',
  'Downtown Dubai': 'داون تاون دبي',
  '— Burj Khalifa, Dubai Mall area.': '— منطقة برج خليفة ودبي مول.',
  'Dubai Marina & JBR': 'دبي مارينا وJBR',
  '— hotels and residences.': '— فنادق ومساكن.',
  'Palm Jumeirah': 'نخلة جميرا',
  '— villa and hotel delivery.': '— توصيل إلى الفلل والفنادق.',
  Jumeirah: 'جميرا',
  '— beach road hotels and homes.': '— فنادق ومنازل شارع الشاطئ.',
  'Business Bay': 'الخليج التجاري',
  '— offices and towers.': '— مكاتب وأبراج.',
  'Deira & Bur Dubai': 'ديرة وبر دبي',
  '— the classic districts.': '— الأحياء الكلاسيكية.',
  'Al Barsha & JLT': 'البرشاء وJLT',
  '— quick 30-minute delivery.': '— توصيل سريع خلال 30 دقيقة.',
  '🚇 Metro Stations': '🚇 محطات المترو',
  'Mall of the Emirates': 'مول الإمارات',
  '— handover at the station exit.': '— تسليم عند مخرج المحطة.',
  BurJuman: 'برجمان',
  '— central, easy to reach.': '— موقع مركزي وسهل الوصول.',
  'Union Square': 'ساحة الاتحاد',
  '— Deira side connections.': '— وصلات من جهة ديرة.',
  'Dubai Internet City': 'مدينة دبي للإنترنت',
  '— for the business crowd.': '— لرجال الأعمال.',
  'Driving in the UAE — Good to Know': 'القيادة في الإمارات — معلومات مفيدة',
  'Speed limits:': 'حدود السرعة:',
  '60 km/h in cities, 100–140 km/h on highways. Radars are everywhere — stick to the limit.':
    '60 كم/س داخل المدن، و100–140 كم/س على الطرق السريعة. الرادارات في كل مكان — التزم بالحد.',
  'Salik tolls:': 'رسوم سالك:',
  'automated gates on Sheikh Zayed Road and key routes (AED 4–6 per crossing), billed to your rental.':
    'بوابات آلية على شارع الشيخ زايد والطرق الرئيسية (4–6 دراهم للعبور)، تُضاف إلى إيجارك.',
  'Main roads:': 'الطرق الرئيسية:',
  'E11 (Sheikh Zayed Road) runs the coast; E311 and E611 bypass the city.': 'E11 (شارع الشيخ زايد) يمتد على الساحل؛ وE311 وE611 يتجاوزان المدينة.',
  'Fuel:': 'الوقود:',
  'among the cheapest in the region — fill up before returning the car.': 'من الأرخص في المنطقة — عبّئ الخزان قبل إرجاع السيارة.',
  'Parking:': 'مواقف السيارات:',
  'paid zones in busy areas; malls and hotels usually validate or offer free parking.': 'مناطق مدفوعة في الأماكن المزدحمة؛ والمولات والفنادق عادة ما توفر مواقف مجانية أو مخفضة.',
  'Locations FAQ': 'أسئلة شائعة عن المواقع',
  'Do you deliver the car to my hotel?': 'هل توصّلون السيارة إلى فندقي؟',
  'Yes — free delivery to any hotel, home or office in Dubai, and across all emirates. Just share your location on WhatsApp.':
    'نعم — توصيل مجاني إلى أي فندق أو منزل أو مكتب في دبي، وفي جميع الإمارات. فقط شاركنا موقعك عبر واتساب.',
  'Can I pick up at DXB airport?': 'هل يمكنني الاستلام من مطار DXB؟',
  'Absolutely. We meet you at arrivals with the car ready, paperwork done in minutes.':
    'بالتأكيد. نستقبلك في صالة الوصول والسيارة جاهزة، والأوراق تُنجز في دقائق.',
  'Can I return the car in a different city?': 'هل يمكنني إرجاع السيارة في مدينة مختلفة؟',
  'Yes, with our one-way rental option — e.g. pick up in Dubai, drop off in Abu Dhabi or Sharjah.':
    'نعم، مع خيار الإيجار باتجاه واحد — مثلاً استلم في دبي وسلّم في أبوظبي أو الشارقة.',
  'What documents do tourists need?': 'ما المستندات التي يحتاجها السياح؟',
  'Passport with visit visa, your home-country driving license, and an International Driving Permit (IDP) for most nationalities.':
    'جواز سفر مع تأشيرة زيارة، ورخصة قيادة من بلدك، وتصريح قيادة دولي (IDP) لمعظم الجنسيات.',
  'What is the minimum age to rent?': 'ما الحد الأدنى لسن الإيجار؟',
  '21 years with a valid license. Drivers under 25 may have a small young-driver surcharge on luxury cars.':
    '21 عاماً مع رخصة سارية. قد تُفرض رسوم إضافية بسيطة على السائقين تحت 25 عاماً للسيارات الفاخرة.',
  'How do Salik tolls work on rentals?': 'كيف تعمل رسوم سالك في الإيجارات؟',
  'Toll crossings are tracked per car and added to your final bill at cost — no markup, full statement provided.':
    'تُسجَّل عبورات الرسوم لكل سيارة وتُضاف إلى فاتورتك النهائية بسعر التكلفة — بدون زيادة، مع كشف كامل.',
  'Need a Car Delivered Right Now?': 'تحتاج سيارة موصلة الآن؟',
  'Message us your location — we will bring the car to you, anywhere in the UAE.': 'راسلنا بموقعك — وسنحضر السيارة إليك في أي مكان في الإمارات.',

  // ===== Contact page =====
  'Questions, comments or suggestions? Message us — we reply fast, 24/7.': 'أسئلة أو ملاحظات أو اقتراحات؟ راسلنا — نرد بسرعة، 24/7.',
  'Send Us a Message': 'أرسل لنا رسالة',
  'Name *': 'الاسم *',
  'Phone *': 'الهاتف *',
  Email: 'البريد الإلكتروني',
  'Message / Comments *': 'الرسالة / التعليقات *',
  'How can we help?': 'كيف يمكننا مساعدتك؟',
  'Send via WhatsApp →': '← إرسال عبر واتساب',
  'Your message opens in WhatsApp — no waiting on email replies.': 'ستفتح رسالتك في واتساب — لا انتظار لردود البريد الإلكتروني.',
  'Get in Touch': 'تواصل معنا',
  'Office Address': 'عنوان المكتب',
  'Opening Hours': 'ساعات العمل',
  Telephone: 'الهاتف',
  '24/7 — every day of the year': '24/7 — كل أيام السنة',
  'Find Us in Dubai': 'اعثر علينا في دبي',
  'We deliver cars across the whole city — meet us anywhere.': 'نوصّل السيارات إلى كل أنحاء المدينة — قابلنا في أي مكان.',

  // ===== Page titles =====
  'Rent a Car Dubai from AED 79/day | No Deposit Car Rental | UAE Rental Car':
    'استأجر سيارة في دبي من 79 درهم/يوم | تأجير بدون تأمين | UAE Rental Car',
  'Book Hotels in Dubai | Best Hotel Deals | UAE Rental Car': 'احجز فنادق في دبي | أفضل عروض الفنادق | UAE Rental Car',
  'Car Rental Locations in Dubai & UAE | Free Delivery': 'مواقع تأجير السيارات في دبي والإمارات | توصيل مجاني',
  'Contact Us | UAE Rental Car Dubai — 24/7 Support': 'اتصل بنا | UAE Rental Car دبي — دعم 24/7',
};

// ---- Engine (same as static i18n.js) ----
const norm = (s) => s.replace(/\s+/g, ' ').trim();

function plural(word, n) {
  const map = {
    adult: ['بالغ واحد', 'بالغان', 'بالغين'],
    child: ['طفل واحد', 'طفلان', 'أطفال'],
    person: ['شخص واحد', 'شخصان', 'أشخاص'],
    room: ['غرفة واحدة', 'غرفتان', 'غرف'],
  };
  const f = map[word];
  if (!f) return null;
  if (n === 1) return f[0];
  if (n === 2) return f[1];
  return n + ' ' + f[2];
}

function translateSummary(t) {
  let m = t.match(/^(\d+) Adults?(?:, (\d+) Children?)?$/);
  if (m) {
    let s = plural('adult', +m[1]);
    if (m[2] !== undefined) s += '، ' + plural('child', +m[2]);
    return s;
  }
  m = t.match(/^(\d+) Persons?, (\d+) Rooms?$/);
  if (m) return plural('person', +m[1]) + '، ' + plural('room', +m[2]);
  return null;
}

export function translateText(t) {
  const n = norm(t);
  if (DICT[n]) return DICT[n];
  return translateSummary(n);
}

// React hook: keeps html lang/dir + localStorage, walks text nodes on change,
// and observes DOM mutations (booking modal, traveller summaries) like the
// static version. Returns [lang, toggleLang].
export function useI18n() {
  const [lang, setLangState] = useState('en');

  const apply = useCallback((l) => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    // Walk text nodes
    const filter = (n) => {
      if (n.nodeType === 1 && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE'))
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    };
    const translateNode = (node) => {
      if (node.nodeType === 3) {
        const orig = node._i18nOrig;
        const cur = node.nodeValue;
        if (l === 'ar') {
          if (orig === undefined) node._i18nOrig = cur;
          const src = orig === undefined ? cur : orig;
          const tr = translateText(src);
          if (tr) {
            const pre = cur.match(/^\s*/)[0];
            const post = cur.match(/\s*$/)[0];
            const next = pre + tr + post;
            if (next !== cur) node.nodeValue = next;
          }
        } else if (orig !== undefined) {
          node.nodeValue = orig;
          node._i18nOrig = undefined;
        }
        return;
      }
      if (node.nodeType === 1 && node.placeholder !== undefined) {
        const o = node._i18nPh;
        if (l === 'ar') {
          if (o === undefined) node._i18nPh = node.placeholder;
          const t2 = translateText(o === undefined ? node.placeholder : o);
          if (t2) node.placeholder = t2;
        } else if (o !== undefined) {
          node.placeholder = o;
          node._i18nPh = undefined;
        }
      }
    };
    const walk = (root) => {
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, filter);
      const nodes = [];
      let n;
      while ((n = w.nextNode())) nodes.push(n);
      nodes.forEach(translateNode);
      if (root.querySelectorAll) {
        root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(translateNode);
      }
    };
    if (document.body) walk(document.body);
    // Title (translate the English original stored on first run)
    if (!document._titleOrig) document._titleOrig = document.title;
    if (l === 'ar') {
      const t = translateText(document._titleOrig);
      if (t) document.title = t;
    } else {
      document.title = document._titleOrig;
    }
    return walk;
  }, []);

  const setLang = useCallback(
    (l) => {
      try {
        localStorage.setItem('urc-lang', l);
      } catch (e) {}
      setLangState(l);
      apply(l);
    },
    [apply]
  );

  useEffect(() => {
    let initial = 'en';
    try {
      initial = localStorage.getItem('urc-lang') || 'en';
    } catch (e) {}
    if (initial !== 'ar') initial = 'en';
    setLangState(initial);
    apply(initial);
    // Auto-translate content added later (booking modal, traveller summaries)
    let pending = false;
    const obs = new MutationObserver((muts) => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        // Re-walk the whole body: cheap for this site size, and correct
        // even when React re-renders English text back in.
        const cur = (() => {
          try {
            return localStorage.getItem('urc-lang') || 'en';
          } catch (e) {
            return 'en';
          }
        })();
        if (cur === 'ar') apply('ar');
      });
    });
    if (document.body) {
      obs.observe(document.body, { childList: true, characterData: true, subtree: true });
    }
    return () => obs.disconnect();
  }, [apply]);

  const toggleLang = useCallback(() => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  }, [lang, setLang]);

  return [lang, toggleLang];
}
