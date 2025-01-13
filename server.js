const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req,res)=>{
    res.send("Vercel Works")
});

app.listen(HTTP_PORT, ()=>{
    console.log("server listening on: " + HTTP_PORT);
});




