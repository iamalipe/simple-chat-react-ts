import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import "./styles/customToast.css";
import { BrowserRouter } from "react-router-dom";
import {
  GlobalStateProvider,
  ImageKitProvider,
  RealmAppProvider,
} from "./state";
import { atlasConfig } from "./config/atlasConfig.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RealmAppProvider appId={atlasConfig.appId}>
      <GlobalStateProvider>
        <BrowserRouter>
          <ImageKitProvider>
            <App />
          </ImageKitProvider>
        </BrowserRouter>
      </GlobalStateProvider>
    </RealmAppProvider>
  </React.StrictMode>
);
