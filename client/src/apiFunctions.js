import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const validateUser = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check-auth`, {
      withCredentials: true, // Ensure cookies are sent with the request
    });
    console.log(response.data); // Log the response data for debugging

    return response.data; // Return the user data if authenticated
  } catch (error) {
    console.error("Error validating authentication:", error);
    throw error; // Propagate the error for further handling
  }
};

export const setProfile = async (formData) => {
  for (const pair of formData.entries()) {
    console.log(pair[0] + ": ", pair[1]);
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/setprofile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error setting profile:", error);
    throw error;
  }
};
