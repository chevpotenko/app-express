const express = require('express');
const Articles = require('../models/article');
const router = express.Router();

router.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    });
});

router.post('/add', (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //get errors
    let errors = req.validationErrors();
    if(errors){
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
    }else{
        let article = new Articles();                                    
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        article.save((err) => {
            if(err){
                console.log(err);
                return 
            }else{
                req.flash('success', 'Article Added')
                res.redirect('/');
            }
        });
    }     
});

router.get('/:id', (req, res) => {
    Articles.findById(req.params.id, function(err, article) {
        if(err){
            console.log(err);
        }else{
            res.render('article', {
                article: article
            });
        }
    });
});

router.get('/edit/:id', (req, res) => {
    Articles.findById(req.params.id, function(err, article) {    
        res.render('edit_article', {
            title: 'Edit article',
            article: article
        });
    });
});

router.post('/edit/:id', (req, res) => {
   let article = {};                                  
   article.title = req.body.title;
   rticle.author = req.body.author;
   article.body = req.body.body;

    let query = {_id:req.params.id}

    Articles.update(query, article, (err) => {
        if(err){
            console.log(err);
            return 
        }else{
            req.flash('successe', 'Article Updated');
            res.redirect('/');
        }
    }); 
 });

 router.delete('/:id', function(req, res) {
    let query = {_id:req.params.id}
    Articles.remove(query, (err) => {
        if(err){
            console.log(err);                
        }
        res.send('Success');
    });
 });

 module.exports = router;