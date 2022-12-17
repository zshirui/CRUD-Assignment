
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
    const PORT = 3000;
    const app = express();

    // Database Setup //

    const database = new DatabaseService();
    await database.setup();

    // Vuew engine and Static file setup //
    
    app.set('view engine', 'ejs');
    app.use(bodyParser());
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

    app.listen(3000, () => {
        console.log('Server Has Started')
    });

}

setupServer();