const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const ListingsDB = require("./modules/listingsDB.js"); 
require('dotenv').config(); 
const db = new ListingsDB();

// Add support for incoming JSON entities
app.use(express.json());

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
    await db.addNewListing(req.body);
   

    // Respond with the newly created listing
    res.status(201).json({message: `add a new listing item: ${req.body._id} ${req.body.name}`});
  } catch (err) {
    console.error("Error creating listing:", err);

    // Handle errors
    res.status(500).json({ err: "Failed to create listing. Please try again later." });
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
    if (!+pageNumber && !+perPageNumber) {
      return res.status("400").json({ error: 'page and perPage must be valid numbers.' });
    }

    // Call the database function to fetch listings
    const listings = await db.getAllListings(pageNumber, perPageNumber, name);

    // Respond with the listings
    res.send(listings);
  } catch (err) {
    res.status("500").send({message:err});
  }
});

app.get('/api/listings/:id', async (req, res) => {
    try {
      // Extract the _id from the route parameter
      const listID = req.params.id; 
  
      // Fetch the listing by _id from the database
      const listing = await db.getListingById(listID);
  
      // Return the listing to the client
      res.status(200).json(listing);
    } catch (err) {
      console.error("Error retrieving listing:", err);
  
      res.status(500).json({ error: "An error occurred while retrieving the listing." });
    }
  });

//update listing by id
app.put('/api/listings/:id', async (req, res) => {
    try {
  
      // Update the listing by _id
      const updatedListing = await db.updateListingById(req.body,req.params.id);
  
      if (!updatedListing) {
        // If no listing is found, return a 404 status
        return res.status(404).json({ error: `Listing with ID ${id} not found.` });
      }
  
      // Return a success message with the updated listing
      res.status(200).json({ message: "Listing updated successfully.", listing: updatedListing });
    } catch (err) {
      console.error("Error updating listing:", err);
  
      // Handle invalid ObjectId or other errors
      if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({ error: "Invalid ID format." });
      }
  
      res.status(500).json({ error: "An error occurred while updating the listing." });
    }
  });





module.exports = app;






