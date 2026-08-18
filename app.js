require('dotenv').config();
require('./config/passport');
const express = require('express');
const passport = require('passport');
const authRouter = require('./routes/authRouter');
const cors = require('cors');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');

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
app.use('/comments', commentRouter);


// error middleware
app.use((err, req, res, next) => {
    console.error(err);
    
    res.status(500).json({
        error: {
            code: "INTERNAL_ERROR",
            message: "Something went wrong"
        }
    })
});


app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log(`server started on ${PORT}`);
});