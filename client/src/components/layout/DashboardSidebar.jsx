import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DashboardSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const clientLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Catalog", to: "/properties" },
    { label: "My Applications", to: "/my-applications" },
    { label: "My Favorites", to: "/my-favorites" },
    { label: "Profile", to: "/profile" },
  ];

  const ownerLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Catalog", to: "/properties" },
    { label: "Add Property", to: "/properties/create" },
    { label: "My Properties", to: "/my-properties" },
    { label: "Applications", to: "/owner-applications" },
    { label: "Profile", to: "/profile" },
  ];

  const realtorLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Catalog", to: "/properties" },
    { label: "Profile", to: "/profile" },
  ];

  let links = [];

  if (user?.role === "client") links = clientLinks;
  if (user?.role === "owner") links = ownerLinks;
  if (user?.role === "realtor") links = realtorLinks;

  return (
    <Box
      sx={{
        width: 260,
        minHeight: "100vh",
        bgcolor: "#010440",
        color: "#fff",
        p: 3,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        EstateHub
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700 }}>{user?.name || "User"}</Typography>
        <Typography sx={{ fontSize: 14, opacity: 0.75 }}>
          {user?.role || "guest"}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.18)", mb: 2 }} />

      <List sx={{ flexGrow: 1 }}>
        {links.map((item) => (
          <ListItem key={item.to} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.to}
              sx={{
                borderRadius: 3,
                color: "#fff",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Button
        onClick={handleLogout}
        variant="contained"
        sx={{
          bgcolor: "#BF4124",
          "&:hover": { bgcolor: "#a23a20" },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

export default DashboardSidebar;