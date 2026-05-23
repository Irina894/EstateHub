// src/pages/LoginPage.jsx
import React, { useState } from "react";
import {
  Alert, Box, Button, IconButton, InputAdornment, Snackbar,
  TextField, Typography,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Building2, Sparkles,
  ShieldCheck, TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import useTokens from "../hooks/useTokens";

export default function LoginPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(formData);
      login(data.user, data.token);
      setSuccessOpen(true);
      setTimeout(() => navigate("/dashboard"), 1100);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        bgcolor: "background.default",
      }}
    >
      {/* ════════════ LEFT — Brand panel ════════════ */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          position: "relative",
          background: tokens.gradient.hero,
          overflow: "hidden",
          p: 6,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* decorative orbs */}
        {[
          { size: 460, top: -160, right: -120, opacity: 0.22 },
          { size: 320, bottom: -120, left: -80, opacity: 0.16 },
          { size: 200, top: "40%", right: "20%", opacity: 0.08 },
        ].map((o, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: o.size,
              height: o.size,
              top: o.top,
              right: o.right,
              bottom: o.bottom,
              left: o.left,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.palette.primary.main}, transparent 70%)`,
              opacity: o.opacity,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
        ))}

        

        {/* logo */}
        <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: `${tokens.radius.md}px`,
              background: tokens.gradient.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: tokens.shadow.accent,
            }}
          >
            <Building2 size={22} color="#fff" />
          </Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.02em" }}>
            EstateHub
          </Typography>
        </Box>

        {/* center hero text */}
        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 460 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.5,
              py: 0.6,
              borderRadius: "99px",
              ...tokens.glass.dark,
              mb: 3,
            }}
          >
            <Sparkles size={12} color={theme.palette.primary.light} />
            <Typography
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Welcome back
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontSize: { md: "3rem", lg: "3.5rem" },
              lineHeight: 1.05,
              mb: 2.5,
              letterSpacing: "-0.03em",
              fontWeight: 800,
            }}
          >
            Find your{" "}
            <Box
              component="span"
              sx={{
                background: tokens.gradient.accent,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              dream home
            </Box>{" "}
            today.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Sign in to access your personalized property dashboard, saved listings, and applications.
          </Typography>
        </Box>

        {/* feature pills */}
        <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {[
            { icon: ShieldCheck, text: "Bank-level security for your data" },
            { icon: TrendingUp,  text: "10,000+ properties across Ukraine" },
            { icon: Building2,   text: "Trusted by realtors and owners alike" },
          ].map((f, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.25,
                borderRadius: `${tokens.radius.md}px`,
                ...tokens.glass.dark,
                animation: `fade-up 0.6s ${tokens.ease.out} both`,
                animationDelay: `${i * 100 + 200}ms`,
              }}
            >
              <f.icon size={16} color={theme.palette.primary.light} />
              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: 500 }}>
                {f.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ════════════ RIGHT — Form ════════════ */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 5 },
          position: "relative",
        }}
      >
        {/* mobile logo */}
        <Box
          sx={{
            position: "absolute",
            top: 24,
            left: 24,
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 36, height: 36,
              borderRadius: `${tokens.radius.sm}px`,
              background: tokens.gradient.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Building2 size={18} color="#fff" />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", color: "text.primary" }}>
            EstateHub
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: 420,
            animation: tokens.anim.fadeUp,
          }}
        >
          <Typography variant="h3" sx={{ color: "text.primary", mb: 1, fontSize: { xs: "2rem", sm: "2.4rem" } }}>
            Sign in
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 4 }}>
            Don't have an account?{" "}
            <Box
              component={Link}
              to="/register"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Create one
            </Box>
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Email address"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="text.secondary" />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                sx={{
    // Робимо текст введення чіткішим і темнішим
    "& .MuiInputBase-input": {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
    // Налаштування для мітки (label)
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
    },
  }}
                InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Mail size={18} color={theme.palette.text.secondary} />
      </InputAdornment>
    ),
    
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        aria-label="toggle password"
                      >
                        {showPassword
                          ? <EyeOff size={18} color={theme.palette.text.disabled} />
                          : <Eye size={18} color={theme.palette.text.disabled} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ textAlign: "right", mt: 0.75 }}>
                <Box
                  component={Link}
                  to="/forgot-password"
                  sx={{
                    fontSize: "0.82rem",
                    color: "text.secondary",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  Forgot password?
                </Box>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ animation: tokens.anim.fadeIn }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              endIcon={!loading && <ArrowRight size={16} />}
              sx={{ py: 1.4, fontSize: "0.95rem", mt: 1 }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </Box>

          {/* divider + links */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: "0.8rem", color: "text.disabled" }}>
              By signing in, you agree to our{" "}
              <Box component="span" sx={{ color: "text.secondary", fontWeight: 600 }}>
                Terms of Service
              </Box>{" "}
              and{" "}
              <Box component="span" sx={{ color: "text.secondary", fontWeight: 600 }}>
                Privacy Policy
              </Box>.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={successOpen}
        autoHideDuration={1500}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ borderRadius: `${tokens.radius.md}px`, fontWeight: 600 }}>
          Welcome back! Redirecting…
        </Alert>
      </Snackbar>
    </Box>
  );
}