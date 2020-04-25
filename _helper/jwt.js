const expressJwt = require('express-jwt');
const config = require('../config');
const userService = require('../controller/userService');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
          //  '/authenticate',
            '/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    console.log('payload',payload,req)
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};