import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

import { LanguageProvider } from "../lib/i18n/LanguageContext";

export const metadata: Metadata = {
  title: "NutriLife – Your Healthy Diet Companion",
  description: "Track meals, recipes, progress, and more",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
          <link href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet" />
          <script dangerouslySetInnerHTML={{ __html: `
            if (localStorage.getItem('nutrilife_dark') === 'true') {
              document.documentElement.classList.add('dark-mode');
              /* Fallback for body in case CSS targets body */
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => document.body.classList.add('dark-mode'));
              } else {
                document.body.classList.add('dark-mode');
              }
            }
          `}} />
          <Analytics />
        </head>
        <body>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

;