import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { CLUB } from "@/lib/club";
import "./globals.css";

// Heavy, rounded grotesque that echoes the lettering in the club logo.
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${CLUB.name} — klassiske filmar i Fjaler`,
  description: "Filmklubb i Fjaler som viser klassiske filmar på lerretet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Default language is Nynorsk; LanguageProvider updates <html lang> client-side.
  return (
    <html lang="nn" className={rubik.variable}>
      <body>{children}</body>
    </html>
  );
}
