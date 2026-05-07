import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
    // return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET);
}

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const createCookie = (res, name, value, maxAge = 10 * 24 * 60 * 60 * 1000) => {
    res.cookie(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge
    })
};

const setupResponse = (res, payload/* , refreshToken */) => {
    const token = generateToken(payload);

    createCookie(res, 'token', token);
    // createCookie(res, 'refreshToken', refreshToken);
};

export { generateToken, generateRefreshToken, createCookie, setupResponse };