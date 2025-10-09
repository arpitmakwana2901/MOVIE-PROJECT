const mongoose = require("mongoose");

const connection = async () => {
  await mongoose.connect("mongodb://127.0.0.1/movie-project");
  console.log("Database Connected");
};

module.exports = connection;
