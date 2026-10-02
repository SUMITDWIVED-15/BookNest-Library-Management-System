export const isRequired = (value) => {
    return value !== null &&
        value !== undefined &&
        String(value).trim() !== "";
};

export const isValidEmail = (email) => {
    if (!email) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
    if (!phone) {
        return false;
    }

    return /^[6-9]\d{9}$/.test(phone);
};

export const isValidPassword = (password) => {
    return typeof password === "string" &&
        password.length >= 6;
};

export const validateLoginForm = (data) => {
    const errors = {};

    if (!isRequired(data.email)) {
        errors.email = "Email is required";
    } else if (!isValidEmail(data.email)) {
        errors.email = "Enter a valid email";
    }

    if (!isRequired(data.password)) {
        errors.password = "Password is required";
    }

    return errors;
};

export const validateSignupForm = (data) => {
    const errors = {};

    if (!isRequired(data.fullName)) {
        errors.fullName = "Full name is required";
    }

    if (!isRequired(data.email)) {
        errors.email = "Email is required";
    } else if (!isValidEmail(data.email)) {
        errors.email = "Enter a valid email";
    }

    if (!isRequired(data.password)) {
        errors.password = "Password is required";
    } else if (!isValidPassword(data.password)) {
        errors.password = "Password must contain at least 6 characters";
    }

    if (data.phone && !isValidPhone(data.phone)) {
        errors.phone = "Enter a valid 10-digit phone number";
    }

    return errors;
};