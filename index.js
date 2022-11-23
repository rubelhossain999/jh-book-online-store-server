const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 6000;

// Middle Ware
app.use(cors());
app.use(express.json());



// Start Server Code
app.get('/', async(req, res) => {
    res.send("This is the Book Resale Server Site");
});

