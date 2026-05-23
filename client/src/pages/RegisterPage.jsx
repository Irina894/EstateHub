// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import {
  Alert, Box, Button, IconButton, InputAdornment,
  Snackbar, TextField, Typography,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ArrowLeft,
  Building2, Briefcase, Sparkles, Check, Home, KeyRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import useTokens from "../hooks/useTokens";

const ROLES = [
  { value: "client",  label: "I'm looking",     description: "Browse and apply to listings",    icon: Home },
  { value: "owner",   label: "I have property", description: "List properties and manage them", icon: KeyRound },
  { value: "realtor", label: "I'm a realtor",   description: "Represent clients and owners",    icon: Briefcase },
];

export default function RegisterPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1); // 1 = role select, 2 = form
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", role: "client",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const pickRole = (role) => {
    setFormData((p) => ({ ...p, role }));
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await registerUser(formData);
      login(data.user, data.token);
      setSuccessOpen(true);
      setTimeout(() => navigate("/dashboard"), 1100);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // password strength (simple)
  const pwd = formData.password;
  const pwdScore =
    (pwd.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(pwd) ? 1 : 0) +
    (/[0-9]/.test(pwd) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(pwd) ? 1 : 0);
  const pwdMeter = ["", "Weak", "Fair", "Good", "Strong"][pwdScore];
  const pwdColor = ["#e5e7eb", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][pwdScore];

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
        {[
          { size: 460, top: -160, right: -120, opacity: 0.22 },
          { size: 320, bottom: -120, left: -80, opacity: 0.16 },
        ].map((o, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: o.size, height: o.size,
              top: o.top, right: o.right, bottom: o.bottom, left: o.left,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.palette.primary.main}, transparent 70%)`,
              opacity: o.opacity,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
        ))}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44, height: 44,
              borderRadius: `${tokens.radius.md}px`,
              background: tokens.gradient.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: tokens.shadow.accent,
            }}
          >
            <Building2 size={22} color="#fff" />
          </Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.02em" }}>
            EstateHub
          </Typography>
        </Box>

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
            <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Create account
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
            Join{" "}
            <Box
              component="span"
              sx={{
                background: tokens.gradient.accent,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              10,000+
            </Box>{" "}
            real estate enthusiasts.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Whether you're searching, listing, or representing — EstateHub adapts to your role and gives you the right tools.
          </Typography>
        </Box>

        {/* step indicator */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <Box
                  sx={{
                    width: 32, height: 32, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: step >= s
                      ? tokens.gradient.accent
                      : "rgba(255,255,255,0.08)",
                    border: step >= s
                      ? "none"
                      : "1px solid rgba(255,255,255,0.15)",
                    color: step >= s ? "#fff" : "rgba(255,255,255,0.5)",
                    fontWeight: 800, fontSize: "0.85rem",
                    transition: `all 0.3s ${tokens.ease.out}`,
                  }}
                >
                  {step > s ? <Check size={16} /> : s}
                </Box>
                {s === 1 && (
                  <Box
                    sx={{
                      flex: 1,
                      height: 2,
                      background: step > 1
                        ? tokens.gradient.accent
                        : "rgba(255,255,255,0.08)",
                      borderRadius: 1,
                      maxWidth: 120,
                      transition: `all 0.3s ${tokens.ease.out}`,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", ml: 1, fontWeight: 600, letterSpacing: "0.04em" }}>
              Step {step} of 2 — {step === 1 ? "Choose role" : "Your details"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ════════════ RIGHT — Content ════════════ */}
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
            top: 24, left: 24,
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

        <Box sx={{ width: "100%", maxWidth: 460, animation: tokens.anim.fadeUp }}>
          {step === 1 ? (
            <>
              <Typography variant="h3" sx={{ color: "text.primary", mb: 1, fontSize: { xs: "2rem", sm: "2.4rem" } }}>
                Get started
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 4 }}>
                Tell us what brings you to EstateHub.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4 }}>
                {ROLES.map((r, i) => {
                  const Icon = r.icon;
                  const active = formData.role === r.value;
                  return (
                    <Box
                      key={r.value}
                      onClick={() => pickRole(r.value)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pickRole(r.value)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2.25,
                        borderRadius: `${tokens.radius.md}px`,
                        border: "2px solid",
                        borderColor: active ? "primary.main" : "divider",
                        background: active
                          ? alpha(theme.palette.primary.main, 0.04)
                          : "background.paper",
                        cursor: "pointer",
                        transition: `all 0.22s ${tokens.ease.out}`,
                        animation: `fade-up 0.45s ${tokens.ease.out} both`,
                        animationDelay: `${i * 80}ms`,
                        "&:hover": {
                          borderColor: "primary.main",
                          transform: "translateY(-2px)",
                          boxShadow: tokens.shadow.md,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 44, height: 44,
                          borderRadius: `${tokens.radius.sm}px`,
                          background: active
                            ? tokens.gradient.accent
                            : alpha(theme.palette.primary.main, 0.08),
                          color: active ? "#fff" : theme.palette.primary.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: `all 0.22s ${tokens.ease.out}`,
                        }}
                      >
                        <Icon size={20} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.95rem" }}>
                          {r.label}
                        </Typography>
                        <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                          {r.description}
                        </Typography>
                      </Box>
                      <ArrowRight
                        size={18}
                        color={active ? theme.palette.primary.main : theme.palette.text.disabled}
                      />
                    </Box>
                  );
                })}
              </Box>

              <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", textAlign: "center" }}>
                Already have an account?{" "}
                <Box
                  component={Link}
                  to="/login"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign in
                </Box>
              </Typography>
            </>
          ) : (
            <>
              <Button
                startIcon={<ArrowLeft size={15} />}
                onClick={() => setStep(1)}
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  pl: 0,
                  mb: 2,
                  "&:hover": { background: "transparent", color: "primary.main" },
                }}
              >
                Change role
              </Button>

              <Typography variant="h3" sx={{ color: "text.primary", mb: 1, fontSize: { xs: "2rem", sm: "2.4rem" } }}>
                Your details
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 4 }}>
                Registering as{" "}
                <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>
                  {ROLES.find((r) => r.value === formData.role)?.label.toLowerCase()}
                </Box>
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                <TextField
                  label="Full name"
                  name="name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} color={theme.palette.text.disabled} />
                      </InputAdornment>
                    ),
                  }}
                />

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
                        <Mail size={18} color={theme.palette.text.disabled} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Phone (optional)"
                  name="phone"
                  fullWidth
                  value={formData.phone}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={18} color={theme.palette.text.disabled} />
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={18} color={theme.palette.text.disabled} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((v) => !v)}
                            edge="end"
                            size="small"
                          >
                            {showPassword
                              ? <EyeOff size={18} color={theme.palette.text.disabled} />
                              : <Eye size={18} color={theme.palette.text.disabled} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* password strength meter */}
                  {pwd.length > 0 && (
                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ display: "flex", gap: 0.5, flex: 1 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              height: 4,
                              flex: 1,
                              borderRadius: 99,
                              background: i <= pwdScore ? pwdColor : alpha(theme.palette.text.primary, 0.08),
                              transition: `all 0.3s ${tokens.ease.out}`,
                            }}
                          />
                        ))}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: pwdColor,
                          minWidth: 50,
                          textAlign: "right",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        {pwdMeter}
                      </Typography>
                    </Box>
                  )}
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
                  {loading ? "Creating account…" : "Create account"}
                </Button>
              </Box>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.8rem", color: "text.disabled" }}>
                  Already have an account?{" "}
                  <Box
                    component={Link}
                    to="/login"
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign in
                  </Box>
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Snackbar
        open={successOpen}
        autoHideDuration={1500}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ borderRadius: `${tokens.radius.md}px`, fontWeight: 600 }}>
          Account created! Redirecting…
        </Alert>
      </Snackbar>
    </Box>
  );
}