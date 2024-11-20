const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/movies_db"
);

const createTables = async () => {
  let SQL = `
    DROP TABLE IF EXISTS movies;
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
  client.query(SQL);
  console.log("movies table created");
  SQL = ``;
};

module.exports = { client, createTables };
