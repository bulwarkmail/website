import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EditionQuiz } from "@/components/edition-quiz";

export const metadata: Metadata = {
  title: "Which Bulwark fits you?",
  description:
    "A few quick questions about your mail, where you'd put it and how people log in, and a recommendation between Bulwark and Bulwark Lite.",
  alternates: { canonical: "/choose" },
};

export default function ChoosePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bw-field bw-quiz-hero">
          <div className="bw-w">
            <div className="bw-hero-text">
              <h1 className="bw-h1">Which Bulwark fits you?</h1>
              <p className="bw-lead">
                A few quick questions about your mail, where you&apos;d put it and how people log in. It takes
                about a minute.
              </p>
            </div>
          </div>
        </section>

        <section className="bw-quiz-sec">
          <div className="bw-w">
            <EditionQuiz />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
