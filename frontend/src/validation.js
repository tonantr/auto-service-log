export const validatePassword = (password) => {
    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }
    return null;
};

export const validateEmail = (email) => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isValidEmail.test(email)) {
        return "Please provide a valid email address.";
    }
    return null;
};