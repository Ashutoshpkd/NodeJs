const express = require("express");
const { signup } = require('../controller/userController');
const router = express.Router();

router.put('/signup',  signup);

exports.userRouter = router;