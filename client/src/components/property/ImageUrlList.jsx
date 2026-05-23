// src/components/property/ImageUrlList.jsx
import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, InputAdornment, IconButton,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Image as ImageIcon, Plus, X, Star, GripVertical, AlertCircle, Check,
} from "lucide-react";

import useTokens from "../../hooks/useTokens";

/**
 * Компонент для керування масивом URL-зображень об'єкта нерухомості.
 *
 * Props:
 *   • value:    string[] — поточний масив URL-ів (initialState з форми)
 *   • onChange: (newArray) => void
 *   • max:      число, ліміт зображень (default 10)
 *
 * Особливості:
 *   • Перше фото = cover (звісно, helper показує це користувачу).
 *   • Кожне фото можна:
 *       — переглянути (preview)
 *       — зробити cover (підняти на 1-у позицію)
 *       — видалити
 *   • Валідація: URL має бути коректним http(s) посиланням.
 *   • Якщо preview не вантажиться → червона рамка + AlertCircle.
 */
export default function ImageUrlList({ value = [], onChange, max = 10 }) {
  const theme  = useTheme();
  const tokens = useTokens();

  const [newUrl, setNewUrl] = useState("");
  const [error, setError]   = useState("");
  const [brokenUrls, setBrokenUrls] = useState(new Set());

  const isValidUrl = (url) => {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const addUrl = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid http(s) URL");
      return;
    }
    if (value.includes(trimmed)) {
      setError("This image is already added");
      return;
    }
    if (value.length >= max) {
      setError(`Maximum ${max} images allowed`);
      return;
    }
    onChange([...value, trimmed]);
    setNewUrl("");
    setError("");
  };

  const removeAt = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const makeCover = (index) => {
    if (index === 0) return;
    const next = [...value];
    const [moved] = next.splice(index, 1);
    next.unshift(moved);
    onChange(next);
  };

  const handleImgError = (url) => {
    setBrokenUrls((prev) => new Set(prev).add(url));
  };

  const handleImgLoad = (url) => {
    setBrokenUrls((prev) => {
      if (!prev.has(url)) return prev;
      const next = new Set(prev);
      next.delete(url);
      return next;
    });
  };

  return (
    <Box>
      {/* Input для додавання нового URL */}
      <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
        <TextField
          fullWidth
          placeholder="https://images.example.com/photo.jpg"
          value={newUrl}
          onChange={(e) => { setNewUrl(e.target.value); if (error) setError(""); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          error={!!error}
          helperText={error || ` ${value.length} / ${max} images added`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ImageIcon size={18} color={theme.palette.text.disabled} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          onClick={addUrl}
          variant="contained"
          color="primary"
          startIcon={<Plus size={16} />}
          disabled={!newUrl.trim() || value.length >= max}
          sx={{
            mt: 0,
            height: 48,
            px: 2.5,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          Add
        </Button>
      </Box>

      {/* Список доданих зображень */}
      {value.length > 0 && (
        <Box sx={{ mt: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {value.map((url, i) => {
            const isBroken = brokenUrls.has(url);
            const isCover  = i === 0;
            return (
              <Box
                key={`${url}-${i}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.25,
                  borderRadius: `${tokens.radius.md}px`,
                  border: "1px solid",
                  borderColor: isBroken
                    ? alpha(theme.palette.error.main, 0.3)
                    : isCover
                      ? alpha(theme.palette.primary.main, 0.3)
                      : "divider",
                  background: isCover
                    ? alpha(theme.palette.primary.main, 0.03)
                    : "background.paper",
                  transition: `all 0.2s ${tokens.ease.out}`,
                }}
              >
                {/* Drag-handle / номер */}
                <Box
                  sx={{
                    color: "text.disabled",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    minWidth: 22,
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </Box>

                {/* Preview */}
                <Box
                  sx={{
                    width: 64,
                    height: 48,
                    flexShrink: 0,
                    borderRadius: `${tokens.radius.sm}px`,
                    overflow: "hidden",
                    background: alpha(theme.palette.text.primary, 0.05),
                    border: isBroken
                      ? `1.5px solid ${alpha(theme.palette.error.main, 0.5)}`
                      : "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {isBroken ? (
                    <AlertCircle size={20} color={theme.palette.error.main} strokeWidth={1.8} />
                  ) : (
                    <Box
                      component="img"
                      src={url}
                      alt={`Property image ${i + 1}`}
                      onError={() => handleImgError(url)}
                      onLoad={() => handleImgLoad(url)}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </Box>

                {/* URL text */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      color: "text.primary",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={url}
                  >
                    {url}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                    {isCover && (
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.4,
                          px: 0.75,
                          py: 0.15,
                          borderRadius: "6px",
                          background: tokens.gradient.accent,
                          color: "#fff",
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        <Star size={9} fill="#fff" />
                        Cover
                      </Box>
                    )}
                    {isBroken && (
                      <Typography sx={{ fontSize: "0.7rem", color: "error.main", fontWeight: 600 }}>
                        Image failed to load
                      </Typography>
                    )}
                    {!isBroken && !isCover && (
                      <Typography sx={{ fontSize: "0.7rem", color: "text.disabled" }}>
                        Additional photo
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexShrink: 0 }}>
                  {!isCover && (
                    <IconButton
                      onClick={() => makeCover(i)}
                      size="small"
                      title="Make cover photo"
                      sx={{
                        color: "text.disabled",
                        "&:hover": {
                          color: theme.palette.primary.main,
                          background: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      <Star size={14} />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => removeAt(i)}
                    size="small"
                    title="Remove image"
                    sx={{
                      color: "text.disabled",
                      "&:hover": {
                        color: theme.palette.error.main,
                        background: alpha(theme.palette.error.main, 0.08),
                      },
                    }}
                  >
                    <X size={14} />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Empty state */}
      {value.length === 0 && (
        <Box
          sx={{
            mt: 2.5,
            p: 3,
            borderRadius: `${tokens.radius.md}px`,
            background: alpha(theme.palette.text.primary, 0.02),
            border: "1px dashed",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <ImageIcon size={28} color={theme.palette.text.disabled} strokeWidth={1.5} style={{ marginBottom: 8 }} />
          <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", fontWeight: 600 }}>
            No images added yet
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "text.disabled", mt: 0.5 }}>
            Paste an image URL above and press Add. First photo will be the cover.
          </Typography>
        </Box>
      )}
    </Box>
  );
} 