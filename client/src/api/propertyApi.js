// src/api/propertyApi.js
import api from "./axios";

export const getAllProperties = async (filters = {}) => {
  const { data } = await api.get("/properties", { params: filters });
  return data;
};

export const getPropertyById = async (id) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

export const getMyProperties = async () => {
  const { data } = await api.get("/properties/my");
  return data;
};

export const createProperty = async (propertyData) => {
  const { data } = await api.post("/properties", propertyData);
  return data;
};

export const updateProperty = async (id, propertyData) => {
  const { data } = await api.put(`/properties/${id}`, propertyData);
  return data;
};

export const deleteProperty = async (id) => {
  const { data } = await api.delete(`/properties/${id}`);
  return data;
};

export const getSimilarProperties = async (id) => {
  const { data } = await api.get(`/properties/${id}/similar`);
  return data;
};