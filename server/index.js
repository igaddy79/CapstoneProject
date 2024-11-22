require('dotenv').config();
const express = require("express");
const { client, connectToDatabase, createTables } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

//database connection
connectToDatabase().then(() => {
  console.log("Database connected successfully!");

  // connection
  createTables().then(() => {
    console.log("Tables created successfully!");
  });
}).catch(err => {
  console.error("Error during database setup:", err);
});

// Define a simple test route
app.get("/", (req, res) => {
  res.send("Database connection is successful!");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
