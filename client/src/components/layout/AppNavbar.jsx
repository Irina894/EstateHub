// src/components/layout/AppNavbar.jsx
import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Box, Button, IconButton,
  Avatar, Menu, MenuItem, Divider, Typography,
  Drawer, List, ListItemButton, ListItemText,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Menu as MenuIcon, X, Building2, LayoutDashboard,
  ClipboardList, Heart, User, LogOut, ChevronDown,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import useTokens from "../../hooks/useTokens";

/* ── Logo (reusable) ───────────────────────────────────────────────────── */
export function BrandLogo({ size = "md", to = "/" }) {
  const theme  = useTheme();
  const tokens = useTokens();

  const cfg = size === "sm"
    ? { box: 32, icon: 16, fontSize: "1rem" }
    : { box: 36, icon: 18, fontSize: "1.1rem" };

  return (
    <Box
      component={Link}
      to={to}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        textDecoration: "none",
        transition: `transform 0.2s ${tokens.ease.out}`,
        "&:hover": { transform: "translateY(-1px)" },
      }}
    >
      <Box
        sx={{
          width: cfg.box,
          height: cfg.box,
          borderRadius: `${tokens.radius.sm}px`,
          background: tokens.gradient.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: tokens.shadow.accent,
        }}
      >
        <Building2 size={cfg.icon} color="#fff" strokeWidth={2.2} />
      </Box>
      <Typography
        sx={{
          color: "text.primary",
          fontWeight: 800,
          fontSize: cfg.fontSize,
          letterSpacing: "-0.025em",
          fontFamily: '"Sora",sans-serif',
        }}
      >
        Estate<Box component="span" sx={{ color: "primary.main" }}>Hub</Box>
      </Typography>
    </Box>
  );
}

/* ── Nav config ────────────────────────────────────────────────────────── */
const PUBLIC_NAV = [
  { label: "Catalog",  to: "/properties" },
  { label: "About",    to: "/about" },
  { label: "Contacts", to: "/contacts" },
];

const CLIENT_NAV = [
  { label: "Dashboard",       to: "/dashboard",       icon: <LayoutDashboard size={14} /> },
  { label: "My Applications", to: "/my-applications", icon: <ClipboardList   size={14} /> },
  { label: "My Favorites",    to: "/my-favorites",    icon: <Heart           size={14} /> },
];

const OWNER_NAV = [
  { label: "Dashboard",     to: "/dashboard",            icon: <LayoutDashboard size={14} /> },
  { label: "My Properties", to: "/my-properties",        icon: <Building2       size={14} /> },
  { label: "Applications",  to: "/owner-applications",   icon: <ClipboardList   size={14} /> },
];

/* ════════════════════════════════════════════════════════════════════════ */
export default function AppNavbar() {
  const theme  = useTheme();
  const tokens = useTokens();
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [anchor,  setAnchor]  = useState(null);
  const [drawer,  setDrawer]  = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isActive = (p) => location.pathname === p;
  const handleLogout = () => { setAnchor(null); logout(); navigate("/"); };

  const roleNav =
    user?.role === "client" ? CLIENT_NAV :
    user?.role === "owner"  ? OWNER_NAV  : [];

  /* ── link style ── */
  const lsx = (path) => ({
    color: isActive(path) ? theme.palette.primary.main : theme.palette.text.secondary,
    fontWeight: isActive(path) ? 700 : 500,
    fontSize: "0.875rem",
    px: 1.4, py: 0.7,
    borderRadius: "10px",
    transition: `all 0.18s ${tokens.ease.out}`,
    "&:hover": {
      color: theme.palette.text.primary,
      bgcolor: alpha(theme.palette.text.primary, 0.05),
    },
  });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.82)",
          backdropFilter: "blur(18px) saturate(180%)",
          WebkitBackdropFilter: "blur(18px) saturate(180%)",
          borderBottom: scrolled
            ? `1px solid ${alpha(theme.palette.text.primary, 0.1)}`
            : `1px solid ${alpha(theme.palette.text.primary, 0.06)}`,
          transition: `all 0.25s ${tokens.ease.out}`,
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 60, md: 68 }, px: { xs: 2, md: 5 } }}>
          <Box sx={{ mr: { md: 5 } }}>
            <BrandLogo />
          </Box>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5, flexGrow: 1 }}>
            {PUBLIC_NAV.map((l) => (
              <Button key={l.to} component={Link} to={l.to} sx={lsx(l.to)} disableRipple>
                {l.label}
              </Button>
            ))}
          </Box>

          {/* Desktop right */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
            {!user ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  Login
                </Button>
                <Button component={Link} to="/register" variant="contained" color="primary" size="small">
                  Get Started
                </Button>
              </>
            ) : (
              <>
                {roleNav.map((l) => (
                  <Button key={l.to} component={Link} to={l.to} sx={lsx(l.to)} startIcon={l.icon}>
                    {l.label}
                  </Button>
                ))}

                {/* avatar pill */}
                <Box
                  onClick={(e) => setAnchor(e.currentTarget)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: 1.2,
                    py: 0.6,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: alpha(theme.palette.text.primary, 0.04),
                    cursor: "pointer",
                    transition: `all 0.18s ${tokens.ease.out}`,
                    "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.07) },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 28, height: 28,
                      background: tokens.gradient.accent,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Typography sx={{ color: "text.primary", fontSize: "0.82rem", fontWeight: 600 }}>
                    {user.name?.split(" ")[0]}
                  </Typography>
                  <ChevronDown size={13} color={theme.palette.text.disabled} />
                </Box>

                <Menu
                  anchorEl={anchor}
                  open={Boolean(anchor)}
                  onClose={() => setAnchor(null)}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 220,
                      borderRadius: `${tokens.radius.md}px`,
                      boxShadow: tokens.shadow.lg,
                      border: "1px solid",
                      borderColor: "divider",
                      "& .MuiMenuItem-root": {
                        px: 2,
                        py: 1.1,
                        fontSize: "0.875rem",
                        gap: 1.4,
                        borderRadius: "8px",
                        mx: 0.5,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={() => { setAnchor(null); navigate("/profile"); }}>
                    <User size={14} color={theme.palette.text.secondary} /> Profile
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: `${theme.palette.primary.main} !important` }}>
                    <LogOut size={14} /> Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* Mobile hamburger */}
          <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
            <IconButton
              onClick={() => setDrawer(true)}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "10px",
                p: 0.8,
                color: "text.primary",
              }}
            >
              <MenuIcon size={19} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawer}
        onClose={() => setDrawer(false)}
        PaperProps={{
          sx: {
            width: 290,
            bgcolor: "background.paper",
            borderLeft: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BrandLogo size="sm" />
          <IconButton onClick={() => setDrawer(false)} sx={{ color: "text.secondary", p: 0.5 }}>
            <X size={19} />
          </IconButton>
        </Box>

        <List sx={{ px: 1.5 }}>
          {PUBLIC_NAV.map((l) => (
            <ListItemButton
              key={l.to}
              component={Link}
              to={l.to}
              onClick={() => setDrawer(false)}
              selected={isActive(l.to)}
              sx={{
                borderRadius: "10px",
                mb: 0.3,
                color: "text.secondary",
                "&.Mui-selected": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: "primary.main",
                },
                "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.04) },
              }}
            >
              <ListItemText primary={l.label} primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
            </ListItemButton>
          ))}

          {roleNav.length > 0 && (
            <>
              <Divider sx={{ my: 1.5 }} />
              {roleNav.map((l) => (
                <ListItemButton
                  key={l.to}
                  component={Link}
                  to={l.to}
                  onClick={() => setDrawer(false)}
                  selected={isActive(l.to)}
                  sx={{
                    borderRadius: "10px",
                    mb: 0.3,
                    color: "text.secondary",
                    gap: 1.2,
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: "primary.main",
                    },
                    "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.04) },
                  }}
                >
                  <Box sx={{ color: theme.palette.primary.main, display: "flex" }}>{l.icon}</Box>
                  <ListItemText primary={l.label} primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
                </ListItemButton>
              ))}
            </>
          )}

          <Divider sx={{ my: 1.5 }} />
          {!user ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                fullWidth
                component={Link}
                to="/login"
                onClick={() => setDrawer(false)}
                variant="outlined"
              >
                Login
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                component={Link}
                to="/register"
                onClick={() => setDrawer(false)}
              >
                Get Started
              </Button>
            </Box>
          ) : (
            <>
              <ListItemButton
                component={Link}
                to="/profile"
                onClick={() => setDrawer(false)}
                sx={{ borderRadius: "10px", color: "text.secondary", gap: 1.2, mb: 0.3 }}
              >
                <User size={14} color={theme.palette.text.secondary} />
                <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
              </ListItemButton>
              <ListItemButton
                onClick={() => { setDrawer(false); handleLogout(); }}
                sx={{ borderRadius: "10px", color: "primary.main", gap: 1.2 }}
              >
                <LogOut size={14} />
                <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}