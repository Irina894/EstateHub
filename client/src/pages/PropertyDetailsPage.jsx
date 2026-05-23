// src/pages/PropertyDetailsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Button, Skeleton, Divider, Alert, Chip, Grid, Modal,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin, Bed, Ruler, Heart, ArrowLeft, ArrowRight,
  Phone, Mail, User, CircleAlert, CheckCircle, Send,
  Home, Building2, Layers, Share2, ChevronLeft, ChevronRight,
  Sparkles, Lock, Eye, X, Maximize2, Flame, TrendingDown, ShieldCheck,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";
import PropertyGrid from "../components/property/PropertyGrid";
import { getPropertyById, getSimilarProperties } from "../api/propertyApi";
import { createApplication } from "../api/applicationApi";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import useTokens from "../hooks/useTokens";


const formatPrice = (price) => {
  if (price == null) return "—";
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`;
  return `$${price}`;
};

const formatViews = (n) => {
  if (n == null || n < 1000) return n || 0;
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
};

/* Status config */
const statusOverlayConfig = {
  available: { label: "Available", bg: "rgba(34,197,94,0.10)",  color: "#15803d", border: "rgba(34,197,94,0.25)" },
  approved:  { label: "Approved",  bg: "rgba(34,197,94,0.10)",  color: "#15803d", border: "rgba(34,197,94,0.25)" },
  sold:      { label: "Sold",      bg: "rgba(239,68,68,0.10)",  color: "#dc2626", border: "rgba(239,68,68,0.25)" },
  rented:    { label: "Rented",    bg: "rgba(59,130,246,0.10)", color: "#1d4ed8", border: "rgba(59,130,246,0.25)" },
  pending:   { label: "Pending",   bg: "rgba(245,158,11,0.10)", color: "#b45309", border: "rgba(245,158,11,0.25)" },
  rejected:  { label: "Rejected",  bg: "rgba(239,68,68,0.10)",  color: "#dc2626", border: "rgba(239,68,68,0.25)" },
};

const getStatusChipColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "approved":
    case "available": return "success";
    case "pending":   return "warning";
    case "sold":
    case "rejected":  return "error";
    case "rented":    return "info";
    default:          return "default";
  }
};

/* ─── Skeleton ─── */
function DetailSkeleton() {
  const tokens = useTokens();
  return (
    <Box>
      <Skeleton variant="rectangular" height={480} sx={{ borderRadius: `${tokens.radius.lg}px`, mb: 4 }} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 360px" }, gap: 4 }}>
        <Box>
          <Skeleton width="70%" height={40} sx={{ mb: 2 }} />
          <Skeleton width="40%" height={20} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
        </Box>
        <Box>
          <Skeleton variant="rectangular" height={280} sx={{ borderRadius: `${tokens.radius.lg}px` }} />
        </Box>
      </Box>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Lightbox
   ──────────────────────────────────────────────────────────────────────── */
function Lightbox({ open, images, activeIndex, onClose, onPrev, onNext }) {
  const tokens = useTokens();
  const theme  = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      slotProps={{ backdrop: { sx: { background: "rgba(8,12,18,0.92)" } } }}
    >
      <Box sx={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", outline: "none" }}>
        {/* Toolbar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: { xs: 2, md: 3 }, color: "#fff" }}>
          <Typography sx={{ fontSize: "0.88rem", fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
            {activeIndex + 1}{" "}
            <Box component="span" sx={{ color: "rgba(255,255,255,0.45)" }}>of {images.length}</Box>
          </Typography>
          <Box
            onClick={onClose}
            role="button"
            aria-label="Close gallery"
            sx={{
              width: 38, height: 38, borderRadius: "50%",
              ...tokens.glass.dark,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: `all 0.2s ${tokens.ease.out}`,
              "&:hover": { background: "rgba(255,255,255,0.18)", transform: "scale(1.06)" },
            }}
          >
            <X size={16} color="#fff" />
          </Box>
        </Box>

        {/* Image */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 1, md: 4 }, position: "relative", minHeight: 0 }}>
          <Box
            component="img"
            src={images[activeIndex]}
            alt={`Photo ${activeIndex + 1}`}
            sx={{
              maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
              borderRadius: `${tokens.radius.lg}px`,
              boxShadow: "0 32px 64px rgba(0,0,0,0.45)",
              animation: tokens.anim.fadeIn,
            }}
          />
          {images.length > 1 && (
            <>
              <Box
                onClick={onPrev} role="button" aria-label="Previous photo"
                sx={{
                  position: "absolute", left: { xs: 12, md: 32 }, top: "50%", transform: "translateY(-50%)",
                  width: 46, height: 46, borderRadius: "50%",
                  ...tokens.glass.dark, border: "1px solid rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: `all 0.2s ${tokens.ease.out}`,
                  "&:hover": { background: "rgba(255,255,255,0.22)", transform: "translateY(-50%) scale(1.08)" },
                }}
              >
                <ChevronLeft size={20} color="#fff" />
              </Box>
              <Box
                onClick={onNext} role="button" aria-label="Next photo"
                sx={{
                  position: "absolute", right: { xs: 12, md: 32 }, top: "50%", transform: "translateY(-50%)",
                  width: 46, height: 46, borderRadius: "50%",
                  ...tokens.glass.dark, border: "1px solid rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: `all 0.2s ${tokens.ease.out}`,
                  "&:hover": { background: "rgba(255,255,255,0.22)", transform: "translateY(-50%) scale(1.08)" },
                }}
              >
                <ChevronRight size={20} color="#fff" />
              </Box>
            </>
          )}
        </Box>

        {/* Thumbnails */}
        {images.length > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, p: 2, overflowX: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
            {images.map((img, i) => (
              <Box
                key={i}
                onClick={() => activeIndex !== i && (i < activeIndex ? onPrev() : onNext())}
                sx={{
                  flexShrink: 0, width: 68, height: 48, borderRadius: 1.5, overflow: "hidden",
                  cursor: "pointer",
                  border: `2px solid ${activeIndex === i ? theme.palette.primary.light : "transparent"}`,
                  opacity: activeIndex === i ? 1 : 0.45,
                  transition: `all 0.2s ${tokens.ease.out}`,
                  "&:hover": { opacity: 1 },
                }}
              >
                <Box component="img" src={img} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Main page
   ──────────────────────────────────────────────────────────────────────── */
export default function PropertyDetailsPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();

  const [property, setProperty]     = useState(null);
  const [similar, setSimilar]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyStatus, setApplyStatus]   = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const favorited = property ? isFavorited(property._id) : false;
  const isClient  = user?.role === "client";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setApplyStatus(null);
      setActiveImage(0);
      try {
        const [propData, simData] = await Promise.allSettled([
          getPropertyById(id),
          getSimilarProperties(id),
        ]);
        if (propData.status === "fulfilled") setProperty(propData.value);
        if (simData.status === "fulfilled") {
          setSimilar(Array.isArray(simData.value) ? simData.value.slice(0, 3) : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleFavorite = async () => {
    if (!token || favLoading || !property || !isClient) return;
    setFavLoading(true);
    try { await toggleFavorite(property._id, favorited); }
    finally { setFavLoading(false); }
  };

  const handleApply = async () => {
    if (!token) { navigate("/login"); return; }
    setApplyLoading(true);
    setApplyStatus(null);
    try {
      await createApplication({ propertyId: property._id });
      setApplyStatus("success");
      setApplyMessage("Application submitted! The owner will contact you soon.");
    } catch (err) {
      setApplyStatus("error");
      setApplyMessage(err?.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setApplyLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: property.title, url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {}
    }
  };

  const images = property?.images?.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"];

  const nextImage = useCallback(() => setActiveImage((i) => (i + 1) % images.length), [images.length]);
  const prevImage = useCallback(() => setActiveImage((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const next = (activeImage + 1) % images.length;
    const prev = (activeImage - 1 + images.length) % images.length;
    [images[next], images[prev]].forEach((src) => { if (src) { const img = new Image(); img.src = src; } });
  }, [activeImage, images]);

  const touchStartX = React.useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.changedTouches[0].screenX; };
  const handleTouchEnd   = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].screenX - touchStartX.current;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) nextImage(); else prevImage();
    touchStartX.current = null;
  };

  useEffect(() => {
    if (lightboxOpen) return;
    const onKey = (e) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (document.activeElement?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft")  prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevImage, nextImage, lightboxOpen]);

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
          <DetailSkeleton />
        </Box>
      </MainLayout>
    );
  }

  if (!property) {
    return (
      <MainLayout>
        <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", py: 12, px: 3 }}>
          <Box sx={{ width: 80, height: 80, borderRadius: "50%", background: alpha(theme.palette.text.primary, 0.04), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
            <CircleAlert size={38} color={theme.palette.text.disabled} />
          </Box>
          <Typography variant="h5" sx={{ color: "text.primary", mb: 1 }}>Property Not Found</Typography>
          <Typography sx={{ color: "text.secondary", mb: 3, lineHeight: 1.7 }}>
            This property may have been removed or doesn't exist.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate("/properties")} endIcon={<ArrowRight size={16} />}>
            Browse Properties
          </Button>
        </Box>
      </MainLayout>
    );
  }

  const statusOverlay = statusOverlayConfig[property.status?.toLowerCase()] || statusOverlayConfig.available;
  const pricePerM2 = property.price && property.area
    ? `$${Math.round(property.price / property.area).toLocaleString()}/m²`
    : null;
  const isAvailable = ["available", "approved"].includes(property.status?.toLowerCase());
  const hasMultipleImages = images.length > 1;

  /* ─── адреса в один рядок ─── FIX #7 */
  const locationLine = [property.city, property.address].filter(Boolean).join(" · ");

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>

        {/* ── Top nav bar ── */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, gap: 2 }}>
          <Button
            startIcon={<ArrowLeft size={15} />}
            onClick={() => navigate(-1)}
            sx={{
              color: "text.secondary", fontWeight: 500, px: 0, fontSize: "0.875rem",
              "&:hover": { color: "text.primary", background: "transparent" },
            }}
          >
            Back to listings
          </Button>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {property.viewsCount != null && (
              <Box
                sx={{
                  display: "inline-flex", alignItems: "center", gap: 0.6,
                  px: 1.25, py: 0.55, borderRadius: "999px",
                  background: alpha(theme.palette.text.primary, 0.04),
                  border: "1px solid", borderColor: "divider", color: "text.secondary",
                }}
                title={`${property.viewsCount} views`}
              >
                <Eye size={12} strokeWidth={1.8} />
                <Typography sx={{ fontSize: "0.76rem", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                  {formatViews(property.viewsCount || 0)}
                </Typography>
              </Box>
            )}
            <Button
              size="small"
              startIcon={copied ? <CheckCircle size={13} /> : <Share2 size={13} />}
              onClick={handleShare}
              sx={{
                color: copied ? theme.palette.success.main : theme.palette.text.secondary,
                fontWeight: 500, fontSize: "0.82rem",
              }}
            >
              {copied ? "Copied!" : "Share"}
            </Button>
          </Box>
        </Box>

        {/* ════════════ HERO GALLERY ════════════ */}
        <Box
          sx={{
            mb: hasMultipleImages ? 2 : 4,
            borderRadius: `${tokens.radius.lg}px`,
            overflow: "hidden",
            position: "relative",
            boxShadow: tokens.shadow.md,
            animation: tokens.anim.fadeUp,
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: { xs: 260, sm: 400, md: 520 },
              background: "#E8E8E8",
              overflow: "hidden",
              cursor: "zoom-in",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            onClick={() => setLightboxOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Box
              component="img"
              src={images[activeImage]}
              alt={property.title}
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"; }}
              sx={{ width: "100%", height: "100%", objectFit: "cover", transition: `opacity 0.35s ${tokens.ease.out}` }}
              key={activeImage}
            />

            <Box
              sx={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 48%, rgba(0,0,0,0.15) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Arrows */}
            {hasMultipleImages && (
              <>
                <Box
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  role="button" aria-label="Previous photo"
                  sx={{
                    position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)",
                    width: 40, height: 40, borderRadius: "50%",
                    ...tokens.glass.dark, border: "1px solid rgba(255,255,255,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: `all 0.2s ${tokens.ease.out}`,
                    "&:hover": { background: "rgba(255,255,255,0.2)", transform: "translateY(-50%) scale(1.08)" },
                  }}
                >
                  <ChevronLeft size={18} color="#fff" />
                </Box>
                <Box
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  role="button" aria-label="Next photo"
                  sx={{
                    position: "absolute", top: "50%", right: 14, transform: "translateY(-50%)",
                    width: 40, height: 40, borderRadius: "50%",
                    ...tokens.glass.dark, border: "1px solid rgba(255,255,255,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: `all 0.2s ${tokens.ease.out}`,
                    "&:hover": { background: "rgba(255,255,255,0.2)", transform: "translateY(-50%) scale(1.08)" },
                  }}
                >
                  <ChevronRight size={18} color="#fff" />
                </Box>
              </>
            )}

            {/* Status badge */}
            <Box
              sx={{
                position: "absolute", top: 16, left: 16,
                px: 1.5, py: 0.5, borderRadius: "8px",
                background: statusOverlay.bg,
                border: `1px solid ${statusOverlay.border}`,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: statusOverlay.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {statusOverlay.label}
              </Typography>
            </Box>

            {/* Top-right toolbar */}
            <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                role="button" aria-label="Open fullscreen gallery"
                sx={{
                  width: 34, height: 34, borderRadius: "8px",
                  ...tokens.glass.dark,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: `all 0.2s ${tokens.ease.out}`,
                  "&:hover": { background: "rgba(255,255,255,0.22)", transform: "scale(1.06)" },
                }}
              >
                <Maximize2 size={13} color="#fff" />
              </Box>

              {/* FIX #8 — завжди показуємо лічильник фото, навіть при одному */}
              <Box
                sx={{
                  height: 34, px: 1.25, borderRadius: "8px",
                  ...tokens.glass.dark,
                  display: "flex", alignItems: "center", gap: 0.6,
                }}
              >
                <Layers size={12} color="rgba(255,255,255,0.8)" />
                <Typography sx={{ color: "#fff", fontSize: "0.75rem", fontWeight: 500, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {activeImage + 1} / {images.length}
                </Typography>
              </Box>

              {isClient && (
                <Box
                  onClick={(e) => { e.stopPropagation(); handleFavorite(); }}
                  role="button"
                  aria-pressed={favorited}
                  aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                  sx={{
                    width: 34, height: 34, borderRadius: "8px",
                    ...tokens.glass.dark,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: favLoading ? "wait" : "pointer",
                    opacity: favLoading ? 0.6 : 1,
                    transition: `all 0.2s ${tokens.ease.out}`,
                    "&:hover": {
                      background: favorited ? alpha(theme.palette.primary.main, 0.35) : "rgba(255,255,255,0.22)",
                      transform: "scale(1.06)",
                    },
                    "&:active": { transform: "scale(0.95)" },
                  }}
                >
                  <Heart
                    size={15} color="#fff"
                    fill={favorited ? theme.palette.primary.main : "transparent"}
                    strokeWidth={2}
                    style={{ transition: `all 0.22s ${tokens.ease.snappy}`, transform: favorited ? "scale(1.1)" : "scale(1)" }}
                  />
                </Box>
              )}
            </Box>

            {/* Price — FIX #1 розмір зменшено */}
            <Box sx={{ position: "absolute", bottom: 20, left: 24 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.55rem", md: "2rem" },
                  color: "#ffffff",
                  textShadow: "0 2px 12px rgba(0,0,0,0.45)",
                  lineHeight: 1,
                  letterSpacing: "-0.025em",
                }}
              >
                {formatPrice(property.price)}
              </Typography>
              {pricePerM2 && (
                <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: "0.82rem", mt: 0.5, fontWeight: 400 }}>
                  {pricePerM2}
                </Typography>
              )}
            </Box>

            {/* Dots indicator */}
            {hasMultipleImages && images.length <= 8 && (
              <Box
                sx={{
                  position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
                  display: "flex", alignItems: "center", gap: 0.6,
                  px: 1.1, py: 0.55, borderRadius: "999px",
                  ...tokens.glass.dark, pointerEvents: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setActiveImage(i)}
                    role="button"
                    aria-label={`Go to photo ${i + 1}`}
                    sx={{
                      width: activeImage === i ? 20 : 5, height: 5, borderRadius: "999px",
                      cursor: "pointer",
                      background: activeImage === i ? "#fff" : "rgba(255,255,255,0.4)",
                      transition: `all 0.28s ${tokens.ease.out}`,
                      "&:hover": { background: activeImage === i ? "#fff" : "rgba(255,255,255,0.65)" },
                    }}
                  />
                ))}
              </Box>
            )}

            <Box role="status" aria-live="polite" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>
              Showing photo {activeImage + 1} of {images.length}
            </Box>
          </Box>
        </Box>

        {/* Thumbnails */}
        {hasMultipleImages && (
          <Box
            sx={{
              display: "flex", gap: 1.25, mb: 4, overflowX: "auto", pb: 0.5,
              "&::-webkit-scrollbar": { height: 3 },
              "&::-webkit-scrollbar-thumb": { background: alpha(theme.palette.text.primary, 0.12), borderRadius: 2 },
              animation: tokens.anim.fadeUp, animationDelay: "60ms", animationFillMode: "both",
            }}
          >
            {images.map((img, i) => (
              <Box
                key={i}
                onClick={() => setActiveImage(i)}
                role="button"
                aria-label={`Show photo ${i + 1}`}
                aria-current={activeImage === i}
                sx={{
                  flexShrink: 0,
                  width: { xs: 86, md: 104 }, height: { xs: 60, md: 72 },
                  borderRadius: `${tokens.radius.sm}px`, overflow: "hidden",
                  cursor: "pointer",
                  border: `2px solid ${activeImage === i ? theme.palette.primary.main : "transparent"}`,
                  boxShadow: activeImage === i ? tokens.shadow.md : tokens.shadow.xs,
                  opacity: activeImage === i ? 1 : 0.6,
                  transition: `all 0.22s ${tokens.ease.out}`,
                  "&:hover": { opacity: 1, transform: "translateY(-2px)", boxShadow: tokens.shadow.md },
                }}
              >
                <Box component="img" src={img} alt={`View ${i + 1}`} loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Box>
            ))}
          </Box>
        )}

        {/* ════════════ MAIN CONTENT GRID ════════════ */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
            gap: 4,
            alignItems: "start",
          }}
        >
          {/* ── LEFT ── */}
          <Box>
            {/* Title block */}
            <Box sx={{ mb: 3, animation: tokens.anim.fadeUp, animationDelay: "80ms", animationFillMode: "both" }}>

              {/* FIX #6 — status chip виділений, інші менш помітні */}
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 1.75, alignItems: "center" }}>
                {property.status && (
                  <Chip
                    label={property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    color={getStatusChipColor(property.status)}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.03em", height: 22 }}
                  />
                )}
                {property.isTopOffer && (
                  <Chip
                    icon={<Flame size={11} style={{ marginLeft: 5 }} />}
                    label="Top Offer"
                    size="small"
                    sx={{
                      fontWeight: 500, fontSize: "0.7rem", height: 22,
                      background: "rgba(239,68,68,0.08)", color: "#dc2626",
                      border: "1px solid rgba(239,68,68,0.2)",
                      "& .MuiChip-icon": { color: "#dc2626" },
                    }}
                  />
                )}
                {property.isPriceReduced && (
                  <Chip
                    icon={<TrendingDown size={11} style={{ marginLeft: 5 }} />}
                    label="Price Reduced"
                    size="small"
                    sx={{
                      fontWeight: 500, fontSize: "0.7rem", height: 22,
                      background: "rgba(59,130,246,0.08)", color: "#1d4ed8",
                      border: "1px solid rgba(59,130,246,0.2)",
                      "& .MuiChip-icon": { color: "#1d4ed8" },
                    }}
                  />
                )}
                {property.isRealtorVerified && (
                  <Chip
                    icon={<ShieldCheck size={11} style={{ marginLeft: 5 }} />}
                    label="Verified"
                    size="small"
                    sx={{
                      fontWeight: 500, fontSize: "0.7rem", height: 22,
                      background: "rgba(34,197,94,0.08)", color: "#15803d",
                      border: "1px solid rgba(34,197,94,0.2)",
                      "& .MuiChip-icon": { color: "#15803d" },
                    }}
                  />
                )}
              </Box>

              {/* FIX #1 — заголовок менший і легший */}
              <Typography
                component="h1"
                sx={{
                  textAlign: "left",
                  color: "text.primary",
                  mb: 1.25,
                  lineHeight: 1.2,
                  fontSize: { xs: "1.3rem", md: "1.65rem" },
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                }}
              >
                {property.title}
              </Typography>

              {/* FIX #7 — адреса в один рядок */}
              {locationLine && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.65, mb: 1.75 }}>
                  <MapPin size={13} color={theme.palette.primary.main} style={{ flexShrink: 0 }} />
                  <Typography sx={{ color: "text.secondary", fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.4 }}>
                    {locationLine}
                  </Typography>
                </Box>
              )}

              {/* Tags */}
              {property.tags?.length > 0 && (
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {property.tags.map((tag, i) => (
                    <Chip
                      key={i} label={tag} size="small" variant="outlined"
                      sx={{
                        background: alpha(theme.palette.primary.main, 0.04),
                        color: theme.palette.primary.dark,
                        fontWeight: 500, fontSize: "0.72rem",
                        borderColor: alpha(theme.palette.primary.main, 0.18),
                        height: 22,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Property Details grid */}
            <Box
              sx={{
                background: "background.paper",
                borderRadius: `${tokens.radius.lg}px`,
                border: "1px solid", borderColor: "divider",
                boxShadow: tokens.shadow.sm,
                p: { xs: 2.5, md: 3 },
                mb: 3,
                animation: tokens.anim.fadeUp, animationDelay: "120ms", animationFillMode: "both",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.68rem", fontWeight: 600, color: "text.disabled",
                  textTransform: "uppercase", letterSpacing: "0.1em", mb: 2,
                  display: "flex", alignItems: "center", gap: 0.75,
                }}
              >
                <Building2 size={13} />
                Property Details
              </Typography>

              <Grid container spacing={2}>
                {[
                  { label: "City",    value: property.city,    icon: MapPin },
                  { label: "Address", value: property.address, icon: Home },
                  { label: "Area",    value: property.area ? `${property.area} m²` : null, icon: Ruler },
                  { label: "Rooms",   value: property.rooms,   icon: Bed },
                  { label: "Floor",   value: property.floor,   icon: Layers },
                  { label: "Type",    value: property.propertyType || property.type, icon: Building2 },
                ]
                  .filter((item) => item.value != null && item.value !== "")
                  .map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <Grid item xs={6} sm={4} key={i}>
                        <Box
                          sx={{
                            display: "flex", flexDirection: "column", gap: 0.4,
                            p: 1.5, borderRadius: `${tokens.radius.sm}px`,
                            background: alpha(theme.palette.text.primary, 0.02),
                            border: "1px solid", borderColor: alpha(theme.palette.text.primary, 0.04),
                            height: "100%",
                            transition: `all 0.18s ${tokens.ease.out}`,
                            "&:hover": {
                              background: alpha(theme.palette.primary.main, 0.03),
                              borderColor: alpha(theme.palette.primary.main, 0.10),
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Icon size={11} color={theme.palette.text.disabled} strokeWidth={1.8} />
                            <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                              {item.label}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.9rem", lineHeight: 1.3, letterSpacing: "-0.005em", wordBreak: "break-word" }}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>

            {/* Description — FIX #2 text-align: left */}
            <Box
              sx={{
                background: "background.paper",
                borderRadius: `${tokens.radius.lg}px`,
                border: "1px solid", borderColor: "divider",
                p: { xs: 2.5, md: 3 },
                mb: 3,
                boxShadow: tokens.shadow.sm,
                animation: tokens.anim.fadeUp, animationDelay: "160ms", animationFillMode: "both",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.75 }}>
                <Sparkles size={13} color={theme.palette.primary.main} />
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  About this property
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.8,
                  fontSize: "0.9375rem",
                  textAlign: "left",        // FIX #2
                }}
              >
                {property.description || "No description provided for this property."}
              </Typography>
            </Box>

            {applyStatus && (
              <Alert
                severity={applyStatus}
                icon={applyStatus === "success" ? <CheckCircle size={16} /> : <CircleAlert size={16} />}
                sx={{ mb: 3, animation: tokens.anim.fadeIn }}
                onClose={() => setApplyStatus(null)}
              >
                {applyMessage}
              </Alert>
            )}
          </Box>

          {/* ── RIGHT: sidebar ── */}
          <Box
            sx={{
              display: "flex", flexDirection: "column", gap: 2.5,
              position: { md: "sticky" }, top: { md: 80 },
              animation: tokens.anim.fadeUp, animationDelay: "200ms", animationFillMode: "both",
            }}
          >
            {/* Apply card */}
            <Box
              sx={{
                background: "background.paper",
                borderRadius: `${tokens.radius.lg}px`,
                border: "1px solid", borderColor: "divider",
                p: 2.5, boxShadow: tokens.shadow.md,
                position: "relative", overflow: "hidden",
              }}
            >
              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: tokens.gradient.accent }} />

              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.6 }}>
                  Listing price
                </Typography>
                {/* FIX #1 — ціна в сайдбарі теж менша */}
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.75rem",
                    color: "text.primary",
                    lineHeight: 1,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {formatPrice(property.price)}
                </Typography>
                {pricePerM2 && (
                  <Typography sx={{ color: "text.disabled", fontSize: "0.8rem", mt: 0.6, fontWeight: 400 }}>
                    {pricePerM2}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {!token ? (
                <Box>
                  <Box
                    sx={{
                      background: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
                      borderRadius: `${tokens.radius.md}px`,
                      p: 1.75, mb: 1.75,
                      display: "flex", gap: 1.1, alignItems: "flex-start",
                    }}
                  >
                    <Lock size={15} color={theme.palette.primary.main} style={{ flexShrink: 0, marginTop: 2 }} />
                    <Typography sx={{ fontSize: "0.83rem", color: "text.secondary", lineHeight: 1.55 }}>
                      Sign in to apply or save this property to your favorites.
                    </Typography>
                  </Box>
                  <Button fullWidth variant="contained" color="primary" component={Link} to="/login" endIcon={<ArrowRight size={15} />} sx={{ py: 1.3, mb: 1 }}>
                    Sign in to Apply
                  </Button>
                  <Button fullWidth variant="outlined" component={Link} to="/register" sx={{ py: 1.1 }}>
                    Create an Account
                  </Button>
                </Box>
              ) : !isAvailable ? (
                <Box
                  sx={{
                    background: alpha(theme.palette.text.primary, 0.02),
                    border: "1px dashed", borderColor: "divider",
                    borderRadius: `${tokens.radius.md}px`,
                    p: 2.5, textAlign: "center",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                  }}
                >
                  <Box sx={{ width: 40, height: 40, borderRadius: "50%", background: alpha(theme.palette.text.primary, 0.04), display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Lock size={16} strokeWidth={1.75} color={theme.palette.text.disabled} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "text.primary", fontWeight: 600, fontSize: "0.9rem", mb: 0.25 }}>
                      No longer available
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.8rem", lineHeight: 1.5 }}>
                      This property is currently off the market
                    </Typography>
                  </Box>
                </Box>
              ) : applyStatus === "success" ? (
                <Box
                  sx={{
                    background: alpha(theme.palette.success.main, 0.07),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.22)}`,
                    borderRadius: `${tokens.radius.md}px`,
                    p: 2.5, textAlign: "center",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                  }}
                >
                  <Box sx={{ width: 44, height: 44, borderRadius: "50%", background: alpha(theme.palette.success.main, 0.12), display: "flex", alignItems: "center", justifyContent: "center", mb: 0.25 }}>
                    <CheckCircle size={24} color={theme.palette.success.main} />
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: theme.palette.success.main, fontSize: "0.95rem" }}>
                    Application Submitted!
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                    The owner will reach out to you shortly.
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* FIX #4 — disabled кнопка виглядає відключеною */}
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleApply}
                    disabled={applyLoading || !isClient}
                    endIcon={(!applyLoading && isClient) && <Send size={15} />}
                    sx={{
                      py: 1.35, mb: 1, fontSize: "0.9rem",
                      "&.Mui-disabled": {
                        background: alpha(theme.palette.text.primary, 0.08),
                        color: theme.palette.text.disabled,
                        boxShadow: "none",
                        cursor: "not-allowed",
                        pointerEvents: "auto",
                      },
                    }}
                  >
                    {applyLoading ? "Submitting…" : !isClient ? "Owners can't apply" : "Apply Now"}
                  </Button>

                  {applyStatus === "error" && (
                    <Alert severity="error" sx={{ mb: 1, fontSize: "0.78rem" }}>
                      {applyMessage}
                    </Alert>
                  )}

                  {isClient && (
                    <Button
                      fullWidth
                      variant={favorited ? "contained" : "outlined"}
                      onClick={handleFavorite}
                      disabled={favLoading}
                      startIcon={
                        <Heart
                          size={14}
                          fill={favorited ? "#ffffff" : "transparent"}
                          color={favorited ? "#ffffff" : theme.palette.primary.main}
                        />
                      }
                      sx={{
                        py: 1.1,
                        color: favorited ? "#fff" : theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                        background: favorited ? theme.palette.primary.main : "transparent",
                        "&:hover": {
                          background: favorited ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.06),
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      {favorited ? "Saved to Favorites" : "Save to Favorites"}
                    </Button>
                  )}
                </>
              )}
            </Box>

            {/* Owner block */}
            {property.owner && (
              <Box
                sx={{
                  background: "background.paper",
                  borderRadius: `${tokens.radius.lg}px`,
                  border: "1px solid", borderColor: "divider",
                  p: 2.5, boxShadow: tokens.shadow.sm,
                }}
              >
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.1em", mb: 2 }}>
                  Listed by
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, mb: 2 }}>
                  <Box
                    sx={{
                      width: 46, height: 46, borderRadius: "50%",
                      background: tokens.gradient.accent,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, boxShadow: tokens.shadow.accent,
                    }}
                  >
                    <User size={20} color="#ffffff" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.9375rem" }}>
                      {property.owner?.name || "Property Owner"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.78rem", color: "text.disabled" }}>
                      Property Owner
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {property.owner?.email && (
                    <Box
                      component="a"
                      href={`mailto:${property.owner.email}`}
                      sx={{
                        display: "flex", alignItems: "center", gap: 1.1,
                        textDecoration: "none", p: 1, borderRadius: `${tokens.radius.sm}px`,
                        transition: `background 0.18s ${tokens.ease.out}`,
                        "&:hover": { background: alpha(theme.palette.primary.main, 0.05) },
                      }}
                    >
                      <Box sx={{ width: 30, height: 30, borderRadius: `${tokens.radius.xs}px`, background: alpha(theme.palette.text.primary, 0.04), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Mail size={13} color={theme.palette.text.secondary} />
                      </Box>
                      <Typography sx={{ fontSize: "0.82rem", color: "text.secondary", wordBreak: "break-all" }}>
                        {property.owner.email}
                      </Typography>
                    </Box>
                  )}
                  {property.owner?.phone && (
                    <Box
                      component="a"
                      href={`tel:${property.owner.phone}`}
                      sx={{
                        display: "flex", alignItems: "center", gap: 1.1,
                        textDecoration: "none", p: 1, borderRadius: `${tokens.radius.sm}px`,
                        transition: `background 0.18s ${tokens.ease.out}`,
                        "&:hover": { background: alpha(theme.palette.primary.main, 0.05) },
                      }}
                    >
                      <Box sx={{ width: 30, height: 30, borderRadius: `${tokens.radius.xs}px`, background: alpha(theme.palette.text.primary, 0.04), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Phone size={13} color={theme.palette.text.secondary} />
                      </Box>
                      <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                        {property.owner.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <Box sx={{ mt: 7 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography sx={{ color: "text.primary", fontSize: { xs: "1.25rem", md: "1.5rem" }, fontWeight: 600, letterSpacing: "-0.015em" }}>
                  Similar Properties
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.875rem", mt: 0.4 }}>
                  You might also like these
                </Typography>
              </Box>
              <Button component={Link} to="/properties" endIcon={<ArrowRight size={15} />} sx={{ color: "primary.main", fontWeight: 500 }}>
                View all
              </Button>
            </Box>
            <PropertyGrid properties={similar} />
          </Box>
        )}
      </Box>

      <Lightbox
        open={lightboxOpen}
        images={images}
        activeIndex={activeImage}
        onClose={() => setLightboxOpen(false)}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </MainLayout>
  );
}