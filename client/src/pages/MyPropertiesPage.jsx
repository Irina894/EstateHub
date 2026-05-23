// src/pages/MyPropertiesPage.jsx
import React, { useEffect, useState } from "react";
import {
  Alert, Box, Button, Typography, Skeleton, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Building2, Plus, Edit3, Trash2, Eye, MapPin, Bed, Ruler,
  TrendingUp, CheckCircle, ArrowRight, ImageOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import EmptyState from "../components/ui/EmptyState";
import { deleteProperty, getMyProperties } from "../api/propertyApi";
import useTokens from "../hooks/useTokens";

const STATUS_CONFIG = {
  available: { label: "Available", color: "#15803d", bg: "rgba(34,197,94,0.08)" },
  sold:      { label: "Sold",      color: "#dc2626", bg: "rgba(239,68,68,0.08)" },
  rented:    { label: "Rented",    color: "#1d4ed8", bg: "rgba(59,130,246,0.08)" },
  pending:   { label: "Pending",   color: "#b45309", bg: "rgba(245,158,11,0.08)" },
};

/* ────────────────────────────────────────────────────────────────────── */

function PropertyRow({ property, onDelete, index }) {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();
  const st = STATUS_CONFIG[property.status?.toLowerCase()] || STATUS_CONFIG.available;
  const img = property.images?.[0];
  const pricePerM2 =
    property.area && property.price ? Math.round(property.price / property.area) : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        background: "background.paper",
        borderRadius: `${tokens.radius.lg}px`,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        boxShadow: tokens.shadow.sm,
        transition: `all 0.25s ${tokens.ease.out}`,
        animation: `fade-up 0.5s ${tokens.ease.out} both`,
        animationDelay: `${Math.min(index, 6) * 60}ms`,
        "&:hover": {
          boxShadow: tokens.shadow.md,
          borderColor: alpha(theme.palette.primary.main, 0.2),
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* image */}
      <Box
        onClick={() => navigate(`/properties/${property._id}`)}
        sx={{
          width: { xs: "100%", sm: 220 },
          height: { xs: 180, sm: "auto" },
          minHeight: { sm: 170 },
          flexShrink: 0,
          background: img ? `url(${img})` : alpha(theme.palette.text.primary, 0.04),
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: "pointer",
          position: "relative",
          transition: `filter 0.25s ${tokens.ease.out}`,
          "&:hover": { filter: "brightness(1.05)" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!img && <ImageOff size={28} color={theme.palette.text.disabled} />}
      </Box>

      {/* content */}
      <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* fix 1: fontWeight 500, fontSize 0.95rem — менш жирно */}
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "text.primary",
                mb: 0.5,
                cursor: "pointer",
                transition: "color 0.15s",
                "&:hover": { color: "primary.main" },
                letterSpacing: "-0.01em",
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              onClick={() => navigate(`/properties/${property._id}`)}
            >
              {property.title}
            </Typography>
            {property.city && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <MapPin size={13} color={theme.palette.text.disabled} />
                <Typography sx={{ fontSize: "0.82rem", color: "text.disabled" }}>
                  {property.city}{property.address ? `, ${property.address}` : ""}
                </Typography>
              </Box>
            )}
          </Box>

          {/* fix 5: менший padding, без border, тихіший badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 0.75,
              py: 0.2,
              borderRadius: "5px",
              background: st.bg,
              color: st.color,
              fontWeight: 600,
              fontSize: "0.63rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}
          >
            {st.label}
          </Box>
        </Box>

        {/* fix 4: auto-fit замість repeat(4, 1fr) — не розтягується */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, // Повертаємо 4 рівні колонки на десктопі
            gap: 2,
            py: 2,
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
            mb: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "0.68rem", color: "text.disabled", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.3 }}>
              Price
            </Typography>
            <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
              ${property.price?.toLocaleString()}
            </Typography>
          </Box>

          {/* fix 2: Per m² — text.secondary замість primary.main */}
          {pricePerM2 && (
           <Box>
            <Typography sx={{ fontSize: "0.68rem", color: "text.disabled", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.3 }}>
              Per m²
            </Typography>
            <Typography sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
              {pricePerM2 ? `$${pricePerM2.toLocaleString()}` : "—"}
            </Typography>
          </Box>
          )}
          {property.area && (
           <Box>
            <Typography sx={{ fontSize: "0.68rem", color: "text.disabled", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.3 }}>
              Area
            </Typography>
            <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
              {property.area ? `${property.area} m²` : "—"}
            </Typography>
          </Box>
          )}
          <Box>
            <Typography sx={{ fontSize: "0.68rem", color: "text.disabled", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.3 }}>
              Views
            </Typography>
            <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
              {property.viewsCount || 0}
            </Typography>
          </Box>
        </Box>

        {/* fix 6: всі кнопки — єдиний стиль text (без outlined) */}
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end", flexWrap: "wrap", mt: "auto" }}>
          <Button
            component={Link}
            to={`/properties/${property._id}`}
            size="small"
            startIcon={<Eye size={14} />}
            sx={{ color: "text.secondary", fontSize: "0.8rem", fontWeight: 500 }}
          >
            Preview
          </Button>
          <Button
            component={Link}
            to={`/edit-property/${property._id}`}
            size="small"
            startIcon={<Edit3 size={14} />}
            sx={{ color: "text.secondary", fontSize: "0.8rem", fontWeight: 500 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            startIcon={<Trash2 size={14} />}
            onClick={() => onDelete(property)}
            sx={{
              color: "error.main",
              fontSize: "0.8rem",
              fontWeight: 500,
              "&:hover": { background: alpha(theme.palette.error.main, 0.06) },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Main page
   ──────────────────────────────────────────────────────────────────────── */
export default function MyPropertiesPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyProperties();
      setProperties(Array.isArray(data) ? data : data?.properties || []);
    } catch (err) {
      if (err?.response?.status !== 401) {
        setError("Failed to load your properties");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProperties(); }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteProperty(confirmDelete._id);
      setConfirmDelete(null);
      loadProperties();
    } catch (err) {
      setError("Failed to delete property");
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = properties.filter((p) => p.status?.toLowerCase() === "available").length;

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>

        {/* fix 7: Header — прибрано градієнтний box, проста іконка */}
        {/* Header */}
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
          {/* Контейнер для тексту ліворуч */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            
            {/* Рядок з іконкою та головним заголовком */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
              
              {/* Додано обгортку для іконки точнісінько як у My Favorites */}
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: `${tokens.radius.md}px`,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Building2 
                  size={18} 
                  color={theme.palette.primary.main} 
                />
              </Box>
              
              <Typography variant="h4" sx={{ color: "text.primary", fontWeight: 700, lineHeight: 1.15 }}>
                My Properties
              </Typography>
            </Box>

            {/* Статистика: ідеально вирівняна під заголовком (42px іконка + 16px відступ = 58px) */}
            <Typography sx={{ color: "text.disabled", fontSize: "0.9rem", pl: "58px" }}>
              {loading 
                ? "Loading…" 
                : `${properties.length} listing${properties.length === 1 ? "" : "s"} • ${activeCount} available`}
            </Typography>

          </Box>

          {/* Кнопка праворуч */}
          <Button
            component={Link}
            to="/properties/create"
            variant="contained"
            color="primary"
            startIcon={<Plus size={16} />}
            sx={{ flexShrink: 0 }}
          >
            Add Property
          </Button>
        </Box>
        {/* fix 3: Stats — fontSize 1.4rem, padding p:2, компактніше */}
        {!loading && properties.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
              mb: 4,
              animation: tokens.anim.fadeUp,
              animationDelay: "80ms",
              animationFillMode: "both",
            }}
          >
            <Box
              sx={{
                background: "background.paper",
                borderRadius: `${tokens.radius.lg}px`,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: tokens.shadow.sm,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40, height: 40,
                  borderRadius: `${tokens.radius.md}px`,
                  background: alpha(theme.palette.primary.main, 0.08),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: theme.palette.primary.main,
                  flexShrink: 0,
                }}
              >
                <Building2 size={18} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1.4rem", color: "text.primary", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {properties.length}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "text.disabled", fontWeight: 500, mt: 0.4 }}>
                  Total Listings
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                background: "background.paper",
                borderRadius: `${tokens.radius.lg}px`,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: tokens.shadow.sm,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40, height: 40,
                  borderRadius: `${tokens.radius.md}px`,
                  background: alpha("#22c55e", 0.1),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#22c55e",
                  flexShrink: 0,
                }}
              >
                <CheckCircle size={18} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1.4rem", color: "text.primary", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {activeCount}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "text.disabled", fontWeight: 500, mt: 0.4 }}>
                  Active Available
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* body */}
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={210} sx={{ borderRadius: `${tokens.radius.lg}px` }} animation="wave" />
            ))}
          </Box>
        ) : properties.length === 0 ? (
          <EmptyState
            icon={<Building2 size={36} color={theme.palette.primary.main} strokeWidth={1.5} />}
            title="No properties yet"
            description="Start by creating your first listing — it only takes a few minutes."
            actionLabel="Create First Listing"
            onAction={() => navigate("/properties/create")}
          />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {properties.map((p, i) => (
              <PropertyRow key={p._id} property={p} index={i} onDelete={setConfirmDelete} />
            ))}
          </Box>
        )}
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog
        open={Boolean(confirmDelete)}
        onClose={() => !deleting && setConfirmDelete(null)}
        PaperProps={{
          sx: {
            borderRadius: `${tokens.radius.lg}px`,
            maxWidth: 420,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "text.primary", pb: 1 }}>
          Delete this property?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.65 }}>
            <Box component="strong" sx={{ color: "text.primary" }}>{confirmDelete?.title}</Box> will be permanently removed.
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setConfirmDelete(null)} disabled={deleting} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            color="error"
            startIcon={!deleting && <Trash2 size={14} />}
          >
            {deleting ? "Deleting…" : "Delete property"}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}