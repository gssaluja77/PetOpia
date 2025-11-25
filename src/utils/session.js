// Session expiration: 7 days in milliseconds
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const isSessionExpired = () => {
    const loginTime = localStorage.getItem('loginTime');
    const lastActivity = localStorage.getItem('lastActivity');

    if (!loginTime || !lastActivity) {
        return true;
    }

    const now = Date.now();
    const timeSinceActivity = now - parseInt(lastActivity);

    return timeSinceActivity > SESSION_DURATION;
};

export const updateLastActivity = () => {
    const userId = localStorage.getItem('userid');
    if (userId) {
        localStorage.setItem('lastActivity', Date.now().toString());
    }
};

export const clearExpiredSession = () => {
    if (isSessionExpired()) {
        localStorage.removeItem('userid');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('lastActivity');
        return true;
    }
    return false;
};
