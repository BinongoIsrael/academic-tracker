import GWACalculatorClient from "./GWACalculatorClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculate | Gradient",
};

export default function GWACalculator() {
  return <GWACalculatorClient />;
}
