// src/pages/ClientDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Skeleton, Divider, Alert } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Heart,
  FileText,
  Building2,
  ArrowRight,
  ArrowUpRight,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Hourglass,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { getMyApplications } from "../api/applicationApi";
import useTokens from "../hooks/useTokens";

/* ════════════════════════════════════════════════════════════════════════
   StatCard
   ──────────────────────────────────────────────────────────────────────── */
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
        "&:hover": to
          ? {
              transform: "translateY(-4px)",
              boxShadow: tokens.shadow.lg,
              borderColor: alpha(accent, 0.3),
              "& .stat-arrow": { opacity: 1, transform: "translate(2px,-2px)" },
            }
          : {},
      }}
      component={to ? Link : "div"}
      to={to}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
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
        <Typography
          sx={{
            fontFamily: '"Sora",sans-serif',
            fontWeight: 800,
            fontSize: "2.25rem",
            color: "text.primary",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {value}
        </Typography>
      )}

      <Typography
        sx={{
          fontSize: "0.83rem",
          fontWeight: 600,
          color: "text.secondary",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   QuickAction
   ──────────────────────────────────────────────────────────────────────── */
function QuickAction({ icon, label, description, to, accent }) {
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
        borderColor: "divider",
        background: "background.paper",
        textDecoration: "none",
        transition: `all 0.25s ${tokens.ease.out}`,
        "&:hover": {
          borderColor: alpha(accent, 0.35),
          background: alpha(accent, 0.04),
          transform: "translateX(4px)",
          "& .qa-arrow": { transform: "translateX(3px)", color: accent },
        },
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: `${tokens.radius.sm}px`,
          background: `linear-gradient(135deg, ${alpha(accent, 0.16)}, ${alpha(accent, 0.04)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.9rem" }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: "0.78rem", color: "text.disabled", lineHeight: 1.45 }}>
          {description}
        </Typography>
      </Box>
      <ArrowRight
        size={16}
        className="qa-arrow"
        color={theme.palette.text.disabled}
        style={{ transition: `all 0.25s ${tokens.ease.out}` }}
      />
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   App row
   ──────────────────────────────────────────────────────────────────────── */
const appStatusConfig = {
  pending:  { label: "Pending",  icon: <Hourglass size={12} />,   bg: "rgba(245,158,11,0.10)", color: "#b45309" },
  approved: { label: "Approved", icon: <CheckCircle size={12} />, bg: "rgba(34,197,94,0.10)",  color: "#15803d" },
  rejected: { label: "Rejected", icon: <XCircle size={12} />,     bg: "rgba(239,68,68,0.10)",  color: "#dc2626" },
  reviewed: { label: "Reviewed", icon: <Clock size={12} />,       bg: "rgba(59,130,246,0.10)", color: "#1d4ed8" },
};

function AppRow({ app }) {
  const theme  = useTheme();
  const tokens = useTokens();
  const statusKey = app.status?.toLowerCase() || "pending";
  const st = appStatusConfig[statusKey] || appStatusConfig.pending;
  const property = app.property || {};

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        py: 1.75,
        flexWrap: "wrap",
        transition: `padding 0.2s ${tokens.ease.out}`,
        "&:hover": { px: 1, bgcolor: alpha(theme.palette.text.primary, 0.02), borderRadius: 1.5 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0, flex: 1 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            background: "#F2F2F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {property.images?.[0] ? (
            <Box
              component="img"
              src={property.images[0]}
              alt=""
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Building2 size={18} color={theme.palette.text.disabled} />
          )}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.88rem",
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {property.title || "Property"}
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "text.disabled" }}>
            {new Date(app.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.6,
          px: 1.4,
          py: 0.45,
          borderRadius: "8px",
          background: st.bg,
          color: st.color,
          fontWeight: 700,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          flexShrink: 0,
          border: `1px solid ${st.color}22`,
        }}
      >
        {st.icon}
        {st.label}
      </Box>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Main page
   ──────────────────────────────────────────────────────────────────────── */
export default function ClientDashboardPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const { user } = useAuth();
  const { count: favoritesCount, loading: favLoading } = useFavorites();

  const [applications, setApplications] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [error, setError] = useState(null);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    let active = true;
    const fetchApps = async () => {
      setLoadingApps(true);
      setError(null);
      try {
        const data = await getMyApplications();
        if (!active) return;
        const apps = Array.isArray(data) ? data : data?.applications || [];
        setApplications(apps);
        setRecentApps(apps.slice(0, 4));
      } catch (err) {
        if (!active) return;
        if (err?.response?.status !== 401) {
          setError("Couldn't load your applications. Please try again.");
        }
        console.error(err);
      } finally {
        if (active) setLoadingApps(false);
      }
    };

    fetchApps();
    return () => { active = false; };
  }, []);

  const loading = favLoading || loadingApps;
  const firstName = user?.name?.split(" ")[0] || "there";

  const approvedCount = applications.filter((a) => a.status?.toLowerCase() === "approved").length;
  const pendingCount  = applications.filter((a) => a.status?.toLowerCase() === "pending").length;

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
          Here's what's happening with your real estate activity today.
        </Typography>
      </Box>

      {/* Кнопка Browse Properties */}
      <Button
        component={Link}
        to="/properties"
        variant="contained"
        color="primary"
        size="large"
        endIcon={<ArrowRight size={17} />}
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
        Browse Properties
      </Button>
    </Box>
  </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* ════════════ Stats row ════════════ */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(4,1fr)" },
            gap: 2.5,
            mb: 5,
          }}
        >
          <StatCard
            icon={<Heart size={22} color={theme.palette.primary.main} fill={alpha(theme.palette.primary.main, 0.25)} />}
            label="Saved Properties"
            value={favoritesCount}
            accent={theme.palette.primary.main}
            loading={loading}
            to="/my-favorites"
            delay={0}
          />
          <StatCard
            icon={<FileText size={22} color="#3b82f6" />}
            label="Applications"
            value={applications.length}
            accent="#3b82f6"
            loading={loading}
            to="/my-applications"
            delay={80}
          />
          <StatCard
            icon={<CheckCircle size={22} color="#22c55e" />}
            label="Approved"
            value={approvedCount}
            accent="#22c55e"
            loading={loading}
            delay={160}
          />
          <StatCard
            icon={<TrendingUp size={22} color="#a855f7" />}
            label="Pending Review"
            value={pendingCount}
            accent="#a855f7"
            loading={loading}
            delay={240}
          />
        </Box>

        {/* ════════════ Two-column ════════════ */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 340px" },
            gap: 4,
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              background: "background.paper",
              borderRadius: `${tokens.radius.lg}px`,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: tokens.shadow.sm,
              overflow: "hidden",
              animation: tokens.anim.fadeUp,
              animationDelay: "320ms",
              animationFillMode: "both",
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Clock size={18} color={theme.palette.text.secondary} />
                <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.95rem" }}>
                  Recent Applications
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/my-applications"
                size="small"
                endIcon={<ArrowRight size={14} />}
                sx={{ color: "primary.main", fontWeight: 700, fontSize: "0.8rem" }}
              >
                View all
              </Button>
            </Box>

            <Box sx={{ px: 3 }}>
              {loadingApps ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Box key={i} sx={{ py: 2 }}>
                    <Skeleton height={44} />
                  </Box>
                ))
              ) : recentApps.length === 0 ? (
                <Box sx={{ py: 7, textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: alpha(theme.palette.primary.main, 0.08),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <FileText size={24} color={theme.palette.primary.main} />
                  </Box>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", mb: 0.5, fontWeight: 600 }}>
                    No applications yet
                  </Typography>
                  <Typography sx={{ color: "text.disabled", fontSize: "0.8rem", mb: 2 }}>
                    Browse properties and submit your first application.
                  </Typography>
                  <Button
                    component={Link}
                    to="/properties"
                    size="small"
                    variant="contained"
                    endIcon={<ArrowRight size={14} />}
                  >
                    Browse & apply
                  </Button>
                </Box>
              ) : (
                recentApps.map((app, i) => (
                  <React.Fragment key={app._id || i}>
                    <AppRow app={app} />
                    {i < recentApps.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </Box>
          </Box>

          <Box
            sx={{
              animation: tokens.anim.fadeUp,
              animationDelay: "400ms",
              animationFillMode: "both",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: "0.95rem",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <QuickAction
                icon={<Building2 size={20} color={theme.palette.primary.main} />}
                label="Browse Properties"
                description="Explore the latest listings"
                to="/properties"
                accent={theme.palette.primary.main}
              />
              <QuickAction
                icon={<Heart size={20} color="#ec4899" />}
                label="My Favorites"
                description="View your saved properties"
                to="/my-favorites"
                accent="#ec4899"
              />
              <QuickAction
                icon={<FileText size={20} color="#3b82f6" />}
                label="My Applications"
                description="Track your application status"
                to="/my-applications"
                accent="#3b82f6"
              />
              <QuickAction
                icon={<User size={20} color="#a855f7" />}
                label="Edit Profile"
                description="Update your account info"
                to="/profile"
                accent="#a855f7"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}