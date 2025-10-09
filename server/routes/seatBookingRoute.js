const express = require("express");
const SeatBookingModel = require("../models/seatBookingModel");
const SeatLayoutModel = require("../models/seatLayoutModel");
const authenticate = require("../middlewere/auth");

const seatBookingRoute = express.Router();

// POST → Book seats
seatBookingRoute.post("/book-seats", authenticate, async (req, res) => {
  try {
    const { movieId, time, seats } = req.body;
    console.log(movieId, "MOVIE_ID");
    console.log(time, "TIME");
    console.log(seats, "SEATS");
    if (!movieId || !time || !seats || seats.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // ✅ Make sure userId exists
    const userId = req.user._id || req.user.userId;
    console.log(userId, "USER_ID");
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const layout = await SeatLayoutModel.findOne({ movieId });
    if (!layout)
      return res
        .status(404)
        .json({ success: false, message: "Layout not found" });
    console.log(layout, "LAYOUT");
    const timeSlot = layout.timeSlots.find((t) => t.time === time);
    console.log(timeSlot, "TIME_SLOT");
    if (!timeSlot)
      return res
        .status(404)
        .json({ success: false, message: "Time slot not found" });

    // Check already booked seats
    const alreadyBooked = [];
    timeSlot.categories.forEach((cat) => {
      cat.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          if (seats.includes(seat.seatNumber) && seat.isBooked)
            alreadyBooked.push(seat.seatNumber);
        });
      });
    });

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${alreadyBooked.join(", ")}`,
      });
    }

    // Mark seats as booked
    timeSlot.categories.forEach((cat) => {
      cat.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          if (seats.includes(seat.seatNumber)) seat.isBooked = true;
        });
      });
    });

    await layout.save();

    // Save booking record
    const booking = await SeatBookingModel.create({
      userId,
      movieId,
      time,
      seats,
    });
    console.log(booking, "BOOKING");
    res.status(200).json({
      success: true,
      message: "Seats booked successfully",
      data: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = seatBookingRoute;
