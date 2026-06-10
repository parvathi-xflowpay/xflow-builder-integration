import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'xflow-builder-repro',
  description: 'Minimal Builder.io reproduction for xflow-web',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
