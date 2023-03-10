
// -------- Requirements -------- //

const express = require('express');
const BlogRouter = require('./routes/blog.js');
const AuthRouter = require('./routes/auth.js');
const ProfileRouter = require('./routes/profile.js');
const bodyParser = require('body-parser');
const DatabaseService = require('./database/database.js');
const path = require('path')

    // -------- Server Setup Function -------- //

    async function setupServer() {
    let port = process.env.PORT || 8080
    const app = express();

    // Database Setup //

    const database = new DatabaseService();
    await database.setup();

    // Vuew engine and Static file setup //
    
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'client')));
    
    // Routers //
    
    app.use('/', AuthRouter(database));
    app.use('/', BlogRouter(database));
    app.use('/', ProfileRouter(database));


    // 404 error page for when there's no routes //

    app.use(function(req,res) {
        res.status(404).render('../views/404.ejs')
    })
    

    // Listener //

    app.listen(port);
    console.log('Server Has Started');

}

setupServer();