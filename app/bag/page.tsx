import type { Metadata } from "next";
import BagView from "./BagView";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the pieces in your bag before checkout.",
};

export default function BagPage() {
  return <BagView />;
}
