import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store";
import AppRouter from "@/pages/index.jsx"; // <--- THIS is the correct one

import "@/index.css"; // make sure global CSS is imported

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>
);
