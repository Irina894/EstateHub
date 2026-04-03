import axios from "axios";

const API_URL = "http://localhost:5000/api/properties";

export const getAllProperties = async (filters = {}) => {
  const response = await axios.get(API_URL, { params: filters });
  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getMyProperties = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createProperty = async (propertyData, token) => {
  const response = await axios.post(API_URL, propertyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProperty = async (id, propertyData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, propertyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteProperty = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};