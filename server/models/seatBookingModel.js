const mongoose = require("mongoose");

const seatBookingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show", // ya "Movie", jo bhi tumhare project me model hai
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    seats: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const SeatBookingModel = mongoose.model("seat-booking", seatBookingSchema);
module.exports = SeatBookingModel;
