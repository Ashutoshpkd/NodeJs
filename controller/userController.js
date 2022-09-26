const User = require('../models/users');
const { validationResult } = require('express-validator');

exports.signup = async (req, res, next) => {
    try {
        const err = validationResult(req);

        if (!err.isEmpty()) {
            err.statusCode = 400;
            err.message = 'Validation failed!';
            err.errors = err.array();

            throw err;
        }
        const existing = await User.findOne({
            email: req.body.email,
        });
        console.log('FINIDING USER');
        console.log(existing);
        if (existing) {
            const error = new Error('User already exists');
            error.statusCode = 401;
            throw error;
        }
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            status: req.body.status,
        })
        const data = await newUser.save();
        console.log('SAVING NEW USER');
        console.log(data);
        return res.status(201).json({
            message: 'New user created!',
            user: data,
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    }
}