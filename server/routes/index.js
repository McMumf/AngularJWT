var express = require('express');
var router = express.Router();
var models = require('../models');
var fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ran into issue using pem keys
//const cert = fs.readFileSync('./jwtRS256.key');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
    const body = req.body;
    models.User.findOne({
        where: {
            email: body.email
        }
    }).then(function(user) {
        if(user) {
            return res.status(409).send("User Already Exists");
        } else {
            bcrypt.hash(body.password, 10, function(err, hash) {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    models.User.create({
                        email: body.email,
                        password: hash
                    }).then(function() {
                        res.status(200).send("User Created");
                    });
                }
            });
        }
    });

});

router.get('/info', checkIfAuthenticated, function(req, res, next) {
    res.status(200).json({
        message: 'Hooray!'
    });
});

router.post('/login', function(req, res, next) {
    const body = req.body;
    models.User.findOne({
        where: {
            email: body.email
        }
    }).then(function(user) {
        bcrypt.compare(body.password, user.password, function(err, result) {
            if(err) {
                res.status(401).json({
                    failed: 'Incorrect Login'
                });
            } else if(result) {
                const JWTToken = jwt.sign({
                    email: user.email,
                    id: user.id
                }, "insert certs here", {
                    algorithm: 'HS256',
                    expiresIn: '1h'
                });
                return res.status(200).json({
                    success: 'Successful Login',
                    token: JWTToken
                });
            } else {
                res.status(401).json({
                    failed: 'Incorrect Login'
                });
            }
        });
    });
});

function checkIfAuthenticated(req, res, next) {
    var token = req.get('Authorization');
    jwt.verify(token, "insert certs here", { algorithms: ['HS256'] }, function(err, decoded) {
        let now = new Date().getTime() / 1000;
        console.log(now);
        if(err) {
            console.log(err);
            /*res.send(401).json({
                failed: 'Not Authorized'
            })*/
        } else if(now > decoded.exp) {
            console.log("Expired token");
            res.sendStatus(401);
        } else {
            //req.decoded = decoded;
            console.log("Authorized");
            next();
        }
    });
}

module.exports = router;
