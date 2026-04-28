const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Токен не передан'
        });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            message: 'Неверный формат токена'
        });
    }

    const token = parts[1];

    try {
        const decoded = verifyToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Недействительный токен'
        });
    }
}

module.exports = authMiddleware;