// src/pages/RealtorDashboardPage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Briefcase, Building2, Compass, User, Sparkles, ArrowRight,
  TrendingUp, Award, Users, Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import useTokens from "../hooks/useTokens";

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

function HighlightCard({ icon, title, description, accent }) {
  const theme  = useTheme();
  const tokens = useTokens();
  return (
    <Box
      sx={{
        background: "background.paper",
        borderRadius: `${tokens.radius.lg}px`,
        border: "1px solid",
        borderColor: "divider",
        p: 3,
        boxShadow: tokens.shadow.sm,
        position: "relative",
        overflow: "hidden",
        transition: `all 0.3s ${tokens.ease.out}`,
        "&:hover": {
          boxShadow: tokens.shadow.md,
          transform: "translateY(-3px)",
          borderColor: alpha(accent, 0.25),
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${accent}, ${alpha(accent, 0.3)})`,
        }}
      />
      <Box
        sx={{
          display: "inline-flex",
          width: 44, height: 44,
          borderRadius: `${tokens.radius.md}px`,
          background: `linear-gradient(135deg, ${alpha(accent, 0.18)}, ${alpha(accent, 0.04)})`,
          color: accent,
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          border: `1px solid ${alpha(accent, 0.2)}`,
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "1rem", mb: 0.75 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: "0.88rem", lineHeight: 1.65 }}>
        {description}
      </Typography>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */

export default function RealtorDashboardPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        {/* ════════ Hero ════════ */}
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
          <Box
            sx={{
              position: "absolute",
              top: -60, right: -60,
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
              bottom: -100, right: 100,
              width: 200, height: 200,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)}, transparent 70%)`,
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
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
              <Briefcase size={12} color={theme.palette.primary.light} />
              <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {greeting} • Realtor
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ color: "#ffffff", mb: 1.5, fontSize: { xs: "2rem", md: "2.75rem" } }}>
              Welcome back, {firstName}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", mb: 3.5, maxWidth: 520, lineHeight: 1.6 }}>
              Browse the latest listings, connect with clients and owners, and grow your network on EstateHub.
            </Typography>
            <Button
              component={Link}
              to="/properties"
              variant="contained"
              color="primary"
              endIcon={<ArrowRight size={16} />}
              sx={{ borderRadius: `${tokens.radius.md}px`, fontWeight: 700, px: 3 }}
            >
              Browse Catalog
            </Button>
          </Box>
        </Box>

        {/* ════════ Highlights ════════ */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2.5,
            mb: 5,
            animation: tokens.anim.fadeUp,
            animationDelay: "80ms",
            animationFillMode: "both",
          }}
        >
          <HighlightCard
            icon={<TrendingUp size={20} />}
            title="Track market trends"
            description="Stay informed about pricing changes and new listings in your area."
            accent={theme.palette.primary.main}
          />
          <HighlightCard
            icon={<Users size={20} />}
            title="Connect with clients"
            description="Reach out to property owners and potential buyers directly."
            accent="#3b82f6"
          />
          <HighlightCard
            icon={<Award size={20} />}
            title="Build your reputation"
            description="Verified realtors get a badge on listings they represent."
            accent="#22c55e"
          />
        </Box>

        {/* ════════ Quick Actions ════════ */}
        <Box
          sx={{
            animation: tokens.anim.fadeUp,
            animationDelay: "160ms",
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
              icon={<Compass size={20} />}
              label="Browse the catalog"
              description="Explore all available listings"
              to="/properties"
              accent={theme.palette.primary.main}
              primary
            />
            <QuickAction
              icon={<Building2 size={20} />}
              label="Featured properties"
              description="Top-rated listings of the week"
              to="/properties"
              accent="#3b82f6"
            />
            <QuickAction
              icon={<Phone size={20} />}
              label="Contact support"
              description="Need help? Reach out to our team"
              to="/contacts"
              accent="#a855f7"
            />
            <QuickAction
              icon={<User size={20} />}
              label="Edit profile"
              description="Update your professional info"
              to="/profile"
              accent="#ec4899"
            />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}