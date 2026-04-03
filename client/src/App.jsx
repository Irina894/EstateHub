import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import CreatePropertyPage from "./pages/CreatePropertyPage";
import MyPropertiesPage from "./pages/MyPropertiesPage";

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
            {user?.role === "owner" && (
              <>
                <Button component={Link} to="/properties/create" variant="contained">
                  Add Property
                </Button>
                <Button component={Link} to="/my-properties" variant="outlined">
                  My Properties
                </Button>
              </>
            )}

            <Button variant="contained" color="error" onClick={logout}>
              Logout
            </Button>
          </>
        )}
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
<Route path="/properties/create" element={<CreatePropertyPage />} />
<Route path="/my-properties" element={<MyPropertiesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;