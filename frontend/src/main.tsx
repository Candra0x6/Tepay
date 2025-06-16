import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import App from "./App";
import { ActorProvider, AgentProvider } from "@ic-reactor/react";
import { canisterId, idlFactory } from "../../src/declarations/backend"
import '@react-pdf-viewer/core/lib/styles/index.css';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AgentProvider withProcessEnv>
      <ActorProvider idlFactory={idlFactory} canisterId={canisterId}>
        <App />
      </ActorProvider>
    </AgentProvider>
  </React.StrictMode>
);
