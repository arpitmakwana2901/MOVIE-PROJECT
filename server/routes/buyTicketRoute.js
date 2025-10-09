const express = require("express");
const authenticate = require("../middlewere/auth");
const BuyTicketModel = require("../models/buyTicketModel");

const buyTicketRoute = express.Router();

buyTicketRoute.post("/purchase", authenticate, async (req, res) => {
  try {
    const {
      movieId,
      title,
      image,
      releaseYear,
      genres,
      runtime,
      rating,
      seats,
    } = req.body;

    // ✅ Use req.user._id for userId
    const ticket = new BuyTicketModel({
      movieId,
      title,
      image,
      releaseYear,
      genres,
      runtime,
      rating,
      seats,
      userId: req.user._id,
    });

    console.log(req.user, "req_user"); // debug only

    await ticket.save();
    res.status(201).json({ message: "Ticket booked successfully", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking ticket", error });
  }
});

module.exports = buyTicketRoute;
