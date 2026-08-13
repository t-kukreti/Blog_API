const passport = require('passport');
const authQueries = require('../db/authQueries');
const {hashPassword, verifyPassword} = require('../lib/passwordUtils');
const jwt = require('jsonwebtoken');
const { user } = require('../lib/prisma');
const { isAuthor } = require('../middleware/authMiddleware');


const postSignUpData = async(req, res, next) => {
    try{
        // validate user inputs (middleware function)
        // check if email already exists (if does error)
        // get fields from req (validated)
        // push to db
        const {email, username, password} = req.body;
        const passwordHash = await hashPassword(password);
        const user = await authQueries.addUser({
            email,
            username,
            passwordHash,
        });

        res.status(201).json({email, username});

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
            jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"}, (err, token)=>{
                res.json({
                    "message": "logged in",
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        isAuthor: user.isAuthor
                    }
                });
            })   
        }else{
            return res.status(401).json({"message": "incorrect email or password"});
        }


    }catch(err){
        return next(err);
    }
};

const upgradeToAuthor = async(req, res, next) => {
    try{
        if(req.user.isAuthor){
           return res.json({message: "already a author"}); 
        }
        const user = await authQueries.updateUserById(req.user.id);
        res.json({
            id: user.id,
            email: user.email,
            username: user.username,
            isAuthor: user.isAuthor,
        });
    }catch(err){
        return next(err);
    }
}

const getCurrentUser = async(req, res, next) => {
    try{
        const user = await authQueries.findUserById(req.user.id);
        res.json({
            user:{
                id: user.id,
                username: user.username,
                isAuthor: user.isAuthor
            }
        });
    }catch(err){
        return next(err);
    }
    
};

module.exports = {
    postSignUpData,
    postLoginData,
    upgradeToAuthor, 
    getCurrentUser,
}