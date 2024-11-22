require('dotenv').config();
const { Client } = require("pg");


const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database");
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};

//create tables
const createTables = async () => {
  let SQL = `
        DROP TABLE IF EXISTS reviews CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        DROP TABLE IF EXISTS movies CASCADE;
        DROP TABLE IF EXISTS comments CASCADE;
    `;
  await client.query(SQL);
  console.log("Dropped all tables");

  SQL = `
    CREATE TABLE movies(
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
  console.log("Movies table created");

  SQL = `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,                             
      username VARCHAR(255) UNIQUE NOT NULL,             
      password_hash VARCHAR(255) NOT NULL,               
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
    );
  `;
  await client.query(SQL);
  console.log("Users table created");

  SQL = `
    CREATE TABLE reviews (
      id SERIAL PRIMARY KEY,                             
      user_id INT NOT NULL,                             
      movie_id INT NOT NULL,                            
      rating DECIMAL(3, 1) CHECK (rating BETWEEN 0 AND 10),  
      review_text TEXT,                                 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, 
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE 
    );
  `;
  await client.query(SQL);
  console.log("Reviews table created");

  SQL = `
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,                             
      user_id INT NOT NULL,                             
      review_id INT NOT NULL,                           
      comment_text TEXT,                                
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, 
      FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE 
    );
  `;
  await client.query(SQL);
  console.log("Comments table created");
};

// create a new user
const createUser = async ({ username, password, is_admin }) => {
  const SQL = `
      INSERT INTO users(username, password_hash, is_admin) VALUES($1, $2, $3) RETURNING *
    `;
  const response = await client.query(SQL, [username, password, is_admin]);
  return response.rows[0];
};

//create a new review
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

//create a new movie
const createMovie = async ({ name, description, image, genre }) => {
  const SQL = `
      INSERT INTO movies(title, description, image_url, genre) VALUES ('Inception', 'A mind-bending thriller about dreams within dreams.', 'https://example.com/inception.jpg', 'Sci-Fi') RETURNING *
    `;
  const response = await client.query(SQL, [name, description, image, genre]);
  return response.rows[0];
};

// create a new comment
const createComment = async ({ user_id, review_id, comment_text }) => {
  const SQL = `
        INSERT INTO comments(user_id, review_id, comment_text) VALUES($1, $2, $3) RETURNING *
      `;
  const response = await client.query(SQL, [user_id, review_id, comment_text]);
  return response.rows[0];
};

module.exports = { client, connectToDatabase, createTables, createUser, createReview, createMovie, createComment };
