const express = require("express");
const cors = require("cors");
const app = express();
const { Database } = require("./Database/database");
const API = require("./Router/router");
const PORT = 7000;

//Middleware to parse JSON data in the request body
app.use(express.json());
app.use(cors());

//Root API :-
app.use("/library",API)

//Database connection :-
Database();

//Running the server :-
app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error in Running the PORT:${PORT}`);
  } else {
    console.log(`PORT:${PORT} is Running`);
  }
});
