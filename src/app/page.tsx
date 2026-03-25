import { NenkinCalculator } from "@/components/NenkinCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <NenkinCalculator />
    </>
  );
}
