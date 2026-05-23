// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import {
  Alert, Box, Button, IconButton, InputAdornment,
  Skeleton, Snackbar, TextField, Typography, Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  User, Mail, Phone, Save, Lock, Shield, Calendar, Sparkles,
  Building2, Heart, FileText, LogOut, Edit3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import { getProfile, updateProfile } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import useTokens from "../hooks/useTokens";

/* ── ініціали для аватара ── */
const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

/* ── статистика згори (тільки для client) ── */
function StatPill({ icon, label, value, accent }) {
  const tokens = useTokens();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: 2,
        py: 1.25,
        borderRadius: `${tokens.radius.md}px`,
        background: alpha(accent, 0.08),
        border: `1px solid ${alpha(accent, 0.18)}`,
      }}
    >
      <Box
        sx={{
          width: 32, height: 32,
          borderRadius: `${tokens.radius.sm}px`,
          background: alpha(accent, 0.15),
          color: accent,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: "0.7rem", color: "text.disabled", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "text.primary", lineHeight: 1.2 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ProfilePage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();
  const { user, token, login, logout } = useAuth();
  const { count: favoritesCount } = useFavorites();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    let active = true;
    (async () => {
      try {
        const data = await getProfile();
        if (!active) return;
        const fd = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        };
        setFormData(fd);
        setInitialData(fd);
      } catch (err) {
        if (active && err?.response?.status !== 401) {
          setError("Failed to load profile");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const isDirty =
    initialData &&
    (initialData.name !== formData.name || initialData.phone !== formData.phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty || saving) return;
    setSaving(true);
    setError("");
    try {
      const res = await updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      // оновлюємо auth-стан
      login(res.user || res, token);
      setInitialData({ ...formData });
      setSuccessOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (initialData) setFormData(initialData);
    setError("");
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  const roleLabel =
    user?.role === "owner"   ? "Property Owner"
  : user?.role === "realtor" ? "Realtor"
  : user?.role === "client"  ? "Client"
  : "Member";

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1080, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        {/* ════════════ HERO HEADER ════════════ */}
        <Box
          sx={{
            position: "relative",
            background: tokens.gradient.dark,
            borderRadius: `${tokens.radius.xl}px`,
            p: { xs: 3.5, md: 5 },
            mb: 4,
            overflow: "hidden",
            boxShadow: tokens.shadow.lg,
            animation: tokens.anim.fadeUp,
          }}
        >
          {/* orbs */}
          <Box
            sx={{
              position: "absolute",
              top: -80, right: -60,
              width: 280, height: 280,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.35)}, transparent 70%)`,
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -100, left: "30%",
              width: 220, height: 220,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.18)}, transparent 70%)`,
              filter: "blur(24px)",
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 2.5, sm: 3 },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {/* avatar */}
            <Box
              sx={{
                position: "relative",
                width: 92, height: 92,
                borderRadius: "50%",
                background: tokens.gradient.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                boxShadow: tokens.shadow.accent,
                flexShrink: 0,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.18)",
                },
              }}
            >
              {loading ? <Skeleton variant="circular" width={50} height={50} /> : getInitials(user?.name)}
            </Box>

            {/* name + meta */}
            <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: { xs: "center", sm: "flex-start" }, gap: 0.5 }}>
              
              {/* Badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,
                  px: 1.25,
                  py: 0.4,
                  borderRadius: "99px",
                  ...tokens.glass.dark,
                  mb: 0.5,
                }}
              >
                <Sparkles size={11} color={theme.palette.primary.light} />
                <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {roleLabel}
                </Typography>
              </Box>

              {/* Name - зменшено розмір та вагу для гармонії */}
              <Typography
                variant="h4"
                sx={{
                  color: "#fff",
                  fontSize: { xs: "1.5rem", md: "1.85rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {loading ? <Skeleton width={180} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} /> : user?.name || "Welcome"}
              </Typography>

              {/* Email + Joined — об'єднані в один гармонійний рядок */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
                <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Mail size={13} /> {loading ? <Skeleton width={120} /> : user?.email}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.3)" }}>•</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Calendar size={13} /> Joined {memberSince}
                </Typography>
              </Box>
            </Box>
           

            <Button
              startIcon={<LogOut size={15} />}
              onClick={logout}
              sx={{
                color: "rgba(255,255,255,0.8)",
                ...tokens.glass.dark,
                border: "1px solid rgba(255,255,255,0.18)",
                "&:hover": {
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                },
              }}
            >
              Sign out
            </Button>
          </Box>
        </Box>

        {/* ════════════ STATS (тільки для client) ════════════ */}
        {user?.role === "client" && !loading && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
              mb: 4,
              animation: tokens.anim.fadeUp,
              animationDelay: "80ms",
              animationFillMode: "both",
            }}
          >
            <StatPill
              icon={<Heart size={16} />}
              label="Favorites"
              value={favoritesCount}
              accent={theme.palette.primary.main}
            />
            <StatPill
              icon={<FileText size={16} />}
              label="Account type"
              value={roleLabel}
              accent="#3b82f6"
            />
            <StatPill
              icon={<Shield size={16} />}
              label="Status"
              value="Active"
              accent="#22c55e"
            />
          </Box>
        )}

        {/* ════════════ FORM ════════════ */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 280px" },
            gap: 4,
            alignItems: "start",
          }}
        >
          {/* Account info form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              background: "background.paper",
              borderRadius: `${tokens.radius.lg}px`,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: tokens.shadow.sm,
              p: { xs: 3, md: 4 },
              animation: tokens.anim.fadeUp,
              animationDelay: "160ms",
              animationFillMode: "both",
            }}
          >
            {/* ТУТ ВИПРАВЛЕНО: Обгорнув заголовок і підзаголовок в один блок, щоб вирівняти їх по лівому краю */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                <Edit3 size={18} color={theme.palette.text.secondary} />
                <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.05rem" }}>
                  Account Information
                </Typography>
              </Box>
              {/* Підзаголовок тепер не має марджинів чи відступів, які б його зсували */}
              <Typography sx={{ color: "text.disabled", fontSize: "0.85rem", textAlign: "left" }}>
                Update your personal details. Email cannot be changed.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={56} />
                ))
              ) : (
                <>
                  <TextField
                    label="Full name"
                    name="name"
                    fullWidth
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
                    fullWidth
                    value={formData.email}
                    disabled
                    helperText="Email cannot be changed. Contact support if needed."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={18} color={theme.palette.text.disabled} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Lock size={14} color={theme.palette.text.disabled} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+380…"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone size={18} color={theme.palette.text.disabled} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}

              {error && <Alert severity="error" sx={{ animation: tokens.anim.fadeIn }}>{error}</Alert>}

              {/* action bar */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  pt: 1.5,
                  borderTop: "1px solid",
                  borderColor: "divider",
                 flexDirection: "column", // Змінюємо на колонку
                  width: "100%",
                }}
              >
                {isDirty && (
                  <Button onClick={handleReset} sx={{ color: "text.secondary" }}>
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!isDirty || saving || loading}
                  startIcon={!saving && <Save size={15} />}
                  sx={{ minWidth: 140 }}
                >
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Sidebar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              animation: tokens.anim.fadeUp,
              animationDelay: "240ms",
              animationFillMode: "both",
            }}
          >
            {/* Security card */}
            <Box
              sx={{
                background: "background.paper",
                borderRadius: `${tokens.radius.lg}px`,
                border: "1px solid",
                borderColor: "divider",
                p: 2.5,
                boxShadow: tokens.shadow.sm,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Shield size={16} color={theme.palette.success.main} />
                <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.9rem" }}>
                  Security
                </Typography>
              </Box>
              <Typography sx={{ color: "text.disabled", fontSize: "0.8rem", mb: 2, lineHeight: 1.55 }}>
                Your account is protected. Need to change your password?
              </Typography>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                startIcon={<Lock size={14} />}
                onClick={() => navigate("/forgot-password")}
                sx={{ fontSize: "0.8rem" }}
              >
                Reset password
              </Button>
            </Box>

            {/* Role card */}
            <Box
              sx={{
                background: tokens.gradient.accentSoft,
                borderRadius: `${tokens.radius.lg}px`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                p: 2.5,
                position: "relative",
                overflow: "hidden",
                display: "flex", // Додано для правильного вирівнювання всередині
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -30, right: -30,
                  width: 100, height: 100,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.18)}, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
              <Box sx={{ position: "relative" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Building2 size={16} color={theme.palette.primary.main} />
                  <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.9rem" }}>
                    {roleLabel}
                  </Typography>
                </Box>
                <Typography sx={{ color: "text.secondary", fontSize: "0.8rem", lineHeight: 1.55 }}>
                  Need a different role? Contact support to upgrade your account.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ borderRadius: `${tokens.radius.md}px`, fontWeight: 600 }}>
          Profile updated successfully
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}