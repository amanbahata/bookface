/**
 * Created by aman1 on 06/03/2017.
 */

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
// var authentication = jwt({
//     secret: process.env.JWT_SECRET,   // set secret using environment variables
//     userProperty: 'payload'             // define property on request to be payload
// });


var ctrlAuthors = require('../controllers/authors_list');
var ctrlBooks = require('../controllers/books_list');
var ctrlReviews = require('../controllers/reviews');
var ctrlAuthentication = require('../controllers/authentication');


//Authors

router.get('/authors', ctrlAuthors.listByAuthors);
router.get('/authors/:authorName', ctrlAuthors.listBooksByAuthor);



//Books

router.get('/books', ctrlBooks.listBooks);
router.post('/books', ctrlBooks.booksCreate);
router.get('/books/:bookid', ctrlBooks.booksReadOne);
router.delete('/:bookid/delete',  ctrlBooks.bookDeleteOne);

//Reviews

router.post('/books/:bookid/reviews',  ctrlReviews.createReview);

//Authentication

router.post('/register', ctrlAuthentication.register);
router.post('/login', ctrlAuthentication.doLogin);
router.get('/verify/:tokenid', ctrlAuthentication.verify);




module.exports = router;