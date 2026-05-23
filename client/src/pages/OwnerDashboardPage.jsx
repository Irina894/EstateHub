// src/pages/OwnerDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Skeleton, Alert } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Building2, ClipboardList, Plus, ArrowRight, ArrowUpRight,
  Sparkles, TrendingUp, Eye, User, CheckCircle, Compass,
} from "lucide-react";
import { Link } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import { getMyProperties } from "../api/propertyApi";
import { getOwnerApplications } from "../api/applicationApi";
import useTokens from "../hooks/useTokens";

/* ─── StatCard (same pattern as Client) ─── */
function StatCard({ icon, label, value, accent, loading, to, delay = 0 }) {
  const theme  = useTheme();
  const tokens = useTokens();

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.paper",
        borderRadius: `${tokens.radius.lg}px`,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: tokens.shadow.sm,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflow: "hidden",
        textDecoration: "none",
        cursor: to ? "pointer" : "default",
        transition: `all 0.3s ${tokens.ease.out}`,
        animation: tokens.anim.fadeUp,
        animationDelay: `${delay}ms`,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at top right, ${alpha(accent, 0.08)}, transparent 60%)`,
          pointerEvents: "none",
        },
        "&:hover": to ? {
          transform: "translateY(-4px)",
          boxShadow: tokens.shadow.lg,
          borderColor: alpha(accent, 0.3),
          "& .stat-arrow": { opacity: 1, transform: "translate(2px,-2px)" },
        } : {},
      }}
      component={to ? Link : "div"}
      to={to}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        <Box
          sx={{
            width: 48, height: 48,
            borderRadius: `${tokens.radius.md}px`,
            background: `linear-gradient(135deg, ${alpha(accent, 0.18)}, ${alpha(accent, 0.06)})`,
            border: `1px solid ${alpha(accent, 0.2)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        {to && (
          <ArrowUpRight
            size={16}
            className="stat-arrow"
            color={theme.palette.text.disabled}
            style={{ opacity: 0.55, transition: `all 0.3s ${tokens.ease.out}` }}
          />
        )}
      </Box>

      {loading ? (
        <Skeleton width={70} height={42} />
      ) : (
        <Typography sx={{ fontWeight: 800, fontSize: "2.25rem", color: "text.primary", lineHeight: 1, letterSpacing: "-0.03em" }}>
          {value}
        </Typography>
      )}

      <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "text.secondary" }}>
        {label}
      </Typography>
    </Box>
  );
}

/* ─── QuickAction ─── */
function QuickAction({ icon, label, description, to, accent, primary = false }) {
  const theme  = useTheme();
  const tokens = useTokens();

  return (
    <Box
      component={Link}
      to={to}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: `${tokens.radius.md}px`,
        border: "1px solid",
        borderColor: primary ? "transparent" : "divider",
        background: primary ? tokens.gradient.accent : "background.paper",
        boxShadow: primary ? tokens.shadow.accent : "none",
        textDecoration: "none",
        transition: `all 0.25s ${tokens.ease.out}`,
        "&:hover": {
          borderColor: primary ? "transparent" : alpha(accent, 0.35),
          background: primary
            ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
            : alpha(accent, 0.04),
          transform: "translateX(4px)",
          "& .qa-arrow": { transform: "translateX(3px)" },
        },
      }}
    >
      <Box
        sx={{
          width: 42, height: 42,
          borderRadius: `${tokens.radius.sm}px`,
          background: primary
            ? "rgba(255,255,255,0.2)"
            : `linear-gradient(135deg, ${alpha(accent, 0.16)}, ${alpha(accent, 0.04)})`,
          color: primary ? "#fff" : accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, color: primary ? "#fff" : "text.primary", fontSize: "0.9rem" }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: "0.78rem", color: primary ? "rgba(255,255,255,0.75)" : "text.disabled", lineHeight: 1.45 }}>
          {description}
        </Typography>
      </Box>
      <ArrowRight
        size={16}
        className="qa-arrow"
        color={primary ? "#fff" : theme.palette.text.disabled}
        style={{ transition: `all 0.25s ${tokens.ease.out}` }}
      />
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Main
   ──────────────────────────────────────────────────────────────────────── */
export default function OwnerDashboardPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    properties: 0,
    available: 0,
    applications: 0,
    pendingApps: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [props, apps] = await Promise.allSettled([
          getMyProperties(),
          getOwnerApplications(),
        ]);
        if (!active) return;

        const properties = props.status === "fulfilled" ? (props.value || []) : [];
        const applications = apps.status === "fulfilled" ? (apps.value || []) : [];

        setStats({
          properties: properties.length,
          available: properties.filter((p) => p.status?.toLowerCase() === "available").length,
          applications: applications.length,
          pendingApps: applications.filter(
            (a) => ["pending", "new"].includes(a.status?.toLowerCase())
          ).length,
        });
      } catch (err) {
        if (active && err?.response?.status !== 401) {
          setError("Couldn't load dashboard data.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
  {/* ════════ Greeting banner ════════ */}
  <Box
    sx={{
      background: tokens.gradient.dark,
      borderRadius: `${tokens.radius.xl}px`,
      p: { xs: 3.5, md: 5 },
      mb: 5,
      position: "relative",
      overflow: "hidden",
      boxShadow: tokens.shadow.lg,
      animation: tokens.anim.fadeUp,
    }}
  >
    {/* Декоративний ефект */}
    <Box
      sx={{
        position: "absolute",
        top: -60,
        right: -60,
        width: 280,
        height: 280,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.35)}, transparent 70%)`,
        filter: "blur(20px)",
        pointerEvents: "none",
      }}
    />

    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
      }}
    >
      {/* Текстовий блок */}
      <Box sx={{ maxWidth: 540 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            px: 1.5,
            py: 0.6,
            borderRadius: "99px",
            ...tokens.glass.dark,
            mb: 2,
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
            {greeting}
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            color: "#ffffff",
            mb: 1.5,
            fontSize: { xs: "1.85rem", md: "2.4rem" },
            fontWeight: 300,
            lineHeight: 1.1,
            display: "block",
            width: "100%",
            textAlign: "left",
          }}
        >
          Welcome back, {firstName}
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "1.05rem",
            maxWidth: 480,
            lineHeight: 1.6,
            textAlign: "left",
            display: "block",
          }}
        >
          Here's an overview of your listings and incoming applications.
        </Typography>
      </Box>

      {/* Кнопка Add Property */}
      <Button
        component={Link}
        to="/properties/create"
        variant="contained"
        color="primary"
        size="large"
        startIcon={<Plus size={17} />}
        sx={{
          borderRadius: `${tokens.radius.md}px`,
          fontWeight: 500,
          px: 3,
          py: 1.5,
          flexShrink: 0,
          minWidth: 180,
          boxShadow: "none",
          "&:hover": { boxShadow: tokens.shadow.md },
        }}
      >
        Add Property
      </Button>
    </Box>
  </Box>


        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* ════════ Stats ════════ */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(4,1fr)" },
            gap: 2.5,
            mb: 5,
          }}
        >
          <StatCard
            icon={<Building2 size={22} color={theme.palette.primary.main} />}
            label="Total Listings"
            value={stats.properties}
            accent={theme.palette.primary.main}
            loading={loading}
            to="/my-properties"
            delay={0}
          />
          <StatCard
            icon={<CheckCircle size={22} color="#22c55e" />}
            label="Active Available"
            value={stats.available}
            accent="#22c55e"
            loading={loading}
            delay={80}
          />
          <StatCard
            icon={<ClipboardList size={22} color="#3b82f6" />}
            label="Applications"
            value={stats.applications}
            accent="#3b82f6"
            loading={loading}
            to="/owner-applications"
            delay={160}
          />
          <StatCard
            icon={<TrendingUp size={22} color="#a855f7" />}
            label="Pending Review"
            value={stats.pendingApps}
            accent="#a855f7"
            loading={loading}
            delay={240}
          />
        </Box>

        {/* ════════ Quick Actions ════════ */}
        <Box
          sx={{
            animation: tokens.anim.fadeUp,
            animationDelay: "320ms",
            animationFillMode: "both",
          }}
        >
          <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.1rem", mb: 2.5 }}>
            Quick Actions
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            <QuickAction
              icon={<Plus size={20} />}
              label="Add a new property"
              description="Create a new listing in minutes"
              to="/properties/create"
              accent={theme.palette.primary.main}
              primary
            />
            <QuickAction
              icon={<Building2 size={20} />}
              label="Manage listings"
              description="Edit, update or remove your properties"
              to="/my-properties"
              accent="#3b82f6"
            />
            <QuickAction
              icon={<ClipboardList size={20} />}
              label="Review applications"
              description="See who wants your properties"
              to="/owner-applications"
              accent="#22c55e"
            />
            <QuickAction
              icon={<Compass size={20} />}
              label="Browse catalog"
              description="See what other owners are listing"
              to="/properties"
              accent="#a855f7"
            />
            <QuickAction
              icon={<User size={20} />}
              label="Edit profile"
              description="Update your account info"
              to="/profile"
              accent="#ec4899"
            />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}