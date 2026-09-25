"use client";

import { useState, type FormEvent } from "react";

const TOPICS = ["Private appointment", "An order", "Alterations & restoration", "Press", "Something else"];

/**
 * SCAFFOLD — nothing is sent anywhere yet. Submitting validates, shows the
 * confirmation, and stops. Wire `onSubmit` to the real endpoint (email
 * service, CRM, or a route handler) before launch.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="py-10">
        <p className="ps-display text-[2rem] leading-tight">Thank you.</p>
        <p className="mt-4 max-w-[44ch] text-[.9rem] font-light leading-relaxed" style={{ color: "var(--ps-muted)" }}>
          A member of Client Services will reply within one working day.
        </p>
        <button type="button" className="ps-btn mt-10" onClick={() => setSent(false)}>
          <span>Send another</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
      <label>
        <span className="sr-only">First name</span>
        <input className="ps-field" name="first" placeholder="First name" autoComplete="given-name" required />
      </label>
      <label>
        <span className="sr-only">Last name</span>
        <input className="ps-field" name="last" placeholder="Last name" autoComplete="family-name" required />
      </label>
      <label>
        <span className="sr-only">Email address</span>
        <input className="ps-field" name="email" type="email" placeholder="Email address" autoComplete="email" required />
      </label>
      <label>
        <span className="sr-only">Phone (optional)</span>
        <input className="ps-field" name="phone" type="tel" placeholder="Phone (optional)" autoComplete="tel" />
      </label>
      <label className="sm:col-span-2">
        <span className="sr-only">Topic</span>
        <select className="ps-field cursor-pointer" name="topic" defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => (
            <option key={t} value={t} style={{ background: "var(--ps-surface)", color: "var(--ps-text)" }}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="sr-only">Message</span>
        <textarea className="ps-field min-h-[140px] resize-y" name="message" placeholder="Message" required />
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="ps-btn ps-btn-solid mt-4">
          <span>Send Enquiry</span>
        </button>
      </div>
    </form>
  );
}
