// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiProviderWrapper } from "../providers/WagmiProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blockchain Racer",
  description: "Race, bet, win on Somnia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProviderWrapper>
          {children}
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}