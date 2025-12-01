import axios from "../utils/axios";

const CURRENT_USER_KEY = "userId";

export const signup = async (firstName, lastName, username, email, password) => {
  try {
    const response = await axios.post("/user/signup", {
      firstName,
      lastName,
      username,
      email,
      password,
    });
    if (response.data) {
      if (response.data.id) {
        const now = Date.now();
        localStorage.setItem(CURRENT_USER_KEY, response.data.id);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("username", username);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("loginTime", now.toString());
        localStorage.setItem("lastActivity", now.toString());
        return { success: true, user: response.data };
      }
      return { success: true, user: response.data };
    }
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
    if (response.data) {
      if (response.data.id) {
        const now = Date.now();
        console.log(response.data.firstName);
        localStorage.setItem(CURRENT_USER_KEY, response.data.id);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("lastName", response.data.lastName);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("loginTime", now.toString());
        localStorage.setItem("lastActivity", now.toString());
        return { success: true, user: response.data };
      }
      return { success: true, user: response.data };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || "Login failed",
    };
  }
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem("firstName");
  localStorage.removeItem("lastName");
  localStorage.removeItem("username");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("loginTime");
  localStorage.removeItem("lastActivity");
};

export const getCurrentUser = () => {
  return localStorage.getItem(CURRENT_USER_KEY);
};
