const express = require("express");
const ShowModel = require("../models/addShowModel");
const addShowRoute = express.Router();

// ➤ Add Show
addShowRoute.post("/addShow", async (req, res) => {
  try {
    console.log("Add Show Body:", req.body); // 👈 Debugging

    const {
      title,
      overview,
      backdrop_path,
      release_date,
      vote_average,
      genres,
      runtime,
      language,
      cast,
      showDates, // 👈 include showDates also
    } = req.body;

    const newShow = await ShowModel.create({
      title,
      overview,
      backdrop_path,
      release_date,
      vote_average,
      genres,
      runtime,
      language,
      cast,
      showDates, // 👈 save showDates
    });

    res.status(201).json({
      message: "Show added successfully",
      data: newShow,
    });
  } catch (error) {
    console.error("Error adding show:", error);
    res
      .status(500)
      .json({ message: "Error adding show", error: error.message });
  }
});

// ➤ Get all shows
addShowRoute.get("/getShows", async (req, res) => {
  try {
    const shows = await ShowModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shows", error: error.message });
  }
});

// ➤ Get single show
addShowRoute.get("/getShows/:id", async (req, res) => {
  try {
    const show = await ShowModel.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    res.status(200).json({
      message: "Show fetched successfully",
      data: show,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching show", error: error.message });
  }
});

module.exports = addShowRoute;
