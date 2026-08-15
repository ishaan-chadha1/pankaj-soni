import type { Metadata } from "next";
import Engine from "./Engine";

export const metadata: Metadata = {
  title: "The Olfactory Engine",
  description:
    "Compose a fragrance from a top, a heart and a base, and watch it render in real time — an interactive instrument from the house of PANKAJ SONI.",
  alternates: { canonical: "/atelier" },
};

export default function AtelierPage() {
  return <Engine />;
}
