require('dotenv').config();
const express = require("express");
const { client, createTables } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};
// Middleware
app.use(express.json());

//database connection
connectToDatabase().then(() => {
  console.log("Database connected");

  // connection
  createTables().then(() => {
    
  });
}).catch(err => {
  console.error("Error during database setup:", err);
});

// Route
app.get("/", (req, res) => {
  res.send("Database connection is successful!");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
