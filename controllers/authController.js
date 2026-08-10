const passport = require('passport');
const authQueries = require('../db/authQueries');
const {hashPassword, verifyPassword} = require('../lib/passwordUtils');
const jwt = require('jsonwebtoken');


const postSignUpData = async(req, res, next) => {
    try{
        // validate user inputs (middleware function)
        // check if email already exists (if does error)
        // get fields from req (validated)
        // push to db
        const {email, username, password, isAuthor} = req.body;
        const passwordHash = await hashPassword(password);
        const user = await authQueries.addUser({
            email,
            username,
            passwordHash,
            isAuthor,
        });

        res.status(201).json({email, username, isAuthor});

    }catch(err){
        return next(err);
    }
};

const postLoginData = async(req, res, next) => {
    try{
        // validatation
        const {email, password} = req.body; 
        // get the user
        const user = await authQueries.getUserByEmail(email);
        if(!user) {
            return res.status(401).json({"message": "incorrect email or password"});
        }
        if( await verifyPassword(password, user.passwordHash)){

            // generate jwt token
            jwt.sign({userId: user.id},process.env.JWT_SECRET_KEY, {expiresIn: "1h"}, (err, token)=>{
                res.json({
                    "message": "logged in",
                    token
                });
            })   
        }else{
            return res.status(401).json({"message": "incorrect email or password"});
        }


    }catch(err){
        return next(err);
    }
};

const testJwt = (req,res) => {
    res.json(req.user);
};

module.exports = {
    postSignUpData,
    postLoginData,
    testJwt,
}