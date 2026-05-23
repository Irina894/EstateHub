// src/pages/AboutPage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Building2, Sparkles, Heart, Users, ShieldCheck, TrendingUp,
  Target, Eye, Compass, ArrowRight, ArrowLeft, MapPin, Award,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import useTokens from "../hooks/useTokens";

const STATS = [
  { value: "10K+",  label: "Active listings",  icon: Building2 },
  { value: "25K+",  label: "Happy customers",  icon: Users },
  { value: "98%",   label: "Customer satisfaction", icon: Heart },
  { value: "6",     label: "Cities covered",   icon: MapPin },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description: "Every listing is verified. Every transaction is protected. We believe in radical honesty between buyers, sellers, and realtors.",
    accent: "#22c55e",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description: "We obsess over the small details — the smooth animations, the fast load times, the carefully crafted typography. Real estate deserves better tools.",
    accent: "#a855f7",
  },
  {
    icon: TrendingUp,
    title: "Built for Growth",
    description: "Whether you're listing your first property or managing a portfolio of 50, EstateHub scales with your ambition.",
    accent: "#3b82f6",
  },
];

export default function AboutPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();

  const goBack = () =>
    window.history.length > 1 ? navigate(-1) : navigate("/");

  return (
    <MainLayout>
      {/* ════════════ HERO ════════════ */}
      <Box
        sx={{
          position: "relative",
          background: tokens.gradient.hero,
          overflow: "hidden",
          py: { xs: 8, md: 14 },
          px: { xs: 3, md: 5 },
        }}
      >
        {[
          { size: 520, top: -180, right: -140, opacity: 0.22 },
          { size: 380, bottom: -120, left: -80, opacity: 0.16 },
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

        

        {/* ── Back button ── */}
        <Button
          onClick={goBack}
          startIcon={<ArrowLeft size={15} />}
          sx={{
            position: "absolute",
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 32 },
            zIndex: 2,
            color: "rgba(255,255,255,0.85)",
            ...tokens.glass.dark,
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "999px",
            px: 2,
            py: 0.85,
            fontSize: "0.82rem",
            fontWeight: 600,
            transition: `all 0.22s ${tokens.ease.out}`,
            "&:hover": {
              background: "rgba(255,255,255,0.16)",
              color: "#fff",
              borderColor: "rgba(255,255,255,0.32)",
              transform: "translateX(-2px)",
            },
          }}
        >
          Back
        </Button>

        <Box sx={{ maxWidth: 900, mx: "auto", position: "relative", zIndex: 1, textAlign: "center" }}>
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
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              About EstateHub
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              color: "#fff",
              fontSize: { xs: "2.4rem", md: "4rem" },
              lineHeight: 1.05,
              mb: 3,
              letterSpacing: "-0.04em",
            }}
          >
            Real estate, reimagined for{" "}
            <Box
              component="span"
              sx={{
                background: tokens.gradient.accent,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              the modern era.
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: { xs: "1rem", md: "1.15rem" },
              lineHeight: 1.7,
              maxWidth: 720,
              mx: "auto",
              mb: 5,
            }}
          >
            We built EstateHub because finding a home shouldn't feel like a chore.
            From the first search to the final handshake — every step is faster,
            cleaner, and more transparent.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
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
              to="/contacts"
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
              Get in touch
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ════════════ STATS ════════════ */}
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
                <Typography
                  sx={{
                    fontSize: { xs: "1.8rem", md: "2.3rem" },
                    fontWeight: 800,
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

      {/* ════════════ MISSION / VISION ════════════ */}
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, mb: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {/* Mission */}
          <Box
            sx={{
              background: "background.paper",
              borderRadius: `${tokens.radius.lg}px`,
              border: "1px solid",
              borderColor: "divider",
              p: { xs: 3.5, md: 5 },
              position: "relative",
              overflow: "hidden",
              boxShadow: tokens.shadow.sm,
              transition: `all 0.3s ${tokens.ease.out}`,
              "&:hover": { boxShadow: tokens.shadow.lg, transform: "translateY(-4px)" },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -40, right: -40,
                width: 160, height: 160,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  width: 52, height: 52,
                  borderRadius: `${tokens.radius.md}px`,
                  background: tokens.gradient.accent,
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  boxShadow: tokens.shadow.accent,
                }}
              >
                <Target size={24} color="#fff" />
              </Box>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "primary.main",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  mb: 1.25,
                }}
              >
                Our mission
              </Typography>
              <Typography variant="h4" sx={{ color: "text.primary", mb: 2, fontSize: { xs: "1.5rem", md: "1.8rem" } }}>
                Make real estate accessible to everyone.
              </Typography>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.75, fontSize: "0.97rem" }}>
                Property buying, selling, and renting should be straightforward. We remove the friction, eliminate hidden fees, and give every party the tools they need to make confident decisions.
              </Typography>
            </Box>
          </Box>

          {/* Vision */}
          <Box
            sx={{
              background: tokens.gradient.dark,
              borderRadius: `${tokens.radius.lg}px`,
              p: { xs: 3.5, md: 5 },
              position: "relative",
              overflow: "hidden",
              boxShadow: tokens.shadow.lg,
              transition: `all 0.3s ${tokens.ease.out}`,
              color: "#fff",
              "&:hover": { boxShadow: tokens.shadow.xl, transform: "translateY(-4px)" },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: -60, left: -40,
                width: 220, height: 220,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.3)}, transparent 70%)`,
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  width: 52, height: 52,
                  borderRadius: `${tokens.radius.md}px`,
                  ...tokens.glass.dark,
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Eye size={24} color="#fff" />
              </Box>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "primary.light",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  mb: 1.25,
                }}
              >
                Our vision
              </Typography>
              <Typography variant="h4" sx={{ color: "#fff", mb: 2, fontSize: { xs: "1.5rem", md: "1.8rem" } }}>
                Ukraine's most loved property platform.
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.75, fontSize: "0.97rem" }}>
                We're building the platform where every Ukrainian goes to find their next home, list their first property, or grow a real estate business. Powered by trust, design, and technology.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ════════════ VALUES ════════════ */}
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
            <Award size={13} color={theme.palette.primary.main} />
            <Typography
              sx={{
                color: theme.palette.primary.main,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              What we stand for
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ color: "text.primary", mb: 2, fontSize: { xs: "2rem", md: "2.7rem" } }}>
            Our core values
          </Typography>
          <Typography sx={{ color: "text.secondary", maxWidth: 540, mx: "auto", lineHeight: 1.7 }}>
            The principles that shape every product decision, every feature, every line of code.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {VALUES.map((v, i) => {
            const Icon = v.icon;
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
                    borderColor: alpha(v.accent, 0.3),
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${v.accent}, ${alpha(v.accent, 0.3)})`,
                  }}
                />
                <Box
                  sx={{
                    display: "inline-flex",
                    width: 48, height: 48,
                    borderRadius: `${tokens.radius.md}px`,
                    background: `linear-gradient(135deg, ${alpha(v.accent, 0.18)}, ${alpha(v.accent, 0.04)})`,
                    color: v.accent,
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                    border: `1px solid ${alpha(v.accent, 0.2)}`,
                  }}
                >
                  <Icon size={22} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", color: "text.primary", mb: 1.25, letterSpacing: "-0.01em" }}>
                  {v.title}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.92rem", lineHeight: 1.7 }}>
                  {v.description}
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
              Ready to start your journey?
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.65)", mb: 4, fontSize: "1rem", lineHeight: 1.7 }}>
              Join thousands of Ukrainians who found their perfect property — or sold theirs — through EstateHub.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
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
                to="/properties"
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
                Browse listings
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}