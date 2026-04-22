import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import CreatePropertyPage from "./pages/CreatePropertyPage";
import MyPropertiesPage from "./pages/MyPropertiesPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import OwnerRoute from "./components/OwnerRoute";
import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import OwnerApplicationsPage from "./pages/OwnerApplicationsPage";
import ClientRoute from "./components/ClientRoute";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";
import MyFavoritesPage from "./pages/MyFavoritesPage";


function HomePage() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" mb={2}>
        EstateHub
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Button component={Link} to="/properties" variant="outlined">
          Catalog
        </Button>

        {!isAuthenticated && (
          <>
            <Button component={Link} to="/register" variant="contained">
              Register
            </Button>
            <Button component={Link} to="/login" variant="outlined">
              Login
            </Button>
          </>
        )}

        {isAuthenticated && (
  <>
  <Button component={Link} to="/dashboard" variant="contained">
  Dashboard
</Button>
    {user?.role === "owner" && (
      <>
        <Button component={Link} to="/properties/create" variant="contained">
          Add Property
        </Button>
        <Button component={Link} to="/my-properties" variant="outlined">
          My Properties
        </Button>
        <Button component={Link} to="/owner-applications" variant="outlined">
          Property Applications
        </Button>
      </>
    )}

    {user?.role === "client" && (
      <Button component={Link} to="/my-applications" variant="outlined">
        My Applications
      </Button>
    )}

    <Button variant="contained" color="error" onClick={logout}>
      Logout
    </Button>
  </>
)}

<Button component={Link} to="/about" variant="outlined">
  About Us
</Button>

<Button component={Link} to="/contacts" variant="outlined">
  Contacts
</Button>
      </Box>

      {isAuthenticated && (
        <Typography variant="h6">
          Ви увійшли як: {user?.name} ({user?.role})
        </Typography>
      )}
    </Box>
  );
}

function App() {
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;