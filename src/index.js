import React from "react";
import { createRoot } from "react-dom/client";
// import ReactDOM from "react-dom/client";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import {GlobalProvider} from "./context/GlobalContext.js";
// import styles
import "./styles/AppLayout.scss";
import "./styles/UI.scss";


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// const root = createRoot(document.getElementById("root"));

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <GlobalProvider>
//         <App />
//       </GlobalProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
