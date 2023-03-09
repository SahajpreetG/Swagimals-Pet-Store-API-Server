let jwt = require('jsonwebtoken')

  exports.jwtValidator = function (req, res, next) {
    console.log('In jwtValidator => ', req.headers)
    // console.log('Request.path => ',req.path);

    if(req.path == "/api/signup" || req.path == '/api/login') return next();

    var bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, result) => {
            if (err) {
                console.log('error in if => ', err.message);
                res.sendStatus(403)
            }
            else {               
                next()      //breaks and send control to next middleware
            }
            //  else {
            //     res.sendStatus(403)
            // })
        })
    }
    else
    {        
        res.sendStatus(403);
    }
}


  