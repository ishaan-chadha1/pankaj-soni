import type { Metadata } from "next";
import { MaskLines, Reveal } from "../components/Reveal";
import { Monogram } from "../components/Brand";
import { photo, photoSet } from "@/lib/photos";
import { stagger } from "@/lib/motion";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact the Maison",
  description:
    "Contact PANKAJ SONI Client Services — private appointments, orders, alterations and press.",
  alternates: { canonical: "/contact" },
};

/*
 * CONTACT, set like the About page: a centred headline over one wide plate,
 * the ways in, the enquiry beside a portrait, the appointment on ink, and the
 * rooms.
 *
 * PLACEHOLDER numbers, addresses and email — and the form does not send yet
 * (see ContactForm).
 */

const CHANNELS = [
  { n: "I", t: "Client Services", main: "+91 22 0000 0000", note: "Monday to Saturday, 10:00 – 19:00 IST" },
  { n: "II", t: "Email", main: "care@pankajsoni.com", note: "A reply within one working day" },
  { n: "III", t: "Appointments", main: "In a room or by video", note: "An hour with a consultant, at no charge" },
  { n: "IV", t: "Press", main: "press@pankajsoni.com", note: "Loans, interviews and imagery" },
];

const STEPS = [
  { n: "I", t: "Choose a room", d: "Any of the five, or a video call from wherever you are." },
  { n: "II", t: "Meet your consultant", d: "An hour, unhurried, with the pieces brought out for you." },
  { n: "III", t: "The fitting", d: "Measured by the tailors who will make it. Three fittings on every occasion piece." },
];

const ROOMS = [
  { city: "Mumbai", street: "Colaba Causeway", note: "The flagship", plate: "orbit-02" },
  { city: "New Delhi", street: "Chanakyapuri", note: "By appointment", plate: "noir-vine-01" },
  { city: "Paris", street: "Rue Saint-Honoré", note: "By appointment", plate: "vapour-gown-01" },
  { city: "Milan", street: "Via Montenapoleone", note: "Tailoring atelier", plate: "silver-seam-01" },
  { city: "New York", street: "Madison Avenue", note: "By appointment", plate: "nocturne-gown-01" },
];

function Plate({ slug, sizes, className = "", focus }: { slug: string; sizes: string; className?: string; focus?: string }) {
  return (
    <div className={`ps-media ${className}`}>
      <img
        src={photo(slug)}
        srcSet={photoSet(slug)}
        sizes={sizes}
        alt=""
        loading="lazy"
        decoding="async"
        style={focus ? { objectPosition: focus } : undefined}
      />
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* hero — centred headline over one wide plate */}
      <section className="pt-20 sm:pt-28">
        <div className="mx-auto max-w-[1560px] px-5 text-center sm:px-8">
          <Reveal>
            <p className="ps-caps" style={{ color: "var(--ps-muted)" }}>Client Services</p>
          </Reveal>
          <MaskLines
            as="h1"
            className="ps-display mt-8 text-[2.3rem] uppercase leading-[1.02] sm:text-[5.6rem]"
            delay={120}
            lines={[
              <span key="a"><span className="ps-display-i normal-case">write</span> to us,</span>,
              <span key="b"><span className="ps-display-i normal-case">or</span> come in.</span>,
            ]}
          />
        </div>
        <Reveal delay={200} className="mx-auto mt-14 max-w-[1560px] px-5 sm:mt-20 sm:px-8">
          <Plate slug="swirl-shirt-01" sizes="96vw" className="aspect-[4/5] sm:aspect-[16/8]" focus="50% 12%" />
        </Reveal>
      </section>

      {/* the ways in */}
      <section className="ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <MaskLines
            as="h2"
            className="ps-display text-center text-[2.4rem] uppercase leading-none sm:text-[4.2rem]"
            lines={[<span key="a"><span className="ps-display-i normal-case">the</span> Ways In</span>]}
          />
          <div className="mt-14 grid gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {CHANNELS.map((c, i) => (
              <Reveal key={c.t} delay={stagger(i)} className="border-[var(--ps-line)] px-6 text-center sm:[&:nth-child(even)]:border-l lg:border-l lg:first:border-l-0">
                <div>
                  <p className="ps-caps" style={{ fontSize: ".6rem", color: "var(--ps-muted)" }}>{c.n}.</p>
                  <h3 className="ps-caps-lg mt-3">{c.t}</h3>
                  <p className="ps-display mt-4 text-[1.45rem] leading-tight">{c.main}</p>
                  <p className="mt-2 text-[.84rem] font-light" style={{ color: "var(--ps-muted)" }}>{c.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* enquiry — portrait beside the form */}
      <section id="enquire" className="ps-alt ps-band-l scroll-mt-24">
        <div className="mx-auto grid max-w-[1560px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <Reveal>
              <Plate slug="zip-jumpsuit-01" sizes="44vw" className="aspect-[4/5]" focus="50% 20%" />
            </Reveal>
          </div>
          <div className="lg:py-6">
            <Reveal>
              <p className="ps-caps" style={{ color: "var(--ps-muted)" }}>1.</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="ps-display mt-6 text-[2.4rem] leading-[1.02] sm:text-[3.6rem]"
              lines={[
                <span key="a"><span className="ps-display-i">Send an</span> ENQUIRY.</span>,
              ]}
            />
            <Reveal delay={120}>
              <p className="mt-6 max-w-[48ch] text-[.95rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
                An order, an alteration, a piece you saw and cannot stop thinking about. Tell us, and a member of
                Client Services will write back within one working day.
              </p>
            </Reveal>
            <Reveal delay={200} className="mt-12">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* private appointment — on ink */}
      <section className="ps-invert ps-band-l">
        <div className="mx-auto grid max-w-[1560px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div>
            <Reveal>
              <p className="ps-caps" style={{ color: "var(--ps-accent)" }}>2.</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="ps-display mt-6 text-[2.4rem] leading-[1.02] sm:text-[3.6rem]"
              lines={[
                <span key="a"><span className="ps-display-i">The</span> PRIVATE</span>,
                "APPOINTMENT.",
              ]}
            />
            <ol className="mt-12 grid gap-8">
              {STEPS.map((s, i) => (
                <Reveal key={s.t} delay={stagger(i)}>
                  <li className="grid grid-cols-[3rem_1fr] gap-4 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,.14)" }}>
                    <span className="ps-display-i text-[1.4rem]" style={{ color: "var(--ps-accent)" }}>{s.n}</span>
                    <div>
                      <h3 className="ps-display text-[1.5rem] leading-tight">{s.t}</h3>
                      <p className="mt-2 max-w-[46ch] text-[.88rem] font-light leading-relaxed" style={{ opacity: 0.7 }}>{s.d}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={300} className="mt-12">
              <a href="#enquire" className="ps-btn">
                <span>Request an Appointment</span>
              </a>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <Plate slug="pinstripe-02" sizes="(max-width: 1023px) 92vw, 44vw" className="aspect-[4/5]" focus="50% 30%" />
          </Reveal>
        </div>
      </section>

      {/* the rooms */}
      <section className="ps-band-l">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
          <MaskLines
            as="h2"
            className="ps-display text-center text-[2.4rem] leading-[1.02] sm:text-[4.2rem]"
            lines={[
              <span key="a">FIVE ROOMS,</span>,
              <span key="b" className="ps-display-i">by appointment.</span>,
            ]}
          />
          <div className="ps-rooms-row mt-14 lg:mt-20">
            {ROOMS.map((r, i) => (
              <Reveal key={r.city} delay={stagger(i)}>
                <Plate slug={r.plate} sizes="(max-width: 1023px) 62vw, 19vw" className="aspect-[3/4]" />
                <p className="ps-caps mt-5" style={{ fontSize: ".6rem", color: "var(--ps-muted)" }}>{r.note}</p>
                <p className="ps-display mt-2 text-[1.6rem] uppercase leading-none">{r.city}</p>
                <p className="mt-2 text-[.82rem] font-light" style={{ color: "var(--ps-muted)" }}>{r.street}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* sign-off */}
      <section className="ps-band pt-0 text-center">
        <Reveal>
          <Monogram className="mx-auto h-14 w-auto" />
          <p className="ps-display-i mt-6 text-[1.4rem]">We would be honoured to hear from you.</p>
        </Reveal>
      </section>
    </>
  );
}
