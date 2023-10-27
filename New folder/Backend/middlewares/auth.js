const User = require('../models/Users')
const JWT = require('jsonwebtoken')

exports.isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                message: "Please Login First",
            });
        }
        const decoded = await JWT.verify(token, process.env.JWT_Secret);
        req.user = await User.findById(decoded._id);

        next();
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
