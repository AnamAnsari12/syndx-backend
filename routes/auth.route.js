const express = require("express");
const { handleUserSignUp, handleUserSignIn } = require("../controllers/auth.controller");
const router = express.Router();

router.post('/', handleUserSignUp);
router.get('/', handleUserSignIn);

module.exports = router;