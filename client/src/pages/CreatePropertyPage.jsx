// src/pages/CreatePropertyPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import PropertyForm from "../components/property/PropertyForm";
import { createProperty } from "../api/propertyApi";

/**
 * Тонка обгортка над спільною PropertyForm для створення.
 * Уся логіка форми — у PropertyForm. Тут тільки виклик API і навігація.
 */
export default function CreatePropertyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");
    try {
      await createProperty(payload);
      navigate("/my-properties");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        "Failed to create property. Please check your input and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PropertyForm
      mode="create"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}