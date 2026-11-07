import { Html, Head, Main, NextScript } from 'next/document';

// Anti-flash script (same as the static site): apply the saved language and
// RTL direction before first paint so Arabic users never see a flash of LTR.
const ANTI_FLASH = `try{var __l=localStorage.getItem("urc-lang");if(__l==="ar"){document.documentElement.lang="ar";document.documentElement.dir="rtl";}}catch(e){}`;

export default function Document() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <link rel="icon" href="/images/logo.svg" />
        <link
          rel="preload"
          as="image"
          href="/images/media-generation-hero-dubai-skyline-0-76e8fd38-4e21-4b75-bea0-2db00a426d6e.webp"
          fetchPriority="high"
        />
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
