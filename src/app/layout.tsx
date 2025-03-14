import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoreLabNotes",
  description: "Aplicativo web CoreaLabNotes, desenvolvido com Next.js 15, TypeScript e SASS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
