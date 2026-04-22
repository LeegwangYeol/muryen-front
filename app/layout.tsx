import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
// NOTE: root layout is a Server Component. We cannot use `dynamic(..., { ssr:false })` here.
// VantaBackground itself is a client component, so importing it directly is fine.
import VantaBackground from "./component/vanta-main-background";
import { ThemeProvider } from "./context/theme-context";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/app-shell";
import { SITE, KEYWORDS, CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "武로 緣을 잇다",
    template: `%s | ${SITE.name}`,
  },
  description: "武緣 메인",
  keywords: [...KEYWORDS],
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  icons: {
    icon: "/images/icon/muryeon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | 24반 무예 · 갑주 대련 · 대학경당 계보`,
    description: SITE.description,
    images: [
      {
        url: "/images/announce/gumiAllone.webp",
        alt: "무련 24반 무예",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | 24반 무예 · 갑주 대련`,
    description: SITE.description,
    images: ["/images/announce/gumiAllone.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: SITE.name,
  alternateName: [SITE.hanja, SITE.fullName],
  url: SITE.url,
  logo: `${SITE.url}/images/icon/muryeon.ico`,
  image: `${SITE.url}/images/armour.png`,
  description: SITE.description,
  sport: "Korean Traditional Martial Arts — 24 Banmuye (24반 무예)",
  slogan: SITE.slogan,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.location,
    addressCountry: "KR",
  },
  sameAs: [CONTACT.youtube, CONTACT.instagram].filter(Boolean),
};

// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="light" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.classList.add('theme-' + theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://static.llami.net/widget-v1.css"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.19/dist/bundle.min.js"
          strategy="lazyOnload"
        />
        <Script type="module" id="llami-chat-widget" strategy="lazyOnload">
          {`
            import { initialize, run } from "https://static.llami.net/widget-v1.js";
            run("9afddf76-2d21-422c-a4fc-a369fcf21d09");
          `}
        </Script>
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body>
        <Providers>
        <ThemeProvider>
          <VantaBackground>
            <AppShell>{children}</AppShell>
          </VantaBackground>
        </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
