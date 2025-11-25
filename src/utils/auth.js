import axios from '../api/axios';

const CURRENT_USER_KEY = 'userid';

export const signup = async (email, password) => {
  try {
    const response = await axios.post('/user/signup', { email, password });
    if (response.data) {
      if (response.data.id) {
        sessionStorage.setItem(CURRENT_USER_KEY, response.data.id);
        sessionStorage.setItem("userEmail", email);
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
        sessionStorage.setItem(CURRENT_USER_KEY, response.data.id);
        sessionStorage.setItem("userEmail", email);
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
  sessionStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  return sessionStorage.getItem(CURRENT_USER_KEY);
};
