import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import { twMerge } from "tailwind-merge";
import "./global.css";
// import "primeicons/primeicons.css";

const primeReactProviderValue = {
  unstyled: true,
  pt: Tailwind,
  ptOptions: {
    mergeSections: true,
    mergeProps: true,
    classNameMergeFunction: twMerge,
  },
};

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <PrimeReactProvider value={primeReactProviderValue}>
        <App />
      </PrimeReactProvider>
    </React.StrictMode>
  );
}
