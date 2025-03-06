import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Web3ProviderWrapper from "./components/Web3Provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TGTokenHub - Telegram Username Tokens",
  description:
    "Turn your Telegram username into a tradable token with social metrics and community-driven liquidity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Web3ProviderWrapper>
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            {children}
          </div>
        </Web3ProviderWrapper>
      </body>
    </html>
  );
}
