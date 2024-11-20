const { client, createTables } = require("./db");

const express = require("express");
const app = express();

const init = async () => {
  await client.connect();
  console.log("Connected to database");
  await createTables();
};

init();
