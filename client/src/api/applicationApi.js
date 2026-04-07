import axios from "axios";

const API_URL = "http://localhost:5000/api/applications";

export const createApplication = async (applicationData, token) => {
  const response = await axios.post(API_URL, applicationData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyApplications = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getOwnerApplications = async (token) => {
  const response = await axios.get(`${API_URL}/owner`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateApplicationStatus = async (id, status, token) => {
  const response = await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};