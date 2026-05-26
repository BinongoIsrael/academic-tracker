import type { Metadata } from "next";
import { Inter, Poppins, Roboto, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import NextTopLoader from "nextjs-toploader";

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "bg-background",
        inter.variable,
        poppins.variable,
        roboto.variable,
        spaceGrotesk.variable,
        inter.className
      )}>
        <NextTopLoader 
          color="hsl(var(--primary))"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
