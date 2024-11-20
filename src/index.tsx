import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PrimeReactProvider } from "primereact/api";
import "./global.css";
// import "primeicons/primeicons.css";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <PrimeReactProvider value={{ unstyled: false }}>
        <App />
      </PrimeReactProvider>
    </React.StrictMode>
  );
}
