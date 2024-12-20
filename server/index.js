require("dotenv").config();
const express = require('express');
const cors = require("cors");
const {
  client,
  createTables,
  createUser,
  createMovie,
  fetchUsers,
  authenticate,
  findUserByToken,
  getCommentsByUserId,
  getReviewsByUserId,
  seedDatabase,
  getAllMovies,
  createMovies,
} = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors());

const init = async () => {
  // Connecting to database
  await client.connect();
  console.log("Connected to database");

  // Create Tables
  await createTables();
  console.log("Tables created");

  // Seed database with users
  const [robert, sue, lisa] = await Promise.all([
    createUser({ username: "robert", password: "s3cr3t!!", is_admin: true }),
    createUser({ username: "sue", password: "paZwoRd24", is_admin: false }),
    createUser({ username: "lisa", password: "shhh", is_admin: false }),
  ]);

  // Seed database with movies
  const moviesToInsert = [
    {
      name: "The Matrix",
      description:
        "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
      image_url: "https://m.media-amazon.com/images/I/613ypTLZHsL._SL1000_.jpg",
      genre: "Sci-Fi",
    },
    {
      name: "Scarface",
      description:
        "Miami in the 1980s: a determined criminal-minded Cuban immigrant becomes the biggest drug smuggler in Florida, and is eventually undone by his own drug addiction.",
      image_url:
        "https://fathead.com/cdn/shop/products/w6mp91aibxo6umta15yj.jpg?v=1699627349",
      genre: "Crime",
    },
    {
      name: "Hamilton",
      description:
        "The real life of one of Americas foremost founding fathers and first Secretary of the Treasury, Alexander Hamilton. Captured live on Broadway from the Richard Rodgers Theater with the original Broadway cast.",
      image_url:
        "https://i5.walmartimages.com/asr/149d1fd0-2254-421f-89d8-fe8d0f879b2d.45ce4ae056c8c0b3b1fce677f437a252.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
      genre: "History",
    },
    {
      name: "Forrest Gump",
      description: "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.",
      image_url: "https://i.ebayimg.com/images/g/rHsAAOSwcqNi7LNX/s-l1600.jpg",
      genre: "Drama",
    },
    {
      name: "Spirited Away",
      description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, and where humans are changed into beasts.",
      image_url: "https://m.media-amazon.com/images/I/710ievVCTTL._SL1100_.jpg",
      genre: "Anime",
    },
    {
      name: "Wall-E",
      description: "A robot who is responsible for cleaning a waste-covered Earth meets another robot and falls in love with her. Together, they set out on a journey that will alter the fate of mankind.",
      image_url: "https://m.media-amazon.com/images/I/81K-KlDulqL._SL1500_.jpg",
      genre: "Sci-Fi",
    },
    {
      name: "Shutter Island",
      description: "Two US marshals are sent to a mental institution on an inhospitable island in order to investigate the disappearance of a patient.",
      image_url: "https://sdi4.chrislands.com/sdi/978/00/61/7/9780061703256.jpg",
      genre: "Drama",
    }
  ];

  const insertedMovies = await createMovies(moviesToInsert);
  console.log("Added movies: ", insertedMovies);

  await seedDatabase();

  // Server running
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
};

app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());

const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserByToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
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

// Route
app.get("/comments", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM comments;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/comments/movie/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    const result = await client.query(
      "SELECT * FROM comments WHERE movie_id = $1;",
      [movieId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/comments", async (req, res) => {
  const { user_id, review_id, comment_text } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO comments(user_id, review_id, comment_text) VALUES($1, $2, $3) RETURNING *",
      [user_id, review_id, comment_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.put("/comments/:id", async (req, res) => {
  const { id } = req.params;
  const { comment_text } = req.body;
  try {
    const result = await client.query(
      "UPDATE comments SET comment_text = $1 WHERE id = $2 RETURNING *;",
      [comment_text, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Comment not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM comments WHERE id = $1 RETURNING *;",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Comment not found");
    }
    res.json({
      message: "Comment deleted successfully",
      comment: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Create a movie
app.post("/movies", async (req, res) => {
  try {
    const { title, description, image_url, genre } = req.body;
    if (!title) {
      return res.status(400).send({ error: "Title is required" });
    }
    const movie = await createMovie({
      name: title,
      description,
      image: image_url,
      genre,
    });
    res.status(201).send(movie);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create movie" });
  }
});

// Get all movies
// app.get("/movies", async (req, res) => {
//   try {
//     const result = await client.query(
//       "SELECT * FROM movies ORDER BY created_at DESC"
//     );
//     res.status(200).send(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Failed to fetch movies" });
//   }
// });

// Get a single movie by ID, along with its reviews and comments
app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Query to fetch movie details along with related reviews and comments
    const movieQuery = `
      SELECT m.id AS movie_id, m.title, m.description, m.image_url, m.genre, 
             m.average_rating, m.created_at, 
             r.id AS review_id, r.rating, r.review_text, r.created_at AS review_created_at, 
             c.id AS comment_id, c.comment_text, c.created_at AS comment_created_at
      FROM movies m
      LEFT JOIN reviews r ON r.movie_id = m.id
      LEFT JOIN comments c ON c.review_id = r.id
      WHERE m.id = $1
      ORDER BY r.created_at DESC, c.created_at DESC;`;

    const result = await client.query(movieQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Movie not found" });
    }

    const movie = {
      id: result.rows[0].movie_id,
      title: result.rows[0].title,
      description: result.rows[0].description,
      image_url: result.rows[0].image_url,
      genre: result.rows[0].genre,
      average_rating: result.rows[0].average_rating,
      created_at: result.rows[0].created_at,
      reviews: [],
    };

    let currentReview = null;
    result.rows.forEach((row) => {
      if (currentReview && currentReview.id === row.review_id) {
        // Add comments to the existing review
        currentReview.comments.push({
          id: row.comment_id,
          comment_text: row.comment_text,
          created_at: row.comment_created_at,
        });
      } else {
        // Create a new review object
        currentReview = {
          id: row.review_id,
          rating: row.rating,
          review_text: row.review_text,
          created_at: row.review_created_at,
          comments: [],
        };
        // Add the review to the movie's reviews
        movie.reviews.push(currentReview);

        // Add the first comment for the review
        if (row.comment_id) {
          currentReview.comments.push({
            id: row.comment_id,
            comment_text: row.comment_text,
            created_at: row.comment_created_at,
          });
        }
      }
    });

    res.status(200).send(movie);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Failed to fetch movie with reviews and comments" });
  }
});

// Update a movie by ID
app.put("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, genre } = req.body;
    const result = await client.query(
      `
      UPDATE movies 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          image_url = COALESCE($3, image_url),
          genre = COALESCE($4, genre)
      WHERE id = $5
      RETURNING *`,
      [title, description, image_url, genre, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Movie not found" });
    }
    res.status(200).send(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to update movie" });
  }
});

// Delete a movie by ID
app.delete("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query(
      "DELETE FROM movies WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Movie not found" });
    }
    res
      .status(200)
      .send({ message: "Movie deleted successfully", movie: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete movie" });
  }
});

app.get("/reviews", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM reviews;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Create a review
app.post("/reviews", async (req, res) => {
  try {
    const { user_id, movie_id, rating, review_text } = req.body;
    if (!user_id || !movie_id || !rating) {
      return res
        .status(400)
        .send({ error: "User ID, Movie ID, and Rating are required" });
    }
    const SQL = `
      INSERT INTO reviews (user_id, movie_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await client.query(SQL, [
      user_id,
      movie_id,
      rating,
      review_text,
    ]);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create review" });
  }
});

// Get all reviews for a movie
app.get("/movies/:movie_id/reviews", async (req, res) => {
  try {
    const { movie_id } = req.params;
    const SQL = `
      SELECT r.*, u.username 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.movie_id = $1
      ORDER BY r.created_at DESC;
    `;
    const result = await client.query(SQL, [movie_id]);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch reviews" });
  }
});

// Get a single review by ID
app.get("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const SQL = `
      SELECT r.*, u.username, m.title AS movie_title
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN movies m ON r.movie_id = m.id
      WHERE r.id = $1;
    `;
    const result = await client.query(SQL, [id]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Review not found" });
    }
    res.status(200).send(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch review" });
  }
});

// Update a review by ID
app.put("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review_text } = req.body;
    const SQL = `
      UPDATE reviews 
      SET rating = COALESCE($1, rating),
          review_text = COALESCE($2, review_text),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const result = await client.query(SQL, [rating, review_text, id]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Review not found" });
    }
    res.status(200).send(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to update review" });
  }
});

// Delete a review by ID
app.delete("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const SQL = `
      DELETE FROM reviews 
      WHERE id = $1
      RETURNING *;
    `;
    const result = await client.query(SQL, [id]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Review not found" });
    }
    res
      .status(200)
      .send({ message: "Review deleted successfully", review: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete review" });
  }
});

//add new user
app.post("/users", async (req, res, next) => {
  try {
    res.send(
      createUser({
        username: req.body.username,
        password: req.body.password,
        is_admin: req.body.is_admin,
      })
    );
  } catch (error) {
    next(error);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (error) {
    next(error);
  }
});

//login route: takes in username and password, sends back a jwt
app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get("/users/:id/comments", async (req, res, next) => {
  try {
    res.send(await getCommentsByUserId(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.get("/users/:id/reviews", async (req, res, next) => {
  try {
    res.send(await getReviewsByUserId(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

//returns id and username of logged in user
app.get("/api/auth/me", isLoggedIn, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

init();
