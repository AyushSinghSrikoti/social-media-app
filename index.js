const express = require('express');
const app = express();
const port = 8080;

app.listen(port , function(err){
    if(err){
        console.log(`error : ${err}`);
    }

    console.log(`server is running on port : ${port}`);
})