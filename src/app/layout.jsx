import { Montserrat } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IntroGate from "@/components/layout/IntroGate";
import PageTransition from "@/components/layout/PageTransition";
import ScrollRefresh from "@/components/layout/ScrollRefresh";
import { metaDescription, site } from "@/content/site";
import { NEW_TAB_NOTE_ID } from "@/lib/a11y";
import { introHeadScript } from "@/lib/intro";
import { ogImage } from "@/lib/metadata";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
});

const defaultTitle = `${site.eventName} — ${site.theme}`;
const defaultDescription = metaDescription;

export const metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: defaultTitle, template: `%s | ${site.eventName}` },
  description: defaultDescription,
  openGraph: {
    type: "website",
    siteName: site.eventName,
    locale: "en_IN",
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImage],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the <head> script sets data-intro before React hydrates.
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introHeadScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <IntroGate />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <PageTransition>
          <Navbar />
          <main id="main" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
        </PageTransition>
        <ScrollRefresh />
        <span id={NEW_TAB_NOTE_ID} hidden>
          Opens in a new tab
        </span>
      </body>
    </html>
  );
}
