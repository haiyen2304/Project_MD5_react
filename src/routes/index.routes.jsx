import { createBrowserRouter } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import NotFoundpage from "../pages/shared";

const merger = [
  ...PrivateRoutes,
  ...PublicRoutes,
  { path: "*", element: <NotFoundpage /> },
];

const routers = createBrowserRouter(merger);
export default routers;
