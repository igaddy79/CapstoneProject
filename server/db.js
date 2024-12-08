require("dotenv").config();
const { Client } = require("pg");

// const pg = require("pg");
// const uuid = require("uuid");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const JWT = process.env.JWT || "shhh";2

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
    password_hash VARCHAR(255) NOT NULL,              
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

const createUser = async ({ username, password, is_admin }) => {
  const SQL = `
      INSERT INTO users(username, password_hash, is_admin) VALUES($1, $2, $3) RETURNING *
    `;
  //hashing password with 10 salt rounds
  const pass_hash = await bcrypt.hash(password, 10);
  const response = await client.query(SQL, [username, pass_hash, is_admin]);
  return response.rows[0];
};

const createReview = async ({ user_id, movie_id, rating, review_text }) => {
  const SQL = `
        INSERT INTO users(user_id, movie_id, rating, review_text) VALUES($1, $2, $3, $4) RETURNING *
      `;
  const response = await client.query(SQL, [
    user_id,
    movie_id,
    rating,
    review_text,
  ]);
  return response.rows[0];
};

const createMovie = async ({ name, description, image, genre }) => {
  const SQL = `
      INSERT INTO movies(title, description, image_url, genre) VALUES($1, $2, $3, $4) RETURNING *
    `;
  const response = await client.query(SQL, [name, description, image, genre]);
  return response.rows[0];
};

const createComment = async ({ user_id, review_id, comment_text }) => {
  const SQL = `
        INSERT INTO movies(user_id, review_id, comment_text) VALUES($1, $2, $3) RETURNING *
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

module.exports = {
  client,
  createTables,
  createUser,
  createReview,
  createMovie,
  createComment,
  fetchUsers,
};
