import axios from "axios";

const API_URL = "http://localhost:5000/api/favorites";

export const addToFavorites = async (propertyId, token) => {
  const response = await axios.post(
    API_URL,
    { propertyId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMyFavorites = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const removeFromFavorites = async (propertyId, token) => {
  const response = await axios.delete(`${API_URL}/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};