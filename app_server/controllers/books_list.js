/**
 * Created by aman1 on 22/03/2017.
 */

var request = require('request');
var whoIsUser = require('./display_user');


/**
 *Setting up the api options
 */
var apiOptions = {
    server : "http://localhost:3000"
};



/**
 *Get books list of a single author
 */

module.exports.bookDetail = function (req, res) {
    var requestOptions, path;
    path = '/api/books/' + req.params.bookid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json: {}
    };
    request (requestOptions,
        function(err, response, book){
            bookDetailRenderer(req, res, book);
        }
    );
};


/**
 *Rendering the single author page
 */

var bookDetailRenderer = function(req, res, book){
    var message;
    var loggedIn = false;

    if (req.session && req.session.token){
        loggedIn = true;
        var screenName = whoIsUser.screenNameDecoder(req);
    }

    if (!book) {
        message = "API lookup error. Please try again." ;
    }
    if (!book.reviews || !book.reviews.length > 0){
        message = "This book hasn't been reviewed yet."
    }
    res.render('book_info', {
        title: book.title,
        pageHeader: {
            title: book.title
        },
        loggedIn: loggedIn,
        scrName: screenName,
        bookid: book._id,
        rating: book.bookRating,
        addedBy: book.addedBy,
        author: book.author,
        description: book.description,
        reviews: book.reviews,

        message: message
    });
};

/**
 * Render book_add_form page
 * @param req
 * @param res
 */

module.exports.addBook = function (req, res) {
    var screenName = whoIsUser.screenNameDecoder(req);
    res.render('book_add_form', {
        title: 'Add book',
        pageHeader: {title: 'Add book'},
        scrName: screenName
    });

};


/**
 * Preforms POST request to the api to save an new book to the database
 * @param req
 * @param res
 */

module.exports.doAddBook = function(req, res){
    var screenName = whoIsUser.screenNameDecoder(req);
    var requestOptions, path, authorName, postData;
    authorName = req.params.authorName;
    path = '/api/books';
    postData = {
        addedBy: screenName ,
        author: authorName,
        title: req.body.bookTitle,
        description: req.body.description
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json: postData,
        headers: {
            "token" : req.session.token
        }
    };
    request (requestOptions,
        function(err, response, body){
            if (response.statusCode === 201){
                res.redirect('/author/' + authorName);
            }else{
                console.log("Something went wrong");
                res.redirect('/');
            }
        }
    );
};

/**
 * Sends DELETE request to remove a single book from the database
 * @param req
 * @param res
 */

module.exports.bookDelete = function (req, res) {
    var requestOptions, path,bookid;
    bookid = req.params.bookid;
    path = '/api/' + bookid + '/delete';
    requestOptions = {
        url : apiOptions.server + path,
        method : "DELETE",
        headers: {
            "token" : req.session.token
        }
    };
    request (requestOptions,
        function(err, response){
            if (response.statusCode === 200){
                res.redirect('/');
            }else{
                console.log("Could not delete!");
                res.redirect('/books/' + bookid);
            }
        }
    );

};
