import React from "react";
import LoadLazy from "../layouts/shared/LoadLazy";
// import Profile from "../pages/user/profile/Profile";
// import HomeNewsFeed from "../pages/user/home/HomeNewsFeed";
// import Verify from "../pages/user/verify/Verify";
// import Login from "../pages/user/login";
// import Register from "../pages/user/register";

const Login = React.lazy(() => import("../pages/user/login"));
const Register = React.lazy(() => import("../pages/user/register"));
const Verify = React.lazy(() => import("../pages/user/verify/Verify"));

const PublicRoutes = [
  { path: "/login", element: <LoadLazy children={<Login />} /> },
  { path: "/register", element: <LoadLazy children={<Register />} /> },
  { path: "/verify", element: <LoadLazy children={<Verify />} /> },
];
export default PublicRoutes;
