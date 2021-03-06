/**
 * Created by aman1 on 06/03/2017.
 */

var mongoose = require('mongoose');
var Book = mongoose.model('Book');
var User = mongoose.model('User');
var check = require('./check_status');


/**
 * Named function that prepares the response object
 * @param res - response object that holds data about where to send the response
 * @param status - response status code
 * @param content - information to send back
 */

var sendJasonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};


/**
 * Stores the user review that are contained in the request object.
 * it uses addReview to actualy sore the data in the database
 * @param req - request object
 * @param res - response object
 */

module.exports.createReview = function (req, res) {
    if (check.checkState(req)) {
        var bookid = req.params.bookid;
        if (bookid) {
            Book.findById(bookid).select('reviews').exec(
                function (err, book) {
                    if (err) {
                        sendJasonResponse(res, 404, err);
                    } else {
                        addReview(req, res, book);
                    }
                }
            );
        }
    }else{
        sendJasonResponse(res, 404, {"message" : "Unauthorized."});
    }
};

/**
 * Funtion that actually stores the reviews to the database. It returns
 * the data of the book that has been reviewed
 *
 * @param req - request object
 * @param res - response object
 * @param book - the enire data about the book that is being reviewd
 */

var addReview = function (req, res, book) {
    if (!book){
        sendJasonResponse(res, 404, {"message" : "Sorry bookid not found"});
    }else{
        book.reviews.push({
            rating: req.body.rating,
            screenName: req.body.screenName,
            reviewText: req.body.reviewText
        });
        book.save(function (err, book) {
            var currentReview;
            if (err){
                sendJasonResponse(res, 404, err);
            }else{
                findBookAndUpdateRating(book._id);
                currentReview = book.reviews[book.reviews.length - 1];
                sendJasonResponse(res, 200, currentReview);
            }
        })
    }
};

/**
 * Function that updates tha star rating according to the review rating
 * @param bookid - title of the book
 */
var findBookAndUpdateRating = function (bookid){
    Book.findById(bookid).select('bookRating reviews').exec(
        function (err, book) {
            if (!err){
                updateBookRating(book);
            }
        }
    );
};

/**
 * function that updates the book rating in numbers
 * @param book
 */

var updateBookRating = function (book) {
    var averageRating = 0;
    var totalRating = 0;
    if (book.reviews && book.reviews.length > 0){
        for (var i = 0; i<book.reviews.length; i++){
            totalRating = totalRating + book.reviews[i].rating;
        }
        averageRating = parseInt(totalRating/book.reviews.length, 10);
        book.bookRating = averageRating;
        book.save(function (err) {
           if (err){
               console.log(err);
           }else {
               console.log("Average rating updated to " + averageRating);
           }
        });
    }
};


/**
 * controller that deletes a specific review.
 * @param req - request object
 * @param res - response object
 */

module.exports.doReviewDelete = function (req, res) {
    if (check.checkState(req)) {
        var bookid = req.params.bookid;
        var reviewid = req.params.reviewid;
        if (!bookid || !reviewid) {
            sendJasonResponse(res, 404, {"message": "Not found, both bookid and reviewid are needed"});
            return;
        }
        Book.findById(bookid).select('reviews').exec(
            function (err, book) {
                if (!book) {
                    sendJasonResponse(res, 404, {"message": "bookid doesn't exist"});
                    return;
                } else if (err) {
                    sendJasonResponse(res, 404, err);
                    return;
                }
                if (book.reviews && book.reviews.length > 0) {
                    if (!book.reviews.id(reviewid)) {
                        sendJasonResponse(res, 404, {"message": "reviewid not found"});
                    } else {
                        book.reviews.id(reviewid).remove();
                        book.save(function (err) {
                            if (err) {
                                sendJasonResponse(res, 404, err);
                            } else {
                                updateBookRating(bookid);
                                sendJasonResponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    sendJasonResponse(res, 404, {"message": "No review to delete."});
                }
            }
        );
    }else{
        sendJasonResponse(res, 404, {"message" : "Unauthorized."});
    }
};