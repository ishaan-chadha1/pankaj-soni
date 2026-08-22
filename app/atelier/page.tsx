import type { Metadata } from "next";
import Engine from "./Engine";

export const metadata: Metadata = {
  title: "The Cloth Room",
  description:
    "Specify a cloth from a fibre, a weave and a finish, and watch it render in real time — an interactive instrument from the house of PANKAJ SONI.",
  alternates: { canonical: "/atelier" },
};

export default function AtelierPage() {
  return <Engine />;
}
