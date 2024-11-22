const { 
  client,
  createTables,
  createUser,
  createMovie

} = require("./db");

const express = require("express");
const app = express();

const init = async () => {
  await client.connect();
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

  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
