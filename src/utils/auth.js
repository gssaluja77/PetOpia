import axios from '../api/axios';

const CURRENT_USER_KEY = 'userid';

export const signup = async (email, password) => {
  try {
    const response = await axios.post('/user/signup', { email, password });
    if (response.data) {
      if (response.data.id) {
        const now = Date.now();
        localStorage.setItem(CURRENT_USER_KEY, response.data.id);
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
      message: error.response?.data?.error || 'Authentication failed'
    };
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post('/user/login', { email, password });
    if (response.data) {
      if (response.data.id) {
        const now = Date.now();
        localStorage.setItem(CURRENT_USER_KEY, response.data.id);
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
      message: error.response?.data?.error || 'Login failed'
    };
  }
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem("userEmail");
  localStorage.removeItem("loginTime");
  localStorage.removeItem("lastActivity");
};

export const getCurrentUser = () => {
  return localStorage.getItem(CURRENT_USER_KEY);
};
