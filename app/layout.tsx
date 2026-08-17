import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Maison Navalha Barbearia",
    template: "%s | Maison Navalha",
  },
  description:
    "Barbearia premium em São Paulo. Cortes, barba e experiências exclusivas para o homem contemporâneo.",
  keywords: [
    "barbearia",
    "barbearia premium",
    "corte masculino",
    "barba",
    "barbearia em São Paulo",
    "Maison Navalha",
  ],
  authors: [
    {
      name: "Maison Navalha",
    },
  ],
  openGraph: {
    title: "Maison Navalha Barbearia",
    description:
      "Cortes, barba e experiências exclusivas para o homem contemporâneo.",
    type: "website",
    locale: "pt_BR",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}