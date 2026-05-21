import ReactDOM from "react-dom/client";
import "./index.css";
// @ts-ignore: App is a JS module without TypeScript declarations
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
