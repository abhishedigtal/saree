import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAHARANI & CO. | Imperial Royal Weaves & Haute Couture",
  description: "An immersive 3D scrolling royal odyssey celebrating the living heritage of Banarasi Zari, Rajputana Kalis Lehengas, and Kanjeevaram Temple Silks.",
  keywords: ["Royal Saree", "Bridal Lehenga", "Banarasi Silk", "Kanjeevaram Silk", "Haute Couture", "Luxury Royal Indian Fashion", "Zardozi"],
  openGraph: {
    title: "MAHARANI & CO. | Imperial Royal Weaves",
    description: "Experience the living tapestry of royal dynasties through an interactive 3D couture journey.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div className="bg-regal-glow" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
