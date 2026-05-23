// src/pages/EditPropertyPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Alert, Button } from "@mui/material";

import MainLayout from "../components/layout/MainLayout";
import PropertyForm from "../components/property/PropertyForm";
import { getPropertyById, updateProperty } from "../api/propertyApi";

/**
 * EditPropertyPage — тонка обгортка над PropertyForm.
 *
 * Її задача:
 *   1. Завантажити property з бекенду за ID.
 *   2. Привести формат до того, що очікує форма
 *      (зокрема — `images` залишається масивом, raw з бекенду).
 *   3. Відправити PUT при сабміті.
 */
export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadError, setLoadError]     = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPropertyById(id);
        if (!active) return;

        /*
         * Перетворюємо backend-shape → form-shape.
         * Зберігаємо тільки ті поля, які форма редагує.
         * `images` — array of strings, передаємо as-is.
         * Числа, які можуть бути null/undefined → порожній рядок
         * (TextField очікує string для числових полів).
         */
        setInitialData({
          title:        data.title || "",
          description:  data.description || "",
          price:        data.price ?? "",
          city:         data.city || "",
          address:      data.address || "",
          propertyType: data.propertyType || "",
          rooms:        data.rooms ?? "",
          area:         data.area ?? "",
          floor:        data.floor ?? "",
          totalFloors:  data.totalFloors ?? "",
          status:       data.status || "available",
          images:       Array.isArray(data.images) ? data.images : [],

          isTopOffer:        !!data.isTopOffer,
          isPriceReduced:    !!data.isPriceReduced,
          isRealtorVerified: !!data.isRealtorVerified,
        });
      } catch (err) {
        if (!active) return;
        setLoadError(err?.response?.data?.message || "Failed to load property");
      } finally {
        if (active) setLoadingInit(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      await updateProperty(id, payload);
      navigate("/my-properties");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  if (loadingInit) {
    return (
      <MainLayout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress color="primary" />
        </Box>
      </MainLayout>
    );
  }

  if (loadError) {
    return (
      <MainLayout>
        <Box sx={{ maxWidth: 600, mx: "auto", py: 8, px: 3, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 3 }}>{loadError}</Alert>
          <Button variant="contained" color="primary" onClick={() => navigate("/my-properties")}>
            Back to my properties
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <PropertyForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={saving}
      error={error}
    />
  );
}