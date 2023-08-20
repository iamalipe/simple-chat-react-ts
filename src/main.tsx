import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import "./styles/customToast.css";
import { BrowserRouter } from "react-router-dom";
import { ImageKitProvider, RealmAppProvider } from "./state";
import { atlasConfig } from "./config/atlasConfig.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RealmAppProvider appId={atlasConfig.appId}>
    <BrowserRouter>
      <ImageKitProvider>
        <App />
      </ImageKitProvider>
    </BrowserRouter>
  </RealmAppProvider>
);
