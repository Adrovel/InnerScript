import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./(providers)/providers";


const playfair_display = Playfair_Display({
  variable: "--font-playfair_display",
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
        className={`${playfair_display.variable} ${inter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
