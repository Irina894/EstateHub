// src/pages/MyApplicationsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Skeleton, Alert,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  FileText, MapPin, Bed, Ruler, ArrowUpRight,
  Compass, Clock, Hourglass, CheckCircle, XCircle, Eye, ImageOff,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import EmptyState from "../components/ui/EmptyState";
import { getMyApplications } from "../api/applicationApi";
import useTokens from "../hooks/useTokens";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=70";

/* ── статуси заявок ────────────────────────────────────────────────────── */
const APP_STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "#b45309", bg: "rgba(245,158,11,0.10)", icon: Hourglass },
  new:       { label: "New",       color: "#3b82f6", bg: "rgba(59,130,246,0.10)", icon: Hourglass },
  approved:  { label: "Approved",  color: "#15803d", bg: "rgba(34,197,94,0.10)",  icon: CheckCircle },
  rejected:  { label: "Rejected",  color: "#dc2626", bg: "rgba(239,68,68,0.10)",  icon: XCircle },
  reviewed:  { label: "Reviewed",  color: "#E65100", bg: "rgba(230,81,0,0.10)",   icon: Eye },
  in_review: { label: "In Review", color: "#7c3aed", bg: "rgba(168,85,247,0.10)", icon: Eye },
};

function StatusBadge({ status }) {
  const cfg =
    APP_STATUS_CONFIG[status?.toLowerCase()] || {
      label: status || "Unknown",
      color: "#616161",
      bg: "rgba(0,0,0,0.06)",
      icon: Clock,
    };
  const Icon = cfg.icon;
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.25,
        py: 0.4,
        borderRadius: "8px",
        background: cfg.bg,
        color: cfg.color,
        fontWeight: 600, // Узгоджено з PropertyCard
        fontSize: "0.7rem",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        border: `1px solid ${cfg.color}22`,
      }}
    >
      <Icon size={12} />
      {cfg.label}
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Application card — ВІЗУАЛЬНИЙ КЛОН PropertyCard
   ──────────────────────────────────────────────────────────────────────── */
function ApplicationCard({ application, index = 0 }) {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();

  const property =
    application?.property ||
    (typeof application?.propertyId === "object" ? application.propertyId : null) ||
    {};

  const propId = property._id || (typeof application?.propertyId === "string" ? application.propertyId : null);

  const {
    title = "Property",
    city,
    price,
    area,
    rooms,
    images = [],
  } = property;

  const initialImg = images[0] || PLACEHOLDER;
  const [imgSrc, setImgSrc] = useState(initialImg);
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => {
    if (imgSrc !== PLACEHOLDER) {
      setImgSrc(PLACEHOLDER);
    } else {
      setImgError(true);
    }
  };

  const pricePerM2 = area && price ? Math.round(price / area) : null;
  const appliedAt = application?.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
    : null;

  const goToDetails = (e) => {
    e?.stopPropagation();
    if (propId) navigate(`/properties/${propId}`);
  };

  return (
    <Box
      onClick={goToDetails}
      role={propId ? "button" : undefined}
      tabIndex={propId ? 0 : undefined}
      onKeyDown={(e) => propId && (e.key === "Enter" || e.key === " ") && goToDetails()}
      sx={{
        position: "relative",
        bgcolor: "background.paper",
        borderRadius: `${tokens.radius.lg}px`,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: tokens.shadow.sm,
        cursor: propId ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        transition: `transform 0.35s ${tokens.ease.out}, box-shadow 0.35s ${tokens.ease.out}, border-color 0.25s`,
        animation: `fade-up 0.55s ${tokens.ease.out} both`,
        animationDelay: `${Math.min(index, 8) * 50}ms`,
        outline: "none",
        "&:hover, &:focus-visible": propId
          ? {
              transform: "translateY(-6px)",
              boxShadow: tokens.shadow.lg,
              borderColor: alpha(theme.palette.primary.main, 0.25),
              "& .card-img": { transform: "scale(1.07)" },
              "& .card-cta": { background: tokens.gradient.accent, color: "#fff" },
              "& .card-cta svg": { transform: "translate(2px,-2px)" },
            }
          : {},
      }}
    >
      {/* ── Image area ── */}
      <Box
        sx={{
          position: "relative",
          height: 230, // Змінено на 230 як у PropertyCard
          overflow: "hidden",
          bgcolor: "#E8E6E1", // Колір фону під завантаження
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imgError ? (
          <Box sx={{ color: "text.disabled", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <ImageOff size={28} strokeWidth={1.5} />
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
              Image unavailable
            </Typography>
          </Box>
        ) : (
          <Box
            component="img"
            src={imgSrc}
            alt={title}
            className="card-img"
            onError={handleImgError}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: `transform 0.6s ${tokens.ease.out}`,
            }}
          />
        )}

        {/* Gradient overlay — як у PropertyCard */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(38,38,38,0) 55%, rgba(38,38,38,0.55) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Status top-right */}
        <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <StatusBadge status={application?.status} />
        </Box>

        {/* ── Price plaque (Glassmorphism з PropertyCard) ── */}
        {price != null && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              zIndex: 2,
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0.15,
              px: 1.5,
              py: 0.85,
              borderRadius: "12px",
              background: "rgba(20,20,20,0.65)",
              backdropFilter: "blur(14px) saturate(160%)",
              WebkitBackdropFilter: "blur(14px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.16)",
              color: "#fff",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.15rem",
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ${price.toLocaleString()}
            </Typography>
            {pricePerM2 && (
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.68rem",
                  fontWeight: 500,
                  lineHeight: 1.2,
                  letterSpacing: "0.01em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                ${pricePerM2.toLocaleString()} / m²
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* ── Content ── */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 1.25, // Узгоджено з PropertyCard
        }}
      >
        {/* City */}
        {city && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.55 }}>
            <MapPin size={11} color={theme.palette.text.disabled} strokeWidth={1.8} />
            <Typography
              sx={{
                fontSize: "0.66rem",
                color: "text.disabled",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {city}
            </Typography>
          </Box>
        )}

        {/* Title — м'якший, як у PropertyCard */}
        <Typography
          title={title}
          sx={{
            textAlign: "left",
            fontWeight: 600,
            color: "text.primary",
            fontSize: "0.95rem",
            lineHeight: 1.4,
            letterSpacing: "-0.005em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.66em",
            wordBreak: "break-word",
          }}
        >
          {title}
        </Typography>

        {/* Meta pills */}
        {(rooms || area) && (
          <Box sx={{ display: "flex", gap: 0.8, mt: 0.1, flexWrap: "wrap" }}>
            {rooms && <MetaPill icon={<Bed size={12} strokeWidth={1.75} />} label={`${rooms} rooms`} />}
            {area  && <MetaPill icon={<Ruler size={12} strokeWidth={1.75} />} label={`${area} m²`} />}
          </Box>
        )}

        {/* Applied date */}
        {appliedAt && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
              mt: 0.5,
              py: 0.5,
              borderTop: "1px solid",
              borderColor: "divider",
              pt: 1,
            }}
          >
            <Clock size={12} color={theme.palette.text.disabled} />
            <Typography sx={{ fontSize: "0.75rem", color: "text.disabled", fontWeight: 500 }}>
              Applied {appliedAt}
            </Typography>
          </Box>
        )}

        {/* CTA */}
        {propId && (
          <Box
            className="card-cta"
            onClick={(e) => {
              e.stopPropagation();
              goToDetails();
            }}
            sx={{
              mt: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              px: 1.85,
              py: 1.15,
              borderRadius: `${tokens.radius.md}px`,
              background: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: "0.8rem",
              letterSpacing: "0.005em",
              transition: `all 0.3s ${tokens.ease.out}`,
              cursor: "pointer",
              "& svg": { transition: `transform 0.3s ${tokens.ease.out}` },
            }}
          >
            <span>View Property</span>
            <ArrowUpRight size={15} strokeWidth={2} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ─── Meta-pill (з більшим внутрішнім простором як у PropertyCard) ─── */
function MetaPill({ icon, label }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.7,
        bgcolor: alpha(theme.palette.text.primary, 0.04),
        border: "1px solid",
        borderColor: alpha(theme.palette.text.primary, 0.06),
        borderRadius: "9px",
        px: 1.4,
        py: 0.55,
        color: "text.secondary",
        fontSize: "0.78rem",
        fontWeight: 500,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      <span>{label}</span>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Main page
   ──────────────────────────────────────────────────────────────────────── */
export default function MyApplicationsPage() {
  const tokens = useTokens();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getMyApplications()
      .then((data) => {
        if (!active) return;
        setApplications(Array.isArray(data) ? data : data?.applications || []);
      })
      .catch((err) => {
        if (!active) return;
        if (err?.response?.status !== 401) {
          setError("Failed to load applications. Please try again.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        {/* ── Header ── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 5,
            animation: tokens.anim.fadeUp,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
              <Box
                sx={{
                  width: 42, height: 42,
                  borderRadius: "10px",
                  background: `linear-gradient(135deg, ${alpha("#3b82f6", 0.18)}, ${alpha("#3b82f6", 0.05)})`,
                  border: "1px solid rgba(59,130,246,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  mt: "2px"
                }}
              >
                <FileText size={18} 
                color="#3b82f6" />
              </Box>
              <Typography variant="h4" sx={{ color: "text.primary", fontWeight: 700, lineHeight: 1.15 }}>
                My Applications
              </Typography>
            </Box>
            <Typography sx={{ color: "text.disabled", fontSize: "0.9rem", pl: "72px" }}>
              {loading
                ? "Loading…"
                : `${applications.length} ${applications.length === 1 ? "application" : "applications"} submitted`}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<Compass size={16} />}
            onClick={() => navigate("/properties")}
            sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            Browse Properties
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2,1fr)",
                lg: "repeat(3,1fr)",
                xl: "repeat(4,1fr)",
              },
              gap: 3,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  borderRadius: `${tokens.radius.lg}px`,
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Skeleton variant="rectangular" height={220} animation="wave" />
                <Box sx={{ p: 2.5 }}>
                  <Skeleton width="40%" height={14} sx={{ mb: 1 }} />
                  <Skeleton width="85%" height={20} sx={{ mb: 0.6 }} />
                  <Skeleton width="60%" height={20} sx={{ mb: 1.5 }} />
                  <Skeleton variant="rounded" width="100%" height={40} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={<FileText size={36} color="#3b82f6" strokeWidth={1.5} />}
            title="No applications yet"
            description="Browse properties and click 'Apply Now' to submit your first application."
            actionLabel="Explore Properties"
            onAction={() => navigate("/properties")}
          />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2,1fr)",
                lg: "repeat(3,1fr)",
                xl: "repeat(4,1fr)",
              },
              gap: 3,
            }}
          >
            {applications.map((app, i) => (
              <ApplicationCard key={app._id || i} application={app} index={i} />
            ))}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}