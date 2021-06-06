const express = require('express');
const router = express.Router();

// Middleware
const { auth, notAuth } = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    res.render('index', {
        name : req.user.username,
        id : req.user.user_id
    });
});



module.exports = router;