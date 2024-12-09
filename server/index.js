const cors = require("cors");
require('dotenv').config();
const express = require("express");
const { 
  client,
  createTables,
  createUser,
  createMovie,
  getAllMovies,
  createMovies
} = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
// middleware
app.use(express.json());
app.use(cors());

// const connectToDatabase = async () => {
//   try {
//     await client.connect();
 
//   } catch (err) {
//     console.error("Error connecting to database:", err);
   
//   }
// };

const init = async () => {
  // Connecting to database
  await client.connect();
  console.log("Connected to database");

  // Create Tables
  await createTables();
  console.log("Tables created");

  // Seed database with users
  const [robert, sue, lisa, theMatrix, scarface, hamilton] = await Promise.all([
    createUser({ username: 'robert', password: 's3cr3t!!' , isAdmin: true }),
    createUser({ username: 'sue', password: 'paZwoRd24', isAdmin: false}), 
    createUser({ username: 'lisa', password: 'shhh', isAdmin: false })
    // createMovie({ 
    //   name: 'The Matrix', 
    //   description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.', 
    //   image_url: 'https://m.media-amazon.com/images/I/613ypTLZHsL._SL1000_.jpg', 
    //   genre: 'Sci-Fi'
    // }),
    // createMovie({ 
    //   name: 'Scarface', 
    //   description: 'Miami in the 1980s: a determined criminal-minded Cuban immigrant becomes the biggest drug smuggler in Florida, and is eventually undone by his own drug addiction.', 
    //   image_url: 'https://fathead.com/cdn/shop/products/w6mp91aibxo6umta15yj.jpg?v=1699627349', 
    //   genre: 'Crime'
    // }),
    // createMovie({ 
    //   name: 'Hamilton', 
    //   description: 'The real life of one of Americas foremost founding fathers and first Secretary of the Treasury, Alexander Hamilton. Captured live on Broadway from the Richard Rodgers Theater with the original Broadway cast.', 
    //   image_url: 'https://i5.walmartimages.com/asr/149d1fd0-2254-421f-89d8-fe8d0f879b2d.45ce4ae056c8c0b3b1fce677f437a252.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF', 
    //   genre: 'History'
    // })
  ]);

  console.log("Added users");

  // Seed database with movies
  const moviesToInsert = [
    { 
      name: 'The Matrix', 
      description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.', 
      image_url: 'https://m.media-amazon.com/images/I/613ypTLZHsL._SL1000_.jpg', 
      genre: 'Sci-Fi'
    },
    { 
      name: 'Scarface', 
      description: 'Miami in the 1980s: a determined criminal-minded Cuban immigrant becomes the biggest drug smuggler in Florida, and is eventually undone by his own drug addiction.', 
      image_url: 'https://fathead.com/cdn/shop/products/w6mp91aibxo6umta15yj.jpg?v=1699627349', 
      genre: 'Crime'
    },
    { 
      name: 'Hamilton', 
      description: 'The real life of one of Americas foremost founding fathers and first Secretary of the Treasury, Alexander Hamilton. Captured live on Broadway from the Richard Rodgers Theater with the original Broadway cast.', 
      image_url: 'https://i5.walmartimages.com/asr/149d1fd0-2254-421f-89d8-fe8d0f879b2d.45ce4ae056c8c0b3b1fce677f437a252.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF', 
      genre: 'History'
    }
  ];

  console.log("Added movies");

  const insertedMovies = await createMovies(moviesToInsert);
  console.log("Added movies: ", insertedMovies);

  // Server running 
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
};

// Middleware
// app.use(express.json());

//database connection
// connectToDatabase().then(() => {
//   console.log("Database connected");

//   // connection
//   createTables().then(() => {
    
//   });
// }).catch(err => {
//   console.error("Error during database setup", err);
// });

// Route to homepage
app.get("/", (req, res) => {
  res.send("Database connection is successful!");
});

// Route to list of movies
app.get("/movies", async (req, res) => {
  const movies = await getAllMovies();
  console.log("movies fetched: ", movies);
  res.json(movies);
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

init();