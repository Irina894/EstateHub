// src/components/property/PropertyGrid.jsx
import React from "react";
import { Box, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SearchX } from "lucide-react";

import PropertyCard from "./PropertyCard";
import EmptyState from "../ui/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import useTokens from "../../hooks/useTokens";

function CardSkeleton({ index = 0 }) {
  const tokens = useTokens();
  return (
    <Box
      sx={{
        borderRadius: `${tokens.radius.lg}px`,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        animation: `fade-in 0.5s ${tokens.ease.out} both`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <Skeleton variant="rectangular" height={230} animation="wave" />
      <Box sx={{ p: 2.5 }}>
        <Skeleton width="35%" height={14} sx={{ mb: 1, borderRadius: 1 }} />
        <Skeleton width="85%" height={20} sx={{ mb: 0.6, borderRadius: 1 }} />
        <Skeleton width="60%" height={20} sx={{ mb: 1.5, borderRadius: 1 }} />
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: "8px" }} />
          <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: "8px" }} />
        </Box>
        <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: `${tokens.radius.md}px` }} />
      </Box>
    </Box>
  );
}

/**
 * Сітка карток нерухомості.
 *
 * Можна передати власні `favoriteIds` + `onFavoriteToggle` (legacy режим),
 * або взагалі нічого не передавати — тоді сітка сама підтягне глобальний стан
 * з FavoritesContext.
 */
export default function PropertyGrid({
  properties = [],
  loading = false,
  favoriteIds,         // optional (legacy)
  onFavoriteToggle,    // optional (legacy)
}) {
  const theme  = useTheme();
  const tokens = useTokens();
  const { user } = useAuth();
  const fav = useFavorites();

  const isClient = user?.role === "client";
  const idsSet = React.useMemo(() => {
    if (Array.isArray(favoriteIds)) return new Set(favoriteIds);
    return fav.favoriteIds;
  }, [favoriteIds, fav.favoriteIds]);

  const handleToggle = onFavoriteToggle || fav.toggleFavorite;

  if (!loading && properties.length === 0) {
    return (
      <EmptyState
        icon={<SearchX size={36} color={theme.palette.primary.main} strokeWidth={1.5} />}
        title="No properties found"
        description="Try adjusting your filters or search criteria to find available properties."
      />
    );
  }

  return (
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
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} index={i} />)
        : properties.map((p, i) => (
            <Box
              key={p._id}
              sx={{
                animation: `fade-up 0.55s ${tokens.ease.out} both`,
                animationDelay: `${Math.min(i, 8) * 50}ms`,
              }}
            >
              <PropertyCard
                property={p}
                isFavorited={isClient && idsSet.has(p._id)}
                onFavoriteToggle={isClient ? handleToggle : undefined}
              />
            </Box>
          ))}
    </Box>
  );
}