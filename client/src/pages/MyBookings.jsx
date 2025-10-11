import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "./../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch user bookings from backend
  const getMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view bookings");
        return;
      }

      const res = await axios.get("http://localhost:3690/checkout", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setBookings(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <Toaster position="top-center" />
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="text-lg font-semibold mb-4">My Bookings</h1>

      {!isLoading && bookings.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          <p>No bookings found</p>
          <p className="text-sm">Book your first ticket to see it here!</p>
        </div>
      )}

      {bookings.map((item, index) => (
        <div
          key={item._id || index}
          className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
        >
          <div className="flex flex-col md:flex-row">
            <img
              src={item.poster_path}
              alt={item.movieTitle}
              className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
            />
            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{item.movieTitle}</p>
              <p className="text-gray-400 text-sm">
                {timeFormat(item.runtime)}
              </p>
              <p className="text-gray-400 text-sm">Show Time: {item.time}</p>
              <p className="text-gray-400 text-sm mt-auto">
                {dateFormat(item.showDate)}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">
                {currency}
                {item.totalAmount}
              </p>
              {!item.isPaid && (
                <button className="flex items-center gap-2 px-8 py-3 bg-[#e64949] hover:bg-[#d13c3c] transition rounded-full font-semibold text-white text-sm shadow-md active:scale-95">
                  Pay Now
                </button>
              )}
            </div>
            <div className="text-sm">
              <p>
                <span className="text-gray-400">Total Tickets:</span>{" "}
                {item.seats.length}
              </p>
              <p>
                <span className="text-gray-400">Seat Number:</span>{" "}
                {item.seats.join(", ")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
