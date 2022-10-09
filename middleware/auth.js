const jwt = require('jsonwebtoken');

exports.authCheck = async (req, res, next) => {
    const authData = req.get('Authorization');

    try {
        if (!authData) {
            const err = new Error('Authorization failed!');
            err.statusCode = 401;

            throw err;
        }
        const token = authData.split(' ')[1];
        if (!token) {
            const err = new Error('Invalid token');
            err.statusCode = 401;

            throw err;
        }

        const decodedToken = jwt.verify(token, 'CaptainLevi@123');
        if (!decodedToken) {
            const err = new Error('Invalid token');
            err.statusCode = 401;

            throw err;
        }

        req.userId = decodedToken.userId;
        return next();
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }
}