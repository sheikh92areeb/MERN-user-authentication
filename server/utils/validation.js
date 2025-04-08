export const validateRegisterInput = (email, password, username) => {
    const errors = {};

    if (!username || username.trim() === "") {
        errors.username = "Username field is required";
    }

    if (!email || email.trim() === "") {
        errors.email = "Email field is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email is invalid";
    }

    if (!password || password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

