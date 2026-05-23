// src/components/property/PropertyForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, MenuItem, Alert,
  InputAdornment, Autocomplete,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Home, FileText, DollarSign, MapPin, Building2, Bed, Ruler,
  Tag, Save, X, Sparkles, ArrowLeft, CheckCircle, Layers, Images,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import useTokens from "../../hooks/useTokens";
import ImageUrlList from "./ImageUrlList";
import {
  UKRAINIAN_CITIES,
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
} from "../../constants/locations";

const EMPTY = {
  title: "", description: "", price: "", city: "", address: "",
  propertyType: "", rooms: "", area: "", floor: "", totalFloors: "",
  status: "available", images: [],
  isTopOffer: false, isPriceReduced: false, isRealtorVerified: false,
  supermarket: false, supermarketMinutes: "",
  school: false, schoolMinutes: "",
  transport: false, transportMinutes: "",
};

/* ─── Section wrapper ─── */
function Section({ icon, title, description, children }) {
  const theme  = useTheme();
  const tokens = useTokens();
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: `${tokens.radius.lg}px`,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: tokens.shadow.sm,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          background: alpha(theme.palette.primary.main, 0.02),
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start", // Жорстко ліворуч
          gap: 2, 
        }}
      >
        <Box
          sx={{
            width: 38, height: 38,
            borderRadius: `${tokens.radius.sm}px`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)}, ${alpha(theme.palette.primary.main, 0.05)})`,
            color: theme.palette.primary.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          {icon}
        </Box>
        {/* Текстовий блок: жорстке вирівнювання ліворуч */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "1rem", textAlign: "left" }}>
            {title}
          </Typography>
          {description && (
            <Typography sx={{ fontSize: "0.78rem", color: "text.disabled", mt: 0.25, textAlign: "left" }}>
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>{children}</Box>
    </Box>
  );
}

/* ─── Checkbox card ─── */
function CheckCard({ icon, label, checked, onChange, name, accent = "#D95829" }) {
  const theme  = useTheme();
  const tokens = useTokens();
  return (
    <Box
      onClick={() => onChange({ target: { name, type: "checkbox", checked: !checked } })}
      sx={{
        display: "flex", alignItems: "center", gap: 1.5,
        p: 1.75,
        borderRadius: `${tokens.radius.md}px`,
        border: "2px solid",
        borderColor: checked ? accent : "divider",
        background: checked ? alpha(accent, 0.05) : "background.paper",
        cursor: "pointer",
        transition: `all 0.2s ${tokens.ease.out}`,
        userSelect: "none",
        "&:hover": {
          borderColor: checked ? accent : alpha(accent, 0.3),
          background: alpha(accent, 0.04),
        },
      }}
    >
      <Box
        sx={{
          width: 38, height: 38,
          borderRadius: `${tokens.radius.sm}px`,
          background: checked
            ? `linear-gradient(135deg, ${accent}, ${alpha(accent, 0.8)})`
            : alpha(theme.palette.text.primary, 0.05),
          color: checked ? "#fff" : theme.palette.text.disabled,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          transition: `all 0.2s ${tokens.ease.out}`,
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ flex: 1, fontWeight: 600, color: "text.primary", fontSize: "0.88rem" }}>
        {label}
      </Typography>
      <Box
        sx={{
          width: 20, height: 20, borderRadius: "6px",
          border: "2px solid",
          borderColor: checked ? accent : alpha(theme.palette.text.primary, 0.2),
          background: checked ? accent : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: `all 0.2s ${tokens.ease.out}`,
        }}
      >
        {checked && <CheckCircle size={12} color="#fff" />}
      </Box>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */

export default function PropertyForm({
  mode = "create",
  initialData,
  onSubmit,
  loading = false,
  error: externalError = "",
}) {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (initialData) setFormData({ ...EMPTY, ...initialData });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (validationError) setValidationError("");
  };

  const handleCityChange = (_event, newValue) => {
    setFormData((p) => ({ ...p, city: newValue || "" }));
    if (validationError) setValidationError("");
  };

  const handleImagesChange = (newImages) => {
    setFormData((p) => ({ ...p, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim())       return setValidationError("Title is required");
    if (!formData.description.trim()) return setValidationError("Description is required");
    if (!formData.city.trim())        return setValidationError("City is required");
    if (!formData.address.trim())     return setValidationError("Address is required");
    if (!formData.propertyType)       return setValidationError("Property type is required");
    if (Number(formData.price) <= 0)  return setValidationError("Price must be greater than 0");
    if (Number(formData.area)  <= 0)  return setValidationError("Area must be greater than 0");
    if (Number(formData.rooms) < 0)   return setValidationError("Rooms cannot be negative");

    const payload = {
      title:        formData.title.trim(),
      description:  formData.description.trim(),
      price:        Number(formData.price),
      city:         formData.city.trim(),
      address:      formData.address.trim(),
      propertyType: formData.propertyType,
      rooms:        Number(formData.rooms) || 0,
      area:         Number(formData.area),
      status:       formData.status,
      images:       formData.images || [],
      floor:        formData.floor === "" ? null : Number(formData.floor),
      totalFloors:  formData.totalFloors === "" ? null : Number(formData.totalFloors),
      isTopOffer:        formData.isTopOffer,
      isPriceReduced:    formData.isPriceReduced,
      isRealtorVerified: formData.isRealtorVerified,
    };

    await onSubmit(payload);
  };

  const isEdit = mode === "edit";
  const errorMessage = validationError || externalError;

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 920, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>

        {/* Кнопка Back — прибита до лівого краю */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
          <Button
            startIcon={<ArrowLeft size={15} />}
            onClick={() => navigate(-1)}
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.85rem",
              pl: 0,
              minWidth: "auto",
              "&:hover": { background: "transparent", color: "primary.main" },
            }}
          >
            Back
          </Button>
        </Box>

        {/* Header — вирівнювання по лівому краю */}
       {/* ════════════ Header (Виправлено: без бейджа, іконка і текст по центру) ════════════ */}
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column", alignItems: "flex-start", animation: tokens.anim.fadeUp }}>
          
          {/* Рядок з іконкою та заголовком */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: `${tokens.radius.md}px`,
                background: tokens.gradient.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: tokens.shadow.accent,
                flexShrink: 0,
              }}
            >
              <Building2 size={22} color="#fff" />
            </Box>
            
            {/* ТУТ ВИДАЛЕНО БЕЙДЖ 'Edit listing' */}
            <Typography variant="h4" sx={{ color: "text.primary", lineHeight: 1.1, textAlign: "left" }}>
              {isEdit ? "Edit Property" : "Create Property"}
            </Typography>
          </Box>

          {/* Підзаголовок (Updated details...) встане рівно під іконкою та заголовком завдяки pl: "60px" */}
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.9rem",
              textAlign: "left",
              // pl: "60px" = 44px (іконка) + 16px (gap 2)
              pl: "60px", 
            }}
          >
            {isEdit
              ? "Update the details of your listing below."
              : "Fill in the details to publish your property."}
          </Typography>
        </Box>
            

        {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          {/* Section 1: Basic info */}
          <Section
            icon={<FileText size={18} />}
            title="Basic information"
            description="Tell people about your property"
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Spacious 3-bedroom apartment in central Kyiv"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home size={18} color={theme.palette.text.disabled} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the unique features, condition, neighborhood…"
              />
            </Box>
          </Section>

          {/* Section 2: Pricing & location */}
          <Section
            icon={<MapPin size={18} />}
            title="Pricing & location"
            description="Where is it and how much?"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 2.5,
              }}
            >
              <TextField
                label="Price"
                name="price"
                type="number"
                required
                value={formData.price}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DollarSign size={18} color={theme.palette.text.disabled} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Status — текст чітко зліва */}
              {isEdit && (
                <TextField
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  sx={{ textAlign: "left" }}
                  SelectProps={{
                    MenuProps: { disableScrollLock: true },
                    sx: { textAlign: "left" },
                  }}
                >
                  {PROPERTY_STATUSES.map((s) => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </TextField>
              )}

              {/* Безпечний Autocomplete (виправлено краш) */}
              <Autocomplete
                freeSolo
                options={UKRAINIAN_CITIES}
                value={formData.city}
                onChange={handleCityChange}
                onInputChange={(_e, newValue) => handleCityChange(null, newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    required
                    placeholder="Start typing your city…"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapPin size={18} color={theme.palette.text.disabled} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <TextField
                label="Address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Khreshchatyk St., 22"
              />
            </Box>
          </Section>

          {/* Section 3: Property details */}
          <Section
            icon={<Building2 size={18} />}
            title="Property details"
            description="Size, type, and number of rooms"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 2.5,
              }}
            >
              <TextField
                select
                label="Type"
                name="propertyType"
                required
                value={formData.propertyType}
                onChange={handleChange}
                helperText={!formData.propertyType ? "Please select a type" : " "}
                sx={{ textAlign: "left" }}
                SelectProps={{
                  MenuProps: { disableScrollLock: true },
                  sx: { textAlign: "left" },
                }}
              >
                <MenuItem value="" disabled><em>Select type</em></MenuItem>
                {PROPERTY_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Rooms"
                name="rooms"
                type="number"
                required
                value={formData.rooms}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Bed size={18} color={theme.palette.text.disabled} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Area"
                name="area"
                type="number"
                required
                value={formData.area}
                onChange={handleChange}
                inputProps={{ step: "0.01", min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Ruler size={18} color={theme.palette.text.disabled} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography sx={{ color: "text.disabled", fontSize: "0.85rem" }}>m²</Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Floor (optional)"
                name="floor"
                type="number"
                value={formData.floor}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Layers size={18} color={theme.palette.text.disabled} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Total Floors (optional)"
                name="totalFloors"
                type="number"
                value={formData.totalFloors}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Box>
          </Section>

          {/* Section 4: Images */}
          <Section
            icon={<Images size={18} />}
            title="Property photos"
            description="Add up to 10 photo URLs. The first one will be the cover."
          >
            <ImageUrlList
              value={formData.images}
              onChange={handleImagesChange}
              max={10}
            />
          </Section>

          {/* Section 5: Tags */}
          <Section
            icon={<Tag size={18} />}
            title="Listing badges"
            description="Mark this listing with special tags to attract more attention"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 1.5,
              }}
            >
              <CheckCard
                icon={<Sparkles size={16} />}
                label="Top Offer"
                checked={formData.isTopOffer}
                onChange={handleChange}
                name="isTopOffer"
                accent="#D95829"
              />
              <CheckCard
                icon={<DollarSign size={16} />}
                label="Price Reduced"
                checked={formData.isPriceReduced}
                onChange={handleChange}
                name="isPriceReduced"
                accent="#22c55e"
              />
              <CheckCard
                icon={<CheckCircle size={16} />}
                label="Verified by Realtor"
                checked={formData.isRealtorVerified}
                onChange={handleChange}
                name="isRealtorVerified"
                accent="#3b82f6"
              />
            </Box>
          </Section>

          {/* Action bar — Cancel і Save changes розтягнуті */}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              gap: 2,
              pt: 2,
            }}
          >
            <Button
              onClick={() => navigate(-1)}
              disabled={loading}
              startIcon={<X size={15} />}
              sx={{
                color: "text.secondary",
                flex: 1,
                py: 1.4,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: `${tokens.radius.md}px`,
                "&:hover": { borderColor: "text.secondary", background: alpha(theme.palette.text.primary, 0.04) },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={!loading && <Save size={16} />}
              sx={{
                flex: 1,
                py: 1.4,
                borderRadius: `${tokens.radius.md}px`,
                fontWeight: 600,
              }}
            >
              {loading
                ? (isEdit ? "Saving…" : "Creating…")
                : (isEdit ? "Save changes" : "Create listing")}
            </Button>
          </Box>

        </Box>
      </Box>
    </MainLayout>
  );
}