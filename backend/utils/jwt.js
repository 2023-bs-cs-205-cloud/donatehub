const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({
            userId
        },
        process.env.JWT_SECRET, {
            expiresIn: '7d'
        }
    );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign({
            userId,
            type: 'refresh'
        },
        process.env.JWT_SECRET, {
            expiresIn: '30d'
        }
    );
};

// Verify token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken
};