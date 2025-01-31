/********************************************************************************
* BTI425 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Cha Li Student ID: 046626131 Date: Jan 17 2025
*
* Published URL: bti-425-a1-nu.vercel.app
*
********************************************************************************/

const express = require("express");
const cors = require('cors');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const ListingsDB = require("./modules/listingsDB.js"); 
require('dotenv').config(); 
const db = new ListingsDB();

// Add support for incoming JSON entities
app.use(express.json());
app.use(cors());


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{

  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
      
  });
}).catch((err)=>{
  console.log(err)
})
// POST /api/listings add new listing item
app.post('/api/listings', async (req, res) => {
  try {
    console.log(req.body);
    const newListing = await db.addNewListing(req.body);

    // Respond with the newly created listing
    res.status(201).send({message: `add a new listing item: ${newListing}`});
  } catch (err) {
    console.error("Error creating listing:", err);

    // Handle errors
    res.status(500).send({ message :err});
  }
});



// GET /api/listings
app.get('/api/listings', async (req, res) => {
  try {
 
    
    // Get page, perPage, number from query 
    const pageNumber = parseInt(req.query.page);
    const perPageNumber = parseInt(req.query.perPage);
    const name = req.query.name;
    console.log("pageNumber:", pageNumber);
    console.log("perPageNumber:", perPageNumber);


    // Ensure page and perPage are valid numbers
    if (!+pageNumber || !+perPageNumber) {
      return res.status(400).send({ message: 'page and perPage must be valid numbers.' });
    }

    // Call the database function to fetch listings
    const listings = await db.getAllListings(pageNumber, perPageNumber, name);

    // Respond with the listings
    res.send(listings);
  } catch (err) {
    res.status(500).send({message:err});
  }
});
// GET listing iterm by id
app.get('/api/listings/:id', async (req, res) => {
    try {
      // Extract the _id from the route parameter
      const listID = req.params.id; 
  
      // Fetch the listing by _id from the database
      const listing = await db.getListingById(listID);
  
      // Return the listing 
      res.status(200).send({message: listing})
    } catch (err) {
      console.error("Error retrieving listing:", err);
  
      res.status(500).send({message : err});
    }
  });

//UPDATE listing item by id
app.put('/api/listings/:id', async (req, res) => {
    try {
  
      // Update the listing by id
      await db.updateListingById(req.body,req.params.id);
  
      // Return a success message with the updated listing
      res.status(200).send({ message: `Listing updated successfully.`});
    } catch (err) {
        
      console.error("Error updating listing:", err);

  
      res.status(500).send({message:err});
    }
  });

// DELETE listing by id

app.delete('/api/listings/:id', async(req, res) => {
    try {
        // delete the listing item by id
        await db.deleteListingById(req.params.id);
        // return a success message
        res.send({
            message: `deleted item with identifier: ${req.params.id}`,
        });
    }catch(err){
        res.status(404).send({message:err});
    }
});

app.get((err,req,res,next)=>{
  console.log(err);
  next();
});








