require('dotenv').config();
require('./config/passport');
const express = require('express');
const passport = require('passport');
const authRouter = require('./routes/authRouter');
const cors = require('cors');
const postRouter = require('./routes/postRouter');

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
    origin: function (origin, callback){
        if(!origin || allowedOrigins.indexOf(origin) !== -1){
            callback(null, true);
        }   
        else{
            callback(new Error("Not Allowed by CORS"));
        }
    }
}));


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/posts', postRouter);


app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log(`server started on ${PORT}`);
});