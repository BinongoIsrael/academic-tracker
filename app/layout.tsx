import type { Metadata } from "next";
import { Inter, Poppins, Roboto, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins',
  display: 'swap',
});

const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: '--font-roboto',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Gradient - Plan Smarter, Study Better, Grow Stronger",
  description: "Track grades, compute GPA/GWA, and predict scores needed to reach your goals. Personalized insights for academic success.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "bg-background",
        inter.variable,
        poppins.variable,
        roboto.variable,
        spaceGrotesk.variable,
        inter.className
      )}>
        {children}
      </body>
    </html>
  );
}
