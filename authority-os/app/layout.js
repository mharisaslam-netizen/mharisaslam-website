export const metadata = {
  title: "Haris Authority OS",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
