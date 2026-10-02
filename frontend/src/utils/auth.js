import { getToken, removeToken } from "./token";

const USER_KEY = "user";

export const getCurrentUser = () => {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error("Invalid user data in localStorage");
        return null;
    }
};

export const setCurrentUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeCurrentUser = () => {
    localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const logoutUser = () => {
    removeToken();
    removeCurrentUser();
};

export const getUserRole = () => {
    const user = getCurrentUser();

    if (!user) {
        return null;
    }

    return user.role || null;
};

export const isAdmin = () => {
    return getUserRole() === "ROLE_ADMIN";
};

export const isUser = () => {
    return getUserRole() === "ROLE_USER";
};