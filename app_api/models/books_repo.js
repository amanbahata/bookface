/**
 * Created by aman1 on 06/03/2017.
 */

//Import mongoose
var mongoose = require('mongoose');

/**
 * Database schema for the book reviews
 */

var reviewSchema = new mongoose.Schema({

    rating: {type: Number, required: true, min: 0, max: 5},
    screenName: {type:String, required:true},
    reviewText: {type: String, required: true},
    createdOn: {type: Date, 'default': Date.now}

});

/**
 * Database schema for book details
 */

var bookSchema = new mongoose.Schema({

    bookRating: {type: Number, 'default': 0, min: 0, max: 5},
    addedBy: {type: String, required: true},
    author: {type: String, require: true},
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true },
    reviews: [reviewSchema]
});

//Compile the schema
mongoose.model('Book', bookSchema);
