// src/api/applicationApi.js
import api from "./axios";

export const createApplication = async (applicationData) => {
  const { data } = await api.post("/applications", applicationData);
  return data;
};

export const getMyApplications = async () => {
  const { data } = await api.get("/applications/my");
  return data;
};

export const getOwnerApplications = async () => {
  const { data } = await api.get("/applications/owner");
  return data;
};

export const updateApplicationStatus = async (id, status) => {
  const { data } = await api.put(`/applications/${id}/status`, { status });
  return data;
};