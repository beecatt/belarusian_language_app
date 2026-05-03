function roleMiddleware(requiredRole) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({
                message: 'Пользователь не авторизован'
            });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                message: 'Недостаточно прав'
            });
        }

        next();
    };
}

module.exports = roleMiddleware;