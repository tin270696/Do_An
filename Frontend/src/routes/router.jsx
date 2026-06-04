import { createBrowserRouter } from "react-router-dom";

import GuestRoute from "@/routes/guest-route";
import ProtectedRoute from "@/routes/protected-route";

import AuthLayout from "@/layouts/auth-layout";
import SongsLayout from "@/layouts/songs-layout";

import HomePage from "@/pages/home-page";
import LoginPage from "@/pages/auth/login-page";
import RegisterPage from "@/pages/auth/register-page";
import ProfilePage from "@/pages/auth/profile-page";
import SongsPage from "@/pages/songs-page";
import NotFoundPage from "@/pages/not-found-page";
import SongDetailPage from "@/pages/song-detail-page";

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />
          },
          {
            path: "/register",
            element: <RegisterPage />
          }
        ]
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/profile",
            element: <ProfilePage />
          },
        ],
      },
      {
        element: <SongsLayout />,
        children: [
          {
            path: "/songs",
            element: <SongsPage />
          },
          {
            path: "/songs/:id",
            element: <SongDetailPage />
          }
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;