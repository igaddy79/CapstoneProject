require("dotenv").config();
const { Client } = require("pg");

// const pg = require("pg");
// const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createTables = async () => {
  let SQL = `
        DROP TABLE IF EXISTS reviews CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        DROP TABLE IF EXISTS movies CASCADE;
        DROP TABLE IF EXISTS comments CASCADE;
    `;
  await client.query(SQL);
  console.log("dropped all tables");
  SQL = `
    CREATE TABLE IF NOT EXISTS movies(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url VARCHAR(2083),
        genre VARCHAR(100),
        average_rating DECIMAL(3, 1) DEFAULT 0.0 CHECK(average_rating BETWEEN 0 AND 10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await client.query(SQL);
  console.log("movies table created");
  SQL = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,                            
    username VARCHAR(255) UNIQUE NOT NULL,            

    password VARCHAR(255) NOT NULL,              
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
    );`;
  await client.query(SQL);
  console.log("users table created");
  SQL = `
    CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,                            
    user_id INT NOT NULL,                             
    movie_id INT NOT NULL,                            
    rating DECIMAL(3, 1) CHECK (rating BETWEEN 0 AND 10),  
    review_text TEXT,                                 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Foreign key constraint for user
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE -- Foreign key constraint for movie
    );`;
  await client.query(SQL);
  console.log("reviews table created");
  SQL = `
    CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,                            
    user_id INT NOT NULL,                             
    review_id INT NOT NULL,                           
    comment_text TEXT,                                
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, 
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE 
    );`;
  await client.query(SQL);
  console.log("comments table created");
};

const seedDatabase = async () => {
  const reviews = [
    {
      user_id: 1, // Robert
      movie_id: 1, // The Matrix
      rating: 9.0,
      review_text:
        "An amazing movie with mind-bending visuals and a fascinating story. Truly revolutionary in its genre!",
    },
    {
      user_id: 2, // Sue
      movie_id: 2, // Scarface
      rating: 8.5,
      review_text:
        "Scarface is a gritty, violent tale of ambition and excess, with unforgettable performances. A classic crime film.",
    },
    {
      user_id: 3, // Lisa
      movie_id: 3, // Hamilton
      rating: 10.0,
      review_text:
        "Absolutely loved Hamilton! The music, the performances, the history—everything was perfect. A must-watch!",
    },
    {
      user_id: 1, // Robert
      movie_id: 2, // Scarface
      rating: 7.5,
      review_text:
        "A great movie, but the excessive violence and themes of drug addiction are a bit overwhelming. Still, Al Pacino is brilliant.",
    },
    {
      user_id: 3, // Lisa
      movie_id: 1, // The Matrix
      rating: 8.0,
      review_text:
        "The Matrix is a groundbreaking film, but I found the pacing a bit slow at times. Still, it’s a classic for a reason.",
    },
  ];

  for (const review of reviews) {
    await createReview(review);
  }

  const comments = [
    {
      user_id: 2, // Sue
      review_id: 1, // Robert's review of The Matrix
      comment_text:
        "I completely agree! The Matrix really changed the sci-fi genre. It’s a masterpiece!",
    },
    {
      user_id: 3, // Lisa
      review_id: 2, // Sue's review of Scarface
      comment_text:
        "Scarface definitely shows the dark side of ambition. It’s a film that sticks with you long after watching it.",
    },
    {
      user_id: 1, // Robert
      review_id: 3, // Lisa's review of Hamilton
      comment_text:
        "Hamilton is incredible. The music and historical significance are just amazing. I loved every minute of it!",
    },
    {
      user_id: 2, // Sue
      review_id: 4, // Robert's review of Scarface
      comment_text:
        "I agree with your take on Scarface. The film’s intensity is overwhelming at times, but Pacino’s performance is unmatched.",
    },
    {
      user_id: 3, // Lisa
      review_id: 5, // Robert's review of The Matrix
      comment_text:
        "I found the Matrix a little confusing in some parts, but it's definitely a movie that grows on you the more you watch it.",
    },
  ];

  for (const comment of comments) {
    await createComment(comment);
  }
};

const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE username = $1
  `;
  const response = await client.query(SQL, [username]);
  //if username is not found or password is incorrect
  if (
    !response.rows.length ||
    !(await bcrypt.compare(password, response.rows[0].password))
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  return { token };
};

const findUserByToken = async (token) => {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username, is_admin
    FROM users
    WHERE id = $1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const createUser = async ({ username, password, is_admin }) => {
  const SQL = `
      INSERT INTO users(username, password, is_admin) VALUES($1, $2, $3) RETURNING *
    `;
  //hashing password with 10 salt rounds
  const pass_hash = await bcrypt.hash(password, 10);
  const response = await client.query(SQL, [username, pass_hash, is_admin]);
  return response.rows[0];
};

const createReview = async ({ user_id, movie_id, rating, review_text }) => {
  const SQL = `
        INSERT INTO reviews(user_id, movie_id, rating, review_text) VALUES($1, $2, $3, $4) RETURNING *
      `;
  const response = await client.query(SQL, [
    user_id,
    movie_id,
    rating,
    review_text,
  ]);
  return response.rows[0];
};

const createMovie = async ({ name, description, image_url, genre }) => {
  const SQL = `
      INSERT INTO movies(title, description, image_url, genre) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [
    name,
    description,
    image_url,
    genre,
  ]);
  return response.rows[0];
};

// inserting multiple movies
const createMovies = async (movies) => {
  const insertedMovies = [];

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const insertedMovie = await createMovie(movie);
    insertedMovies.push(insertedMovie);
  }
  return insertedMovies;
};

const createComment = async ({ user_id, review_id, comment_text }) => {
  const SQL = `
        INSERT INTO comments(user_id, review_id, comment_text) VALUES($1, $2, $3) RETURNING *
      `;
  const response = await client.query(SQL, [user_id, review_id, comment_text]);
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT id, username, is_admin, created_at, updated_at FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const getCommentsByUserId = async (id) => {
  const SQL = `
    SELECT * FROM comments
    WHERE user_id=$1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

const getReviewsByUserId = async (id) => {
  const SQL = `
    SELECT * FROM reviews
    WHERE user_id=$1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

const getAllMovies = async () => {
  const SQL = `
    SELECT id, title, description, image_url, genre, average_rating, created_at
    FROM movies
  `;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createUser,
  createReview,
  createMovie,
  createComment,
  fetchUsers,
  authenticate,
  findUserByToken,
  getCommentsByUserId,
  getReviewsByUserId,
  seedDatabase,
  getAllMovies,
  createMovies,
};
