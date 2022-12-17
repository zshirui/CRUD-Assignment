
// Helper to verify if user is logged in, if not, redirect to the login page // 


function isAuthenticated(req,res,next) {

    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
    
};

module.exports = {isAuthenticated};