import type { Metadata } from "next";
import { MaskLines, Reveal } from "../components/Reveal";
import { FillRule } from "../components/Motif";
import { stagger } from "@/lib/motion";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact the Maison",
  description:
    "Contact PANKAJ SONI Client Services — private appointments, orders, alterations and press.",
  alternates: { canonical: "/contact" },
};

/*
 * SCAFFOLD. Phone numbers, addresses and the email are placeholders, and the
 * form does not send yet — see ContactForm.
 */

const CHANNELS = [
  ["Client Services", "+91 22 0000 0000", "Monday to Saturday, 10:00 – 19:00 IST"],
  ["Email", "care@pankajsoni.com", "A reply within one working day"],
  ["Private Appointment", "In any boutique or by video", "An hour with a consultant, at no charge"],
  ["Press", "press@pankajsoni.com", "Loans, interviews and imagery"],
];

const BOUTIQUES = [
  ["Mumbai", "Colaba Causeway", "The flagship"],
  ["New Delhi", "Chanakyapuri", "By appointment"],
  ["Paris", "Rue Saint-Honoré", "By appointment"],
  ["Milan", "Via Montenapoleone", "Tailoring atelier"],
  ["New York", "Madison Avenue", "By appointment"],
];

export default function ContactPage() {
  return (
    <>
      {/* hero */}
      <section className="mx-auto max-w-[1560px] px-5 pb-16 pt-40 sm:px-8 lg:pt-48">
        <Reveal>
          <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>
            Client Services
          </p>
        </Reveal>
        <MaskLines
          as="h1"
          className="ps-display mt-8 text-[2.8rem] leading-[1] sm:text-[5rem]"
          delay={150}
          lines={["Write to us,", <span key="i" className="ps-display-i">or come in.</span>]}
        />
      </section>

      <FillRule accent={false} duration={1600} />

      {/* channels + form */}
      <section className="mx-auto grid max-w-[1560px] gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-24 lg:py-28">
        <div className="grid content-start gap-10">
          {CHANNELS.map(([t, main, note], i) => (
            <Reveal key={t} delay={stagger(i)}>
              <div className="pt-5" style={{ borderTop: "1px solid var(--ps-line)" }}>
                <h2 className="ps-caps-lg">{t}</h2>
                <p className="ps-display mt-3 text-[1.5rem] leading-tight">{main}</p>
                <p className="mt-2 text-[.84rem] font-light" style={{ color: "var(--ps-muted)" }}>
                  {note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div>
          <MaskLines as="h2" className="ps-display ps-h2 mb-10" lines={["Send an enquiry"]} />
          <Reveal delay={150}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* boutiques */}
      <section className="ps-alt" style={{ borderTop: "1px solid var(--ps-line)" }}>
        <div className="mx-auto max-w-[1560px] px-5 py-24 sm:px-8">
          <MaskLines
            as="h2"
            className="ps-display ps-h2 mb-14"
            lines={["Five rooms,", <span key="i" className="ps-display-i">by appointment.</span>]}
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {BOUTIQUES.map(([city, street, note], i) => (
              <Reveal key={city} delay={stagger(i)}>
                <div className="pt-4" style={{ borderTop: "1px solid var(--ps-line-strong)" }}>
                  <p className="ps-display text-[1.5rem]">{city}</p>
                  <p className="mt-1.5 text-[.8rem] font-light" style={{ color: "var(--ps-muted)" }}>
                    {street}
                  </p>
                  <p className="ps-caps mt-3" style={{ fontSize: ".52rem", color: "var(--ps-faint)" }}>
                    {note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
