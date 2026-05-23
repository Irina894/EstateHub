// src/pages/MyFavoritesPage.jsx
import React from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Heart, ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import PropertyGrid from "../components/property/PropertyGrid";
import { useFavorites } from "../context/FavoritesContext";
import useTokens from "../hooks/useTokens";

export default function MyFavoritesPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const { favorites, loading, error, refresh } = useFavorites();

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        {/* ── Header (узгоджений з MyApplications) ── */}
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
            
            {/* Рядок з іконкою та заголовком */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
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
                <Heart
                  size={18}
                  color={theme.palette.primary.main}
                  fill={alpha(theme.palette.primary.main, 0.25)}
                />
              </Box>
              <Typography variant="h4" sx={{ color: "text.primary", fontWeight: 700, lineHeight: 1.15 }}>
                My Favorites
              </Typography>
            </Box>

            {/* Статистика: стоїть ідеально під текстом завдяки pl: "72px" */}
            <Typography sx={{ color: "text.disabled", fontSize: "0.9rem", pl: "72px" }}>
              {loading
                ? "Loading your saved properties…"
                : `${favorites.length} saved ${favorites.length === 1 ? "property" : "properties"}`}
            </Typography>
          </Box>

          {/* Кнопка Refresh або інші елементи праворуч (якщо потрібні) */}
          {!loading && favorites.length > 0 && (
            <Button
              startIcon={<RefreshCw size={15} />}
              onClick={refresh}
              variant="outlined"
              sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
            >
              Refresh
            </Button>
          )}
        </Box>



        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={refresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {!loading && !error && favorites.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 8, md: 12 },
              px: 4,
              background: "background.paper",
              borderRadius: `${tokens.radius.xl}px`,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: tokens.shadow.sm,
              animation: tokens.anim.fadeUp,
            }}
          >
            <Box
              sx={{
                width: 96, height: 96,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.02)} 70%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: -10,
                  borderRadius: "50%",
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.15)}`,
                  animation: "pulse-soft 3s ease-in-out infinite",
                },
              }}
            >
              <Heart size={40} color={theme.palette.primary.main} strokeWidth={1.8} />
            </Box>
            <Typography variant="h5" sx={{ color: "text.primary", mb: 1.5 }}>
              No favorites yet
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 4, maxWidth: 380, mx: "auto", lineHeight: 1.7 }}>
              Start exploring properties and save the ones you love — they'll appear here for quick access.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/properties"
              endIcon={<ArrowRight size={16} />}
              sx={{ px: 3.5, py: 1.3, fontWeight: 700 }}
            >
              Browse Properties
            </Button>
          </Box>
        ) : (
          <PropertyGrid properties={favorites} loading={loading} />
        )}
      </Box>
    </MainLayout>
  );
}