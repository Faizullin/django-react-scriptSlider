import React from "react";
import { createBrowserRouter, Route, createRoutesFromElements, Link } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import ScriptIndex from "../pages/script";
import ScriptPresentation from "../pages/script/Presentation";

const router = createBrowserRouter([
    {
      path: "/auth/register",
      element: <Register />,
      handle: {
        crumb: () => <Link to="/script">Register</Link>,
      }
    },
    {
      path: "/auth/login",
      element: <Login />,
      handle: {
        crumb: () => <Link to="/script">Lgin</Link>,
      }
    },
    {
      path: "/script",
      element: <ProtectedRoute>
        <ScriptIndex />
      </ProtectedRoute>,
      handle: {
        crumb: () => <Link to="/script">Messages</Link>,
      }
    },
    {
      path: "/script/:scriptId/presentation/",
      element: <ProtectedRoute>
        <ScriptPresentation />
      </ProtectedRoute>,
      handle: {
        crumb: (data: any) => <span>{data.threadName}</span>,
      }
    },
    
]);
export default router;