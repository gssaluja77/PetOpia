const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
// const SESSION_DURATION = 5000; // 5 seconds for testing

export const isSessionExpired = (loginTime, lastActivity) => {
  if (!loginTime || !lastActivity) {
    return true;
  }

  const now = Date.now();
  const timeSinceActivity = now - parseInt(lastActivity);

  if (timeSinceActivity > SESSION_DURATION) {
    return true;
  }
  return false;
};
