import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maharani & Co. — Handwoven Couture & Wholesale Atelier",
  description:
    "Banarasi brocades, Kanjeevaram temple silks, Rajputana zardozi and selvedge denim — handwoven couture for India's finest boutiques.",
  openGraph: {
    title: "Maharani & Co.",
    description: "Handwoven couture for India's finest boutiques.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0908",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
