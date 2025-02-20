import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Login from "../pages/Login";
import ErrorPage from "../pages/ErrorPage";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children: [
        {
            path: 'login',
            element: <Login></Login>
        }
      ],
      errorElement: <ErrorPage></ErrorPage>
    },
]);