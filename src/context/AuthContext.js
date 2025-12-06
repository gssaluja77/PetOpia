import { createContext } from "react";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [firstName, setFirstName] = useLocalStorage("firstName", null);
    const [lastName, setLastName] = useLocalStorage("lastName", null);
    const [userEmail, setUserEmail] = useLocalStorage("userEmail", null);
    const [userId, setUserId] = useLocalStorage("userId", null);
    const [username, setUsername] = useLocalStorage("username", null);
    const [loginTime, setLoginTime] = useLocalStorage("loginTime", null);
    const [lastActivity, setLastActivity] = useLocalStorage("lastActivity", null);

    const login = (userData) => {
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setUserEmail(userData.email || userData.userEmail);
        setUserId(userData.userId || userData._id);
        setUsername(userData.username);
        setLoginTime(Date.now());
        setLastActivity(Date.now());
    };

    const logout = () => {
        setFirstName(null);
        setLastName(null);
        setUserEmail(null);
        setUserId(null);
        setUsername(null);
        setLoginTime(null);
        setLastActivity(null);
    };

    const updateActivity = () => {
        setLastActivity(Date.now());
    };
    const updateUser = (userData) => {
        if (userData.firstName !== undefined) setFirstName(userData.firstName);
        if (userData.lastName !== undefined) setLastName(userData.lastName);
        if (userData.email !== undefined) setUserEmail(userData.email);
        if (userData.userEmail !== undefined) setUserEmail(userData.userEmail);
        if (userData.username !== undefined) setUsername(userData.username);
    };

    const isAuthenticated = () => {
        return !!userId;
    };
    const user = userId ? {
        firstName,
        lastName,
        userEmail,
        userId,
        username,
        loginTime,
        lastActivity,
    } : null;

    const value = {
        firstName,
        lastName,
        userEmail,
        userId,
        username,
        loginTime,
        lastActivity,
        user,
        login,
        logout,
        updateUser,
        updateActivity,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
