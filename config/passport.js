const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const {findUserById} = require('../db/authQueries');
let opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

const verifiedCallback = async(jwt_payload, done) => {
    try{

        const user = await findUserById(jwt_payload.userId);
        if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    }catch(err){
        return done(err, false);
    }

};
const strategy = new jwtStrategy(opts, verifiedCallback);

passport.use(strategy);