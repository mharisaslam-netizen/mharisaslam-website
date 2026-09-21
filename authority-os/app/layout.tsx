import "./globals.css";

export const metadata = {
  title: "Haris Authority OS",
  description: "CEO-led authority orchestration across search, content, social distribution and analytics."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
