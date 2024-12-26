import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import routers from "./routes/index.routes.jsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* cấu hình cũ
     <BrowserRouter>
      <App />
    </BrowserRouter> */}

    {/* cấu hình mới */}
    <RouterProvider router={routers}></RouterProvider>
  </StrictMode>
);
