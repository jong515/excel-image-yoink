import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Excel Image Extractor",
  description: "Extract and download images from Excel spreadsheets with proper labeling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
