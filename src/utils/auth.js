import axios from "../utils/axios";

export const signup = async (firstName, lastName, username, email, password) => {
  try {
    const response = await axios.post("/user/signup", {
      firstName,
      lastName,
      username,
      email,
      password,
    });
    if (response.data && response.data.id) {
      // This returns user data with all necessary fields for AuthContext
      return {
        success: true,
        user: {
          userId: response.data.id,
          firstName,
          lastName,
          username,
          email,
          ...response.data,
        },
      };
    }
    return {
      success: false,
      message: "Server returned unexpected response format",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || "Authentication failed",
    };
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post("/user/login", { email, password });
    if (response.data && response.data.id) {
      // This returns user data with all necessary fields for AuthContext
      return {
        success: true,
        user: {
          userId: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          username: response.data.username,
          email,
          ...response.data,
        },
      };
    }
    return {
      success: false,
      message: "Server returned unexpected response format",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || "Login failed",
    };
  }
};
