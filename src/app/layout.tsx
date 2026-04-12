import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { generatePMCSEO } from "@/lib/seo";
import { NoticeModal } from "@/components/ui/NoticeModal";
import { getActivePopups } from "@/lib/links";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = generatePMCSEO({});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activePopups = await getActivePopups();

  return (
    <html lang="pt-BR">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <NoticeModal notices={activePopups} />
      </body>
    </html>
  );
}
