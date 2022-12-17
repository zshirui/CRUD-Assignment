
// Requirements //
const express = require('express');
const helpers = require('../helpers/auth.js');

// Rendering the page //

function Router(database) {
    const router = express.Router();
    
    router.get('/profile', helpers.isAuthenticated, (req,res) => {
        res.render('profile', {});
    });

    return router;
};

module.exports = Router;