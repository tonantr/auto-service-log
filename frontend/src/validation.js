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

export const validateVIN = (vin) => {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!vinRegex.test(vin)) {
        return "Invalid VIN.";
    }
    return null;
};

export const validateYear = (year) => {
    const currentYear = new Date().getFullYear();
    const yearNumber = Number(year);
    if (isNaN(yearNumber)) {
        return "Please enter a valid year.";
    }

    if (yearNumber < 1900 || yearNumber > currentYear) {
        return `Please enter a year between 1900 and ${currentYear}.`;
    }

    return null;
};
