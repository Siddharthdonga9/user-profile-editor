import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import { Toast } from "@/components/toast";
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Profile Editor App",
  description: "A Next.js profile editor with public viewer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <div className="min-h-screen">
            <Navigation />
            <main>{children}</main>
          </div>
          <Toast />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
