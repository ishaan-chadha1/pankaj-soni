import type { Metadata } from "next";
import BagView from "./BagView";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the pieces in your bag before checkout.",
  alternates: { canonical: "/bag" },
  robots: { index: false, follow: true },
};

export default function BagPage() {
  return <BagView />;
}
