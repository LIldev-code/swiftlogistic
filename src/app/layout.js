import { Poppins } from "next/font/google";
import "./globals.css";
import { ShipmentProvider } from "@/contexts/ShipmentContext";
import dynamic from "next/dynamic";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

// Import the EmailButton component with dynamic import to ensure it's only loaded client-side
const EmailButton = dynamic(() => import("@/components/EmailButton/EmailButton"), {
  ssr: false,
});

export const metadata = {
  title: "Swift Logistic | Global Shipping & Logistics",
  description: "Swift Logistic — Fast, Reliable & Secure International Shipping and Freight Solutions Worldwide.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css" />
      </head>
      <body className={poppins.className}>
        <ShipmentProvider>{children}</ShipmentProvider>
        <EmailButton />
      </body>
    </html>
  );
}
