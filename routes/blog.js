
// Requirements //

const express = require('express');
const helpers = require('../helpers/auth.js');

// Database setup //

function Router(database) {
    const router = express.Router();
    const _database = database;

    // Index setup //
    
    router.get('/', async (req,res) => {
        const blogData = await _database.collections.blogs.find({}).toArray();
        res.render('index', {blogData: blogData});
    });

    // NewBlog page setup //

    router.get('/newBlog', helpers.isAuthenticated, (req,res) => {
        res.render('new', {});
    });

    // Routers for generating dynamic slug link based on article title and rendenring the blog page //

    router.post('/newBlog', helpers.isAuthenticated, async (req,res) => {
        let data = req.body;
        data['slug'] = data.title.replace(/ /g, "-" );
        await _database.collections.blogs.insertOne(data);
        res.redirect(`/blog/${data.slug}`);
    });

    router.get('/blog/:slug', async (req, res) => {
        let slug = req.params.slug;
        let blog = await _database.collections.blogs.findOne({slug: slug});
        res.render('existing', {blogData: blog});
    });


    return router;
};

module.exports = Router;