import type { Metadata } from "next";
import { CLUB } from "@/lib/club";
import "./globals.css";

export const metadata: Metadata = {
  title: `${CLUB.name} — klassiske filmar i Fjaler`,
  description: "Filmklubb i Fjaler som viser klassiske filmar på lerretet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Default language is Nynorsk; LanguageProvider updates <html lang> client-side.
  return (
    <html lang="nn">
      <body>{children}</body>
    </html>
  );
}
