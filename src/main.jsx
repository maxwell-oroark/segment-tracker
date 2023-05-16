import React from "react";
import ReactDOM from "react-dom/client";
import { StoreContextProvider } from "./store/StoreContext.jsx";
import App from "./App.jsx";
import "antd/dist/reset.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </React.StrictMode>
);
