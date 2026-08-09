require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log(`server started on ${PORT}`);
});