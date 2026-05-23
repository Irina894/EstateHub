// src/components/property/PropertyCard.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { MapPin, Bed, Ruler, Heart, ArrowUpRight, ImageOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatusChip from "../ui/StatusChip";
import PropertyTags from "./PropertyTags";
import { useAuth } from "../../context/AuthContext";
import useTokens from "../../hooks/useTokens";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80";

/* ════════════════════════════════════════════════════════════════════════
   ЗМІНИ ТИПОГРАФІКИ / МАСШТАБІВ (за фідбеком):

   • Title (заголовок картки)
       — fontSize 0.95rem (раніше 1rem) — менш масивний
       — fontWeight 600 (раніше 700) — м'якший
       — letterSpacing -0.005em (раніше -0.01em) — НЕ агресивно щільний
       — lineHeight 1.4 (раніше 1.3) — більше повітря
       — clamp ОДНА лінія (раніше 2) — заголовок не "ріже" картку на 3 рядки

   • Ціна на зображенні
       — НЕ накладається на фото більше: винесена в чорну semi-glass smug-плашку
         знизу зліва, з рамкою — добре читається на будь-якому фоні
       — fontSize 1.15rem (раніше 1.35rem) — менш доміна
       — fontWeight 700 (раніше 800)

   • Бейджі характеристик (rooms / area)
       — padding 0.55/1.4 (раніше 0.5/1.1) — більше внутрішнього простору
       — gap 0.7 (раніше 0.6) — простір між іконкою і текстом
       — fontSize 0.78rem (раніше 0.74rem) — трохи більший, але через ширший
         padding ВИГЛЯДАЄ збалансованіше
       — strokeWidth 1.75 на іконках (раніше 2) — витонченіше
   ════════════════════════════════════════════════════════════════════════ */

export default function PropertyCard({
  property,
  isFavorited = false,
  onFavoriteToggle,
}) {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favLoading, setFavLoading] = useState(false);

  const imgRef = useRef(null);
  const [imgStatus, setImgStatus] = useState("loading");

  if (!property) return null;
  const { _id, title, city, price, area, rooms, status, tags, images } = property;
  const initialSrc = images?.[0] || PLACEHOLDER;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const pricePerM2 = area && price ? Math.round(price / area) : null;

  useEffect(() => {
    setImgStatus("loading");
    setCurrentSrc(initialSrc);
  }, [initialSrc]);

  useEffect(() => {
    const node = imgRef.current;
    if (!node) return;
    if (node.complete && node.naturalWidth > 0) {
      setImgStatus("loaded");
    }
  }, [currentSrc]);

  const handleImgLoad = () => setImgStatus("loaded");
  const handleImgError = () => {
    if (currentSrc !== PLACEHOLDER) {
      setCurrentSrc(PLACEHOLDER);
      setImgStatus("loading");
    } else {
      setImgStatus("error");
    }
  };

  const handleFav = async (e) => {
    e.stopPropagation();
    if (!onFavoriteToggle || favLoading) return;
    setFavLoading(true);
    try {
      await onFavoriteToggle(_id, isFavorited);
    } finally {
      setFavLoading(false);
    }
  };

  const go = () => navigate(`/properties/${_id}`);

  return (
    <Box
      onClick={go}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go()}
      sx={{
        position: "relative",
        bgcolor: "background.paper",
        borderRadius: `${tokens.radius.lg}px`,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: tokens.shadow.sm,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        transition: `transform 0.35s ${tokens.ease.out}, box-shadow 0.35s ${tokens.ease.out}, border-color 0.25s`,
        animation: tokens.anim.fadeUp,
        outline: "none",
        "&:hover, &:focus-visible": {
          transform: "translateY(-6px)",
          boxShadow: tokens.shadow.lg,
          borderColor: alpha(theme.palette.primary.main, 0.25),
          "& .card-img": { transform: "scale(1.07)" },
          "& .card-cta": { background: tokens.gradient.accent, color: "#fff" },
          "& .card-cta svg": { transform: "translate(2px,-2px)" },
        },
      }}
    >
      {/* ── Image area ── */}
      <Box
        sx={{
          position: "relative",
          height: 230,
          overflow: "hidden",
          bgcolor: "#E8E6E1",
          flexShrink: 0,
        }}
      >
        {imgStatus === "loading" && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
            sx={{ position: "absolute", inset: 0, zIndex: 1 }}
          />
        )}

        {imgStatus === "error" && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: theme.palette.text.disabled,
              zIndex: 1,
            }}
          >
            <ImageOff size={28} strokeWidth={1.5} />
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
              Image unavailable
            </Typography>
          </Box>
        )}

        <Box
          ref={imgRef}
          component="img"
          src={currentSrc}
          alt={title}
          className="card-img"
          onLoad={handleImgLoad}
          onError={handleImgError}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imgStatus === "loaded" ? 1 : 0,
            transition: `opacity 0.4s ${tokens.ease.out}, transform 0.6s ${tokens.ease.out}`,
          }}
        />

        {/* Gradient overlay — лагідніший, нижче і темніше тільки в нижній чверті */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(38,38,38,0) 55%, rgba(38,38,38,0.55) 100%)",
            pointerEvents: "none",
            opacity: imgStatus === "loaded" ? 1 : 0,
            transition: `opacity 0.4s ${tokens.ease.out}`,
          }}
        />

        {/* Top-left: tags */}
        {tags?.length > 0 && (
          <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
            <PropertyTags tags={tags} />
          </Box>
        )}

        {/* Top-right: status */}
        <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <StatusChip status={status} />
        </Box>

        {/* ── Price plaque (НЕ накладається на середину фото) ── */}
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
            opacity: imgStatus === "loaded" ? 1 : 0,
            transition: `opacity 0.4s ${tokens.ease.out}`,
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
            ${price?.toLocaleString()}
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

        {/* favorite (glass circle) */}
        {user?.role === "client" && (
          <Box
            onClick={handleFav}
            role="button"
            aria-pressed={isFavorited}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              width: 38,
              height: 38,
              borderRadius: "50%",
              ...tokens.glass.dark,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: favLoading ? 0.55 : 1,
              transition: `all 0.2s ${tokens.ease.out}`,
              zIndex: 3,
              "&:hover": {
                transform: "scale(1.12)",
                background: isFavorited
                  ? alpha(theme.palette.primary.main, 0.35)
                  : "rgba(255,255,255,0.22)",
              },
              "&:active": { transform: "scale(0.95)" },
            }}
          >
            <Heart
              size={16}
              color="#fff"
              fill={isFavorited ? theme.palette.primary.main : "transparent"}
              strokeWidth={2.2}
              style={{
                transition: `all 0.25s ${tokens.ease.snappy}`,
                transform: isFavorited ? "scale(1.15)" : "scale(1)",
              }}
            />
          </Box>
        )}
      </Box>

      {/* ── Body ── */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 1.25,
        }}
      >
        {/* City */}
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

        {/* Title — left-aligned, м'якший, в одну лінію з ellipsis */}
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

        {/* Meta pills — з ширшим padding */}
        <Box sx={{ display: "flex", gap: 0.8, mt: 0.1, flexWrap: "wrap" }}>
          {rooms && <MetaPill icon={<Bed size={12} strokeWidth={1.75} />} label={`${rooms} rooms`} />}
          {area  && <MetaPill icon={<Ruler size={12} strokeWidth={1.75} />} label={`${area} m²`} />}
        </Box>

        {/* CTA */}
        <Box
          className="card-cta"
          onClick={(e) => {
            e.stopPropagation();
            go();
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
          <span>View Details</span>
          <ArrowUpRight size={15} strokeWidth={2} />
        </Box>
      </Box>
    </Box>
  );
}

/* ─── Meta-pill з більшим внутрішнім простором ─── */
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