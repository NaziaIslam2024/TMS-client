import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Login from "../pages/Login";
import ErrorPage from "../pages/ErrorPage";
// import Home from "../pages/Home";
import PrivateRoutes from "./PrivateRoutes";
import Homee from "../pages/Homee";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children: [
        {
            path: '/',
            element: <Login></Login>
        },
        {
            path: 'dashboard',
            element: <PrivateRoutes><Dashboard></Dashboard></PrivateRoutes>
        },
        {
            path: 'home',
            element: <PrivateRoutes><Homee></Homee></PrivateRoutes>
            // element: <PrivateRoutes><Home></Home></PrivateRoutes>
        }
      ],
      errorElement: <ErrorPage></ErrorPage>
    },
]);