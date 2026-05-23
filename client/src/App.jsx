// src/App.jsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import CreatePropertyPage from "./pages/CreatePropertyPage";
import MyPropertiesPage from "./pages/MyPropertiesPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import OwnerApplicationsPage from "./pages/OwnerApplicationsPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";
import MyFavoritesPage from "./pages/MyFavoritesPage";

import OwnerRoute from "./routes/OwnerRoute";
import ClientRoute from "./routes/ClientRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />

        <Route
          path="/properties/create"
          element={
            <OwnerRoute>
              <CreatePropertyPage />
            </OwnerRoute>
          }
        />
        <Route
          path="/my-properties"
          element={
            <OwnerRoute>
              <MyPropertiesPage />
            </OwnerRoute>
          }
        />
        <Route
          path="/properties/edit/:id"
          element={
            <OwnerRoute>
              <EditPropertyPage />
            </OwnerRoute>
          }
        />
        <Route path="/edit-property/:id" element={<EditPropertyPage />} />

        <Route
          path="/my-applications"
          element={
            <ClientRoute>
              <MyApplicationsPage />
            </ClientRoute>
          }
        />
        <Route
          path="/owner-applications"
          element={
            <OwnerRoute>
              <OwnerApplicationsPage />
            </OwnerRoute>
          }
        />
        <Route
          path="/my-favorites"
          element={
            <ClientRoute>
              <MyFavoritesPage />
            </ClientRoute>
          }
        />

        {/* ── Aliases / backward-compatibility redirects ── */}
        <Route path="/client/favorites"    element={<Navigate to="/my-favorites"    replace />} />
        <Route path="/client/applications" element={<Navigate to="/my-applications" replace />} />
        <Route path="/client/profile"      element={<Navigate to="/profile"         replace />} />
      </Routes>
    </BrowserRouter>
  );
}