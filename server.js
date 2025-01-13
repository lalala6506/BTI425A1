const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const ListingsDB = require("./modules/listingsDB.js"); 
const db = new ListingsDB();

app.get("/", (req,res)=>{
    res.send("Vercel Works")
});

app.listen(HTTP_PORT, ()=>{
    console.log("server listening on: " + HTTP_PORT);
});




