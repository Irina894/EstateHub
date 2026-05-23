// src/pages/HomePage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Building2, Search, Heart, Shield, Sparkles,
  ArrowRight, MapPin, TrendingUp, Users, Compass,
} from "lucide-react";
import { Link } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import useTokens from "../hooks/useTokens";

const FEATURES = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Filter by city, price, area, and amenities. Find your perfect match in seconds.",
    accent: "#3b82f6",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Bookmark properties you love and compare them side-by-side anytime.",
    accent: "#ec4899",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is verified. No fake listings, no hidden surprises.",
    accent: "#22c55e",
  },
];

const STATS = [
  { value: "10K+",  label: "Active listings",  icon: Building2 },
  { value: "25K+",  label: "Happy users",      icon: Users },
  { value: "98%",   label: "Satisfaction",     icon: TrendingUp },
  { value: "6",     label: "Cities",           icon: MapPin },
];

export default function HomePage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const { isAuthenticated, user } = useAuth();

  const firstName = user?.name?.split(" ")[0];

  return (
    <MainLayout>
      {/* ════════════ HERO ════════════ */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: tokens.gradient.hero,
          minHeight: { xs: 560, md: 640 },
          display: "flex",
          alignItems: "center",
          py: { xs: 8, md: 10 },
          px: { xs: 3, md: 5 },
        }}
      >
        {/* decorative orbs */}
        {[
          { size: 540, top: -180, right: -160, opacity: 0.25 },
          { size: 380, bottom: -120, left: -100, opacity: 0.18 },
          { size: 240, top: "40%",  right: "15%", opacity: 0.1  },
        ].map((o, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: o.size,
              height: o.size,
              top: o.top, right: o.right, bottom: o.bottom, left: o.left,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.palette.primary.main}, transparent 70%)`,
              opacity: o.opacity,
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* grid noise */}
        {/* <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
          }}
        /> */}

        <Box sx={{ maxWidth: 920, mx: "auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.75,
              py: 0.65,
              borderRadius: "99px",
              ...tokens.glass.dark,
              mb: 3,
            }}
          >
            <Sparkles size={13} color={theme.palette.primary.light} />
            <Typography
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.72rem",
                fontWeight: 600, // Змінено з 700 на 600 (тема)
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {isAuthenticated && firstName
                ? `Welcome back, ${firstName}`
                : "Ukraine's premier real estate hub"}
            </Typography>
          </Box>

          {/* Головний заголовок - Тепер тягне fontWeight та letterSpacing з theme.js */}
          <Typography
            variant="h1"
            sx={{
              color: "#fff",
              fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.2rem" }, // Трохи зменшено максимум для елегантності
              mb: 3,
            }}
          >
            Your next home is{" "}
            <Box
              component="span"
              sx={{
                background: tokens.gradient.accent,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                whiteSpace: "nowrap",
              }}
            >
              one click
            </Box>
            {" "}away.
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: { xs: "1rem", md: "1.15rem" },
              lineHeight: 1.7,
              maxWidth: 640,
              mx: "auto",
              mb: 5,
            }}
          >
            Browse 10,000+ verified listings across Ukraine's top cities.
            Buy, rent, or list your property — all in one place.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              to="/properties"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowRight size={16} />}
              sx={{ px: 4, py: 1.5, fontSize: "0.95rem" }}
            >
              Browse properties
            </Button>
            {!isAuthenticated ? (
              <Button
                component={Link}
                to="/register"
                size="large"
                sx={{
                  color: "#fff",
                  ...tokens.glass.dark,
                  border: "1px solid rgba(255,255,255,0.2)",
                  px: 4,
                  py: 1.5,
                  "&:hover": { background: "rgba(255,255,255,0.12)" },
                }}
              >
                Create free account
              </Button>
            ) : (
              <Button
                component={Link}
                to="/dashboard"
                size="large"
                sx={{
                  color: "#fff",
                  ...tokens.glass.dark,
                  border: "1px solid rgba(255,255,255,0.2)",
                  px: 4,
                  py: 1.5,
                  "&:hover": { background: "rgba(255,255,255,0.12)" },
                }}
              >
                Go to dashboard
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* ════════════ STATS (overlap into next section) ════════════ */}
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, mt: { xs: -6, md: -8 }, mb: { xs: 8, md: 12 }, position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(4,1fr)" },
            gap: 0,
            background: "background.paper",
            borderRadius: `${tokens.radius.xl}px`,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: tokens.shadow.xl,
            overflow: "hidden",
            animation: tokens.anim.fadeUp,
          }}
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Box
                key={i}
                sx={{
                  py: { xs: 3, md: 4 },
                  px: 3,
                  textAlign: "center",
                  borderRight: { md: i < STATS.length - 1 ? "1px solid" : "none" },
                  borderBottom: { xs: i < 2 ? "1px solid" : "none", md: "none" },
                  borderColor: "divider",
                  transition: `all 0.25s ${tokens.ease.out}`,
                  "&:hover": {
                    background: alpha(theme.palette.primary.main, 0.03),
                    "& .stat-icon": { transform: "scale(1.1)" },
                  },
                }}
              >
                <Box
                  className="stat-icon"
                  sx={{
                    display: "inline-flex",
                    width: 44, height: 44,
                    borderRadius: `${tokens.radius.md}px`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)}, ${alpha(theme.palette.primary.main, 0.04)})`,
                    color: theme.palette.primary.main,
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                    transition: `all 0.3s ${tokens.ease.out}`,
                  }}
                >
                  <Icon size={20} />
                </Box>
                {/* Цифри статистики - Змінено з 800 на 600 */}
                <Typography
                  sx={{
                    fontSize: { xs: "1.8rem", md: "2.3rem" },
                    fontWeight: 600, 
                    color: "text.primary",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    mb: 0.5,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "text.secondary",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ════════════ FEATURES ════════════ */}
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, mb: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.5,
              py: 0.6,
              borderRadius: "99px",
              background: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
              mb: 2.5,
            }}
          >
            <Sparkles size={13} color={theme.palette.primary.main} />
            <Typography
              sx={{
                color: theme.palette.primary.main,
                fontSize: "0.72rem",
                fontWeight: 600, // Змінено з 700 на 600
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Why EstateHub
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ color: "text.primary", mb: 2, fontSize: { xs: "2rem", md: "2.7rem" } }}>
            Built for buyers, owners, and realtors
          </Typography>
          <Typography sx={{ color: "text.secondary", maxWidth: 580, mx: "auto", lineHeight: 1.7 }}>
            Three core features that make property search effortless and transparent.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Box
                key={i}
                sx={{
                  background: "background.paper",
                  borderRadius: `${tokens.radius.lg}px`,
                  border: "1px solid",
                  borderColor: "divider",
                  p: { xs: 3.5, md: 4 },
                  boxShadow: tokens.shadow.sm,
                  transition: `all 0.3s ${tokens.ease.out}`,
                  animation: `fade-up 0.55s ${tokens.ease.out} both`,
                  animationDelay: `${i * 100}ms`,
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    boxShadow: tokens.shadow.lg,
                    transform: "translateY(-6px)",
                    borderColor: alpha(f.accent, 0.3),
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${f.accent}, ${alpha(f.accent, 0.3)})`,
                  }}
                />
                <Box
                  sx={{
                    display: "inline-flex",
                    width: 48, height: 48,
                    borderRadius: `${tokens.radius.md}px`,
                    background: `linear-gradient(135deg, ${alpha(f.accent, 0.18)}, ${alpha(f.accent, 0.04)})`,
                    color: f.accent,
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                    border: `1px solid ${alpha(f.accent, 0.2)}`,
                  }}
                >
                  <Icon size={22} />
                </Box>
                {/* Заголовки карток - Змінено з 800 на 600 */}
                <Typography sx={{ fontWeight: 600, fontSize: "1.15rem", color: "text.primary", mb: 1.25, letterSpacing: "-0.01em" }}>
                  {f.title}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.92rem", lineHeight: 1.7 }}>
                  {f.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ════════════ CTA ════════════ */}
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, pb: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            background: tokens.gradient.dark,
            borderRadius: `${tokens.radius.xl}px`,
            p: { xs: 4, md: 7 },
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
            boxShadow: tokens.shadow.xl,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -80, right: -60,
              width: 320, height: 320,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.32)}, transparent 70%)`,
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -100, left: -60,
              width: 280, height: 280,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)}, transparent 70%)`,
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", maxWidth: 580, mx: "auto" }}>
            <Compass size={36} color={theme.palette.primary.light} style={{ marginBottom: 16 }} />
            <Typography variant="h2" sx={{ color: "#fff", mb: 2, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
              {isAuthenticated
                ? "Ready to find your next property?"
                : "Ready to start your journey?"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.65)", mb: 4, fontSize: "1rem", lineHeight: 1.7 }}>
              {isAuthenticated
                ? "Browse fresh listings, save favourites, and apply with one click."
                : "Join thousands of Ukrainians who found their perfect property through EstateHub."}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              {!isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowRight size={16} />}
                    sx={{ px: 3.5, py: 1.4 }}
                  >
                    Create free account
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    size="large"
                    sx={{
                      color: "#fff",
                      ...tokens.glass.dark,
                      border: "1px solid rgba(255,255,255,0.2)",
                      px: 3.5,
                      py: 1.4,
                      "&:hover": { background: "rgba(255,255,255,0.12)" },
                    }}
                  >
                    Sign in
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/properties"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowRight size={16} />}
                    sx={{ px: 3.5, py: 1.4 }}
                  >
                    Browse properties
                  </Button>
                  <Button
                    component={Link}
                    to="/dashboard"
                    size="large"
                    sx={{
                      color: "#fff",
                      ...tokens.glass.dark,
                      border: "1px solid rgba(255,255,255,0.2)",
                      px: 3.5,
                      py: 1.4,
                      "&:hover": { background: "rgba(255,255,255,0.12)" },
                    }}
                  >
                    My dashboard
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}