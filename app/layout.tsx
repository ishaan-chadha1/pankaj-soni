import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./CartProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BagDrawer from "./components/BagDrawer";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";

/* A didone for display, a geometric grotesque for everything else — the
   standard couture pairing. Both variable, so no weight list is needed. */
const display = Bodoni_Moda({
  variable: "--font-ps-display",
  subsets: ["latin"],
  display: "swap",
});

const sans = Jost({
  variable: "--font-ps-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

/* Set NEXT_PUBLIC_SITE_URL at build time so canonical and OG URLs are absolute
   on the real domain. */
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pankajsoni.example").replace(
  /\/$/,
  ""
);

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "PANKAJ SONI — Fragrance, Beauty, Eyewear & Tailoring",
    template: "%s | PANKAJ SONI",
  },
  description:
    "The house of PANKAJ SONI. Private Atelier fragrance, colour, eyewear and evening tailoring — made in small numbers, shipped worldwide.",
  openGraph: {
    type: "website",
    siteName: "PANKAJ SONI",
    title: "PANKAJ SONI — Fragrance, Beauty, Eyewear & Tailoring",
    description:
      "Private Atelier fragrance, colour, eyewear and evening tailoring — made in small numbers.",
    images: [{ url: "/img/og.png", width: 1200, height: 630, alt: "PANKAJ SONI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PANKAJ SONI",
    description: "Private Atelier fragrance, colour, eyewear and evening tailoring.",
    images: ["/img/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="ps-root ps-grain">
        <a href="#main" className="ps-skip">
          Skip to content
        </a>
        <CartProvider>
          <Preloader />
          <Cursor />
          <ScrollProgress />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BagDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
