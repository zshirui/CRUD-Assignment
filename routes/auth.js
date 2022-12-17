
// -------- Requirements -------- //

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const { resolve } = require('path');
const { authenticate } = require('passport');


function Router(database)  {
    const router = express.Router();
    const _database = database;

    // -------- Cookie Handling -------- //

    router.use(
      session({
        secret: 'aYkasnfNdas9213901Jjdas',
        resave: false,
        saveUninitialized: false
      })  
    );

    // Passing user to front-end //
    
    router.use(
        passport.authenticate('session')
    );
    router.use((req,res,next) => {
        if(req.user) {
            res.locals.user = req.user;
        }
        next();
    });

    // -------- Authentication -------- //

    // Logging In - Passport //

    passport.use(
        new LocalStrategy(
            async function verify(email, password, callback) {

                // Find current user with email  //

                let  founduser = await _database.collections.users.findOne({email: email}).catch((error) => {
                    if (error) {
                        callback ("Incorrect Username or Password.", null);
                    }

                });

                    if (!founduser) {
                        callback ("Incorrect Username or Password.", null);
                        return;
                    }

                // Recreate Password //

                crypto.pbkdf2(password, founduser.salt, 310000, 32, 'sha256', (error, hashedPassword) => {
                    
                    if (error || !hashedPassword) {
                        return;
                    }

                    // Verify that the Password matches the passed in one from the form //

                    if (founduser.password !== hashedPassword.toString('hex')) {
                    } else {
                        return callback(null, founduser);
                    }

                });
            
            }
        )
    );

     // Serialization and Deserialization //

    passport.serializeUser(function(user, callback) {
        return callback(null, {id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname, profileimg: user.profileimg });
    });

    passport.deserializeUser(function(user, callback) {
        return callback(null, {id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname, profileimg: user.profileimg });
    });


    // Render login form //
    
    router.get('/login', (req,res) => {
        res.render('login', {});


    });


    // Render Register form //
    
    router.get('/register', (req,res) => {
        res.render('register', {});

    });


    // Registering //
    
    router.post('/register', async (req,res) => {
        let data = req.body;
        const salt =  crypto.randomBytes(16).toString('hex');
        const hashedPassword = await new Promise(( resolve) => {
            crypto.pbkdf2(data.password, salt, 310000, 32, 'sha256', (_, hashedPassword) => {
                resolve(hashedPassword);
            });

        });

        let user = await _database.collections.users.insertOne({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            salt: salt,
            profileimg: data.profileimg,
            password: hashedPassword.toString('hex')
            
        });


        await new Promise((resolve) => {
            req.login({
                id: user.insertedId.toString(),
                email: data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                profileimg: data.profileimg
            }, () => {
                resolve();
            })
        });

        res.redirect('/');
    });

        // login //

        router.post('/login', async (req,res, next) => {
            let authenticate = passport.authenticate('local', async (_,user) => {
                await new Promise((resolve) => {
                    req.login({
                        id: user._id.toString(),
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        profileimg: user.profileimg,
                    }, () => {
                        resolve();
                    })
                });
        
                res.redirect('/');
            });
            authenticate(req, res, next);

        });


    // Logout // 

    router.get('/logout', (req, res, next) => {
        req.logout(function(error) {
            if (error) {
                next (error);
                return;
            }

            res.redirect('/');
        });
    });

    return router;


}

module.exports = Router;