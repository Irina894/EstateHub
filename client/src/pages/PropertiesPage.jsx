// src/pages/PropertiesPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, MenuItem, Button,
  InputAdornment, Collapse,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Search, SlidersHorizontal, X, ChevronDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PropertyGrid from "../components/property/PropertyGrid";
import { getAllProperties } from "../api/propertyApi";
import useTokens from "../hooks/useTokens";
import { UKRAINIAN_CITIES, PROPERTY_TYPES } from "../constants/locations";

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest first" },
  { value: "price_asc",  label: "Price: low → high" },
  { value: "price_desc", label: "Price: high → low" },
];

// беремо топ-6 популярних міст для фільтра (можна змінити число)
const CITIES = UKRAINIAN_CITIES.slice(0, 12);
// Типи з тим же enum, що і форма (узгоджено з бекендом)
const TYPES  = PROPERTY_TYPES.map((t) => t.label);

function sortList(arr, sort) {
  const c = [...arr];
  if (sort === "price_asc")  return c.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return c.sort((a, b) => b.price - a.price);
  return c.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/* ─── inputs для темного hero ─── */
const darkInput = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: 500,
    fontSize: "0.92rem",
    "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.32)" },
    "&.Mui-focused fieldset": { borderColor: "#D95829" },
    "& input": { color: "#fff", padding: "11px 12px" },
    "& input::placeholder": { color: "rgba(255,255,255,0.4)", fontWeight: 400 },
    "& .MuiSelect-icon": { color: "rgba(255,255,255,0.55)" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.55)" },
};

export default function PropertiesPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "", city: "", type: "", minPrice: "", maxPrice: "", sort: "newest",
  });

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getAllProperties();
        if (active) setProperties(Array.isArray(data) ? data : data?.properties || []);
      } catch (e) {
        console.error("getAllProperties:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const clear = () =>
    setFilters({ search: "", city: "", type: "", minPrice: "", maxPrice: "", sort: "newest" });

  const filtered = sortList(
    properties.filter((p) => {
      if (filters.search   && !p.title?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.city     && p.city  !== filters.city)              return false;
    if (filters.type && p.propertyType?.toLowerCase() !== filters.type.toLowerCase()) return false;
      if (filters.minPrice && p.price < Number(filters.minPrice))    return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice))    return false;
      return true;
    }),
    filters.sort,
  );

  const activeFCount =
    [filters.city, filters.type, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  return (
    <Box>
      {/* ════════════ HERO ════════════ */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: tokens.gradient.hero,
          py: { xs: 7, md: 11 },
          px: { xs: 2, md: 5 },
        }}
      >
        {[
          { size: 460, top: -140, right: -120, opacity: 0.22 },
          { size: 300, bottom: -100, left: -90, opacity: 0.14 },
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
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Back button */}
        <Button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
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

        <Box sx={{ maxWidth: 880, mx: "auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Pill */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.6,
              borderRadius: "99px",
              mb: 3,
              background: alpha(theme.palette.primary.main, 0.18),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              backdropFilter: "blur(6px)",
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.light" }} />
            <Typography
              sx={{
                color: "primary.light",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {properties.length}+ Active Listings
            </Typography>
          </Box>

          {/*
           * ЗМІНИ HERO-ЗАГОЛОВКА:
           *  • fontWeight 700 (раніше 800) — менш агресивно
           *  • letterSpacing -0.015em (раніше -0.03em) — більше повітря між літер
           *  • lineHeight 1.1 (раніше 1.05) — м'якіше
           *  • розмір зменшено на md: 3rem (раніше 3.3rem)
           */}
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              mb: 1.5,
              fontSize: { xs: "2.1rem", md: "3rem" },
              letterSpacing: "-0.015em",
              lineHeight: 1.1,
            }}
          >
            Find Your{" "}
            <Box
              component="span"
              sx={{
                background: tokens.gradient.accent,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Perfect
            </Box>{" "}
            Property
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", mb: 5, fontSize: "1rem", lineHeight: 1.6 }}>
            Browse premium real estate across Ukraine's top cities
          </Typography>

          {/*
           * ЗМІНИ SEARCH-BAR:
           *  • Search-поле має дещо більший padding (через input padding)
           *  • Filters і Sort тепер ВІЗУАЛЬНО ЛЕГШІ:
           *      — colored з прозорим тлом
           *      — borderColor м'якший, шрифт тонший
           *      — менші вкладені padding
           *      — однакова висота з input
           *  • gap 1 (раніше 1.5) — компактніше
           */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "stretch",
              flexWrap: { xs: "wrap", sm: "nowrap" },
              ...tokens.glass.dark,
              borderRadius: "16px",
              p: 1,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search by title, neighbourhood…"
              value={filters.search}
              onChange={set("search")}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="rgba(255,255,255,0.45)" strokeWidth={1.8} />
                  </InputAdornment>
                ),
              }}
              sx={darkInput}
            />
            <TextField
              select
              value={filters.sort}
              onChange={set("sort")}
              size="small"
              SelectProps={{
                IconComponent: () => (
                  <ChevronDown
                    size={14}
                    style={{ marginRight: 10, color: "rgba(255,255,255,0.5)" }}
                  />
                ),
              }}
              sx={{
                minWidth: 165,
                ...darkInput,
                "& .MuiOutlinedInput-root": {
                  ...darkInput["& .MuiOutlinedInput-root"],
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  "& .MuiSelect-select": { py: "11px" },
                },
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value} sx={{ fontSize: "0.875rem" }}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>

            {/* Filters — легша кнопка, без border, чіткіша */}
            <Button
              onClick={() => setFiltersOpen((v) => !v)}
              startIcon={<SlidersHorizontal size={14} strokeWidth={1.8} />}
              sx={{
                whiteSpace: "nowrap",
                minWidth: 110,
                fontSize: "0.85rem",
                fontWeight: 500,
                color: filtersOpen ? "primary.light" : "rgba(255,255,255,0.78)",
                bgcolor: filtersOpen
                  ? alpha(theme.palette.primary.main, 0.15)
                  : "rgba(255,255,255,0.04)",
                borderRadius: "12px",
                border: `1px solid ${filtersOpen
                  ? alpha(theme.palette.primary.main, 0.45)
                  : "rgba(255,255,255,0.1)"
                }`,
                px: 2,
                "&:hover": {
                  bgcolor: filtersOpen
                    ? alpha(theme.palette.primary.main, 0.2)
                    : "rgba(255,255,255,0.08)",
                  borderColor: filtersOpen
                    ? alpha(theme.palette.primary.main, 0.55)
                    : "rgba(255,255,255,0.22)",
                },
                position: "relative",
              }}
            >
              Filters
              {activeFCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {activeFCount}
                </Box>
              )}
            </Button>
          </Box>

          <Collapse in={filtersOpen}>
            <Box
              sx={{
                mt: 1.5,
                p: 2,
                ...tokens.glass.dark,
                borderRadius: "16px",
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4,1fr)" },
                gap: 1.5,
              }}
            >
              {[
                { key: "city", label: "City", options: CITIES },
                { key: "type", label: "Type", options: TYPES },
              ].map(({ key, label, options }) => (
                <TextField
                  key={key}
                  select
                  label={label}
                  value={filters[key]}
                  onChange={set(key)}
                  size="small"
                  sx={darkInput}
                >
                  <MenuItem value="">All {label.toLowerCase()}s</MenuItem>
                  {options.map((o) => (
                    <MenuItem key={o} value={o}>{o}</MenuItem>
                  ))}
                </TextField>
              ))}
              <TextField
                label="Min price $"
                value={filters.minPrice}
                onChange={set("minPrice")}
                type="number"
                size="small"
                sx={darkInput}
              />
              <TextField
                label="Max price $"
                value={filters.maxPrice}
                onChange={set("maxPrice")}
                type="number"
                size="small"
                sx={darkInput}
              />
            </Box>
            {activeFCount > 0 && (
              <Box sx={{ mt: 1, textAlign: "right" }}>
                <Button
                  startIcon={<X size={13} />}
                  onClick={clear}
                  size="small"
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.8rem",
                    "&:hover": { color: "#fff" },
                  }}
                >
                  Clear filters
                </Button>
              </Box>
            )}
          </Collapse>
        </Box>
      </Box>

      {/* ════════════ GRID ════════════ */}
      <Box sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, md: 5 }, py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              color="text.primary"
              sx={{ fontWeight: 700, letterSpacing: "-0.015em" }}
            >
              {loading ? "Loading…" : `${filtered.length} Properties`}
            </Typography>
            {!loading && (
              <Typography variant="body2" color="text.secondary" mt={0.3}>
                Showing {filtered.length} of {properties.length} listings
              </Typography>
            )}
          </Box>
          {activeFCount > 0 && (
            <Button
              size="small"
              startIcon={<X size={13} />}
              onClick={clear}
              sx={{
                color: "primary.main",
                fontWeight: 600,
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.07) },
              }}
            >
              Clear all
            </Button>
          )}
        </Box>

        <PropertyGrid properties={filtered} loading={loading} />
      </Box>
    </Box>
  );
}