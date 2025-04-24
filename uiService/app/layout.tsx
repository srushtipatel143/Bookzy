'use client'
import "./globals.css";
import { SearchProvider } from "./components/context/searchContext";
import "bootstrap/dist/css/bootstrap.min.css";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Bookzy",
//   description:"Booking made easy",
//   icons: {
//     icon: '/booking_logo.png',
//   },
// };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/booking_logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bookzy</title>
      </head>
      <body>
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
