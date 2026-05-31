import type { Metadata } from "next";
import { Inter, Source_Serif_4, Space_Grotesk, Space_Mono } from "next/font/google";
import ConditionalSiteNavbar from "@/components/ConditionalSiteNavbar";
import NavAuthBadge from "@/components/NavAuthBadge";
import GlobalOAuthFlash from "@/components/GlobalOAuthFlash";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { DORRSUM_ADVISORY_NAME } from "@/lib/site-brand";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

/** Editorial serif for institutional display type (headlines, quotes). */
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/** Dorrsum wordmark / heading face */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-brand",
});

/** Dorrsum tagline / metric labels */
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono-brand",
});

export const metadata: Metadata = {
  title: {
    default: DORRSUM_ADVISORY_NAME,
    template: `%s | ${DORRSUM_ADVISORY_NAME}`,
  },
  description:
    "Research-first, transaction-ready advisory for TMT infrastructure credit — independent, practitioner-grade, and TMT-native.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-[var(--pa-page)] font-sans text-[var(--pa-text)] antialiased`}
      >
        <GoogleAnalytics />
        <ConditionalSiteNavbar authBadge={<NavAuthBadge />} />
        <GlobalOAuthFlash />
        <div className="flex w-full flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
