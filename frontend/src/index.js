import App from "./App.jsx";
import "./index.css";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";

import "./services/i18n.js";  // Importáljuk az i18n konfigurációt

import TimeAgo from "javascript-time-ago";
import hu from "javascript-time-ago/locale/hu";
import en from "javascript-time-ago/locale/en";

// Importáljuk az i18n-t, hogy nyelvváltáskor frissíthessük a TimeAgo nyelvet
import i18n from "i18next";

const AppWrapper = () => {
    const language = localStorage.getItem("language") || "hu";
    const selectedLocale = language === "hu" ? hu : en;

    // Állítsuk be a TimeAgo kezdő nyelvét
    TimeAgo.addDefaultLocale(selectedLocale);

    useEffect(() => {
        // Figyeljük az i18n nyelvváltást
        i18n.on("languageChanged", (lng) => {
            const newLocale = lng === "hu" ? hu : en;
            TimeAgo.addDefaultLocale(newLocale);
        });

        // Takarítás, ha az alkalmazás elhagyja a nyelvi változást
        return () => {
            i18n.off("languageChanged");
        };
    }, []);

    return (
        <StrictMode>
            <AuthProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AuthProvider>
        </StrictMode>
    );
};

createRoot(document.getElementById("root")).render(<AppWrapper />);
