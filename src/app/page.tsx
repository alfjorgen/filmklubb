import { getFilmData } from "@/lib/checkin";
import { CLUB } from "@/lib/club";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import {
  ApiErrorNotice,
  ContactSection,
  HistorySection,
  InfoSection,
  UpcomingSection,
} from "@/components/Sections";

// ISR: regenerate at most once an hour. On-demand revalidation (the "films" tag
// / this path) can force a refresh after urgent program changes.
export const revalidate = 3600;

export default async function HomePage() {
  const { upcoming, past, apiError } = await getFilmData();

  return (
    <LanguageProvider>
      <Header />
      <main className="container">
        {apiError && <ApiErrorNotice />}
        <UpcomingSection films={upcoming} />
        <HistorySection films={past} />
        <InfoSection />
        <ContactSection />
      </main>
      <div className="sprocket-strip" aria-hidden="true" />
      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {CLUB.name}
        </p>
      </footer>
    </LanguageProvider>
  );
}
