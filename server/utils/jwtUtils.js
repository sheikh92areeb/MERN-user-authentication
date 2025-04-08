import jwt from 'jsonwebtoken';


// General purpose token (login, verification)
export const generateToken = (userId, expiresIn = "1h") => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

// Reset password token (can be longer or shorter lived)
export const generateResetToken = (userId, expiresIn = "15m") => {
    return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn });
};

// Decode and verify a token (used in email verification)
export const verifyToken = ( token ) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject("Token is invalid or expired");
            }
            resolve(decoded.userId);
        });
    }); 
};

// Decode and verify reset password token
export const verifyResetToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject("Reset token is invalid or expired");
            }
            resolve(decoded.userId);
        });
    });
};
