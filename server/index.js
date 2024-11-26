require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { 
  client,
  createTables,
  createUser,
  createMovie

} = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS middleware
app.use(cors({
  origin: 'http://localhost:3001', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

const connectToDatabase = async () => {
  try {
    await client.connect();
 
  } catch (err) {
    console.error("Error connecting to database:", err);
   
  }
};

const init = async () => {
  //await client.connect();
  console.log("Connected to database");
  await createTables();
  console.log("Tables created");

  const [robert, sue, lisa, theMatrix, scarface, hamilton] = await Promise.all([
    createUser({ username: 'robert', password: 's3cr3t!!' , isAdmin: true }),
    createUser({ username: 'sue', password: 'paZwoRd24', isAdmin: false}), 
    createUser({ username: 'lisa', password: 'shhh', isAdmin: false }),
    createMovie({ name: 'The Maxtrix', description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.', image: 'https://m.media-amazon.com/images/I/613ypTLZHsL._SL1000_.jpg', genre: 'Sci-Fi'}),
    createMovie({ name: 'Scarface', description: 'Miami in the 1980s: a determined criminal-minded Cuban immigrant becomes the biggest drug smuggler in Florida, and is eventually undone by his own drug addiction.', image: 'https://fathead.com/cdn/shop/products/w6mp91aibxo6umta15yj.jpg?v=1699627349', genre: 'Crime'}),
    createMovie({ name: 'Hamilton', description: 'The real life of one of Americas foremost founding fathers and first Secretary of the Treasury, Alexander Hamilton. Captured live on Broadway from the Richard Rodgers Theater with the original Broadway cast.', image: 'https://i5.walmartimages.com/asr/149d1fd0-2254-421f-89d8-fe8d0f879b2d.45ce4ae056c8c0b3b1fce677f437a252.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF', genre: 'History'})
  ])

  //app.listen(port, () => console.log(`listening on port ${port}`));
};

init();

// Middleware
app.use(express.json());

//database connection
connectToDatabase().then(() => {
  console.log("Database connected");

  // connection
  createTables().then(() => {
    
  });
}).catch(err => {
  console.error("Error during database setup", err);
});

// Route
app.get("/comments", async (req, res) => {
  try {
      const result = await client.query('SELECT * FROM comments;');
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');    
  }
});

app.get('/comments/movie/:movieId', async (req, res) => {
  const { movieId } = req.params;
  try {
      const result = await client.query('SELECT * FROM comments WHERE movie_id = $1;', [movieId]);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.post('/comments', async (req, res) => {
  const { user_id, movie_id, comment_text } = req.body;
  try {
      const result = await client.query(
          'INSERT INTO comments (user_id, movie_id, comment_text, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *;',
          [user_id, movie_id, comment_text]
      );
      res.status(201).json(result.rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.put('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { comment_text } = req.body;
  try {
      const result = await client.query(
          'UPDATE comments SET comment_text = $1 WHERE id = $2 RETURNING *;',
          [comment_text, id]
      );
      if (result.rows.length === 0) {
          return res.status(404).send('Comment not found');
      }
      res.json(result.rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await client.query('DELETE FROM comments WHERE id = $1 RETURNING *;', [id]);
      if (result.rows.length === 0) {
          return res.status(404).send('Comment not found');
      }
      res.json({ message: 'Comment deleted successfully', comment: result.rows[0] });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
