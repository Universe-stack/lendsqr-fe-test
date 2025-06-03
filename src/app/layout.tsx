import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Lendsqr Assessment",
  description: "Lendsqr Assessment Dashboard",
  icons: {
    icon: '/lendsqr-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/lendsqr-logo.svg" />
      </head>
      <body className={workSans.variable}>
        {children}
      </body>
    </html>
  );
}
