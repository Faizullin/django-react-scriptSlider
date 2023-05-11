import React from "react";
import { createBrowserRouter, Route, createRoutesFromElements } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import ScriptIndex from "../pages/script";
import ScriptPresentation from "../pages/script/Presentation";

const router = createBrowserRouter([
    {
      path: "/auth/register",
      element: <Register />,
    },
    {
      path: "/auth/login",
      element: <Login />,
    },
    {
      path: "/script",
      element: <ProtectedRoute>
        <ScriptIndex />
      </ProtectedRoute>
    },
    {
      path: "/script/:scriptId/presentation/",
      element: <ProtectedRoute>
        <ScriptPresentation />
      </ProtectedRoute>,
    },
    
]);
export default router;