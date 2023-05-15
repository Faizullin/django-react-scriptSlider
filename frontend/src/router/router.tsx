import React from "react";
import { createBrowserRouter, Route, createRoutesFromElements, Link } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import ScriptIndex from "../pages/script";
import ScriptPresentation from "../pages/script/Presentation";
import About from "../pages/About";
import ForgotPassword from '../pages/auth/ForgotPassword';
import ForgotPasswordConfirm from "../pages/auth/ForgotPasswordConfirm";
import ProfileIndex from "../pages/profile";
import ProfileEdit from "../pages/profile/ProfileEdit";

const router = createBrowserRouter([
    {
      path: "/",
      handle: {
        crumb: () => <Link to="/">Home</Link>,
      },
      children: [
        {
          path: "/",
          element: <About />,
          handle: {},
        },
        {
          path: "/script",
          handle: {},
          children: [
            {
              path: "",
              element: (
                <ProtectedRoute>
                  <ScriptIndex />
                </ProtectedRoute>
              ),
              handle: {
                crumb: () => <span> Script </span>,
              }
            },
            {
              path: ":scriptId/presentation",
              element: (
                <ProtectedRoute>
                  <ScriptPresentation />
                </ProtectedRoute>
              ),
              handle: {
                crumb: () => <span> Presentation </span>,
              }
            },
          ]
        },
        {
          path: "/auth",
          children: [
            {
              path: "register",
              element: <Register />,
            },
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "forgot_password",
              element: <ForgotPassword />,
            },
            {
              path: "password_reset/confirm",
              element: <ForgotPasswordConfirm />,
            },
          ]
        },
        {
          path: "/profile",
          children: [
            {
              path: "",
              element: (
                <ProtectedRoute>
                  <ProfileIndex />
                </ProtectedRoute>
              ),
            },
            {
              path: "edit",
              element: (
                <ProtectedRoute>
                  <ProfileEdit />
                </ProtectedRoute>
              ),
            },
          ]
        },
      ]
    },
    
],);
export default router;