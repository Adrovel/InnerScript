export const metadata = {
  title: "InnerScript",
  description: "Private writing storage foundation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
