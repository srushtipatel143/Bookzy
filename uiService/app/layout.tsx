'use client'
import "./globals.css";
import { SearchProvider } from "./components/context/searchContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { CityProvider } from "./components/context/cityContext";
import { UserProvider } from "./components/context/userContext";


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
        <CityProvider>
          <UserProvider>
            <Provider store={store}>
              <SearchProvider>
                {children}
              </SearchProvider>
            </Provider>
          </UserProvider>
        </CityProvider>
      </body>
    </html>
  );
}
