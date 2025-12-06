import { createContext, useState, useCallback } from "react";

export const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
    const [refreshTriggers, setRefreshTriggers] = useState({
        communityPosts: 0,
        pets: 0,
    });

    const triggerRefresh = useCallback((key) => {
        setRefreshTriggers((prev) => ({
            ...prev,
            [key]: prev[key] + 1,
        }));
    }, []);

    const value = {
        refreshTriggers,
        triggerRefresh,
    };

    return <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>;
};
