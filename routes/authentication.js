const express = require('express');
const passport = require('passport');
const authenticationController = require('../controllers/authentication');

const router = express.Router();

router.post('/register', async (req, res) => {
    const {userName, userEmail, userPassword} = req.body
    console.log(userName, userEmail, userPassword);
    return res.status(200).json({message:"success"});
});

module.exports = router;


