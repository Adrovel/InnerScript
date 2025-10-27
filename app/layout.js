import { Domine, Inter } from "next/font/google";
import "./globals.css";

const domine = Domine({
  variable: "--font-domine",
  subsets: ["latin"],
  weight: "400"
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "400"
});

export const metadata = {
  title: "Inner Script",
  description: "A Journaling AI app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${domine.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
