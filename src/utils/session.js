const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
// const SESSION_DURATION = 5000; // 5 seconds for testing

export const isSessionExpired = () => {
  const loginTime = localStorage.getItem("loginTime");
  const lastActivity = localStorage.getItem("lastActivity");

  if (!loginTime || !lastActivity) {
    return true;
  }

  const now = Date.now();
  const timeSinceActivity = now - parseInt(lastActivity);

  if (timeSinceActivity > SESSION_DURATION) {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("lastActivity");
    return true;
  }
    return false;
};

export const updateLastActivity = () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    localStorage.setItem("lastActivity", Date.now().toString());
  }
};