/**
 * Created by aman1 on 23/03/2017.
 */

//import modules
var request = require('request');
var mailer = require('./mailer');

/**
 *Setting up the api options
 */
var apiOptions = {
    server : "http://localhost:3000"
};

/**renders the registration form
 *
 * @param req
 * @param res
 */
module.exports.register = function (req, res) {
    renderRegisterForm(req, res);
};

var renderRegisterForm = function (req, res) {
    res.render('register', {
        title: 'Register',
        pageHeader: {title: 'Register'}
    });
};

/**
 * It sends a POST request binding the user registration details
 * @param req
 * @param res
 */
module.exports.doRegister = function(req, res){
    var requestOptions, path, postData;
    path = '/api/register';
    postData = {
        screenName: req.body.screenName,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json: postData
    };
    request (requestOptions,
        function(err, response){
            if (response.statusCode === 200){
                if (response.body) {
                    mailer.sendEmail(req.body.email, response.body.token);
                }
                res.redirect('/login');
            }else{
                console.log("User email already used");
                renderErrorPage(res);
            }
        }
    );
};

/**
 * It renders the error page in case user registration fails
 * @param res
 */
var renderErrorPage = function (res) {
    res.render('error', {
        title: 'Oops',
        pageHeader: {title: 'Failed Registration'},
        message : "The entered email already exists, Or we had a problem processing your registration. Please" +
        " try registering again."
    });
}