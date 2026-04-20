import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نافِس — المنافسة تصنع أفضل سعر",
  description: "منصة المزادات الحية لربط المستقلين برؤوس الأموال والمشاريع — Egypt & Gulf",
  keywords: ["عمل حر", "مزاد", "مستقلين", "مشاريع", "nafis", "نافس"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        {/* Cairo — primary brand font (Arabic-first) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Noto+Sans+Arabic:wght@300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols for icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body 
        className="min-h-full flex flex-col bg-white text-ink" 
        style={{ fontFamily: "'Cairo', 'Noto Sans Arabic', sans-serif" }}
        suppressHydrationWarning
      >
        {children}
        <Toaster dir="rtl" position="top-center" richColors />
      </body>
    </html>
  );
}

import { Toaster } from 'sonner';
