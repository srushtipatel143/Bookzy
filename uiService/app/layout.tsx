'use client'
import "./globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { SearchProvider } from "@/components/context/searchContext";
import { Provider } from "react-redux";
import { store } from "@/store";
import { CityProvider } from "@/components/context/cityContext";
import { UserProvider } from "@/components/context/userContext";

import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                <ToastContainer position="top-right" autoClose={3000} />
              </SearchProvider>
            </Provider>
          </UserProvider>
        </CityProvider>
      </body>
    </html>
  );
}