require('dotenv').config();
require('./config/passport');
const express = require('express');
const passport = require('passport');
const authRouter = require('./routes/authRouter');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());

app.use('/auth', authRouter);


app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log(`server started on ${PORT}`);
});