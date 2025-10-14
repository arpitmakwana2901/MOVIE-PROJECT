import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../components/context/AuthContext";

const SeatLayout = () => {
  const { id } = useParams();
  console.log(id, "movie");
  const navigate = useNavigate();
  const { token } = useAuth();

  const [layoutData, setLayoutData] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviesData, setMoviesData] = useState([]);

  const fetchMoviesData = async () => {
    try {
      const res = await axios.get("http://localhost:3690/shows/getShows");
      setMoviesData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setMoviesData([]);
    }
  };

  const fetchSeatLayout = async () => {
    try {
      const res = await axios.get(`http://localhost:3690/seat-layout/${id}`);
      if (res.data.success) {
        console.log(res.data);
        setLayoutData(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch layout");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching layout");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatLayout();
    fetchMoviesData();
  }, [id]);

  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedTime]);

  const handleCheckout = async () => {
    if (!selectedTime) {
      toast.error("Please select a time");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Select at least one seat");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Login required");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        "http://localhost:3690/seat-booking/book-seats",
        {
          movieId: id,
          time: selectedTime.time,
          seats: selectedSeats,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Booking successful! Redirecting...");

        const currentMovie = moviesData.find((movie) => movie._id === id);

        const bookingData = {
          _id: res.data.booking?._id || Date.now().toString(),
          movieId: id,
          movieTitle: currentMovie?.title || layoutData?.movieTitle || "Movie",
          poster_path:
            currentMovie?.backdrop_path ||
            currentMovie?.poster_path ||
            layoutData?.poster_path ||
            "",
          backdrop_path: currentMovie?.backdrop_path || "",
          runtime: currentMovie?.runtime || layoutData?.runtime || 120,
          genres: currentMovie?.genres || [],
          time: selectedTime.time,
          seats: selectedSeats,
          totalAmount: selectedSeats.reduce((total, seatId) => {
            const [categoryName] = seatId.split("-");
            const section = seatRows[categoryName];
            return total + (section?.price || 0);
          }, 0),
          showDate: new Date(),
          isPaid: false,
        };

        navigate("/my-bookings", {
          state: {
            latestBooking: bookingData,
            success: true,
            message: "Booking successful!",
          },
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("❌ Booking error:", error);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const handleSeatSelect = (seatId) => {
    if (!selectedTime) {
      toast.error("Please select a time first");
      return;
    }

    const isSeatBooked = checkIfSeatBooked(seatId);
    if (isSeatBooked) {
      toast.error("This seat is already booked");
      return;
    }

    const alreadySelected = selectedSeats.includes(seatId);

    if (!alreadySelected && selectedSeats.length >= 5) {
      toast.error("Maximum 5 seats allowed");
      return;
    }

    setSelectedSeats((prev) =>
      alreadySelected ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const checkIfSeatBooked = (seatId) => {
    if (!layoutData || !selectedTime) return false;

    const [categoryName, rowName, seatNumber] = seatId.split("-");

    const timeSlot = layoutData.timeSlots.find(
      (t) => t.time === selectedTime.time
    );
    if (!timeSlot) return false;

    const category = timeSlot.categories.find(
      (cat) => cat.categoryName === categoryName
    );
    if (!category) return false;

    const row = category.rows.find((r) => r.rowName === rowName);
    if (!row) return false;

    const seat = row.seats.find((s) => s.seatNumber === seatNumber);
    return seat ? seat.isBooked : false;
  };

  if (loading) return <div className="text-white px-6 py-12">Loading...</div>;
  if (!layoutData)
    return <div className="text-white px-6 py-12">No layout found</div>;

  const seatRows = {};
  layoutData.timeSlots.forEach((slot) => {
    slot.categories.forEach((cat) => {
      if (!seatRows[cat.categoryName])
        seatRows[cat.categoryName] = { price: cat.price, rows: cat.rows };
    });
  });

  const renderSeats = (sectionKey, section) => (
    <div className="mb-10">
      <p className="text-center font-semibold text-sm text-gray-300 mb-2">
        ₹{section.price} {sectionKey.toUpperCase()}
      </p>
      <div className="flex flex-col items-center gap-2">
        {section.rows.map((row) => (
          <div key={row.rowName} className="flex gap-2 items-center">
            <span className="text-xs text-gray-400 w-4">{row.rowName}</span>
            {row.seats.map((seat) => {
              const seatId = `${sectionKey}-${row.rowName}-${seat.seatNumber}`;
              const isSelected = selectedSeats.includes(seatId);
              const isSold = checkIfSeatBooked(seatId);
              const isBestseller = seat.isBestseller;

              let className =
                "w-6 h-6 rounded-sm flex items-center justify-center border text-xs cursor-pointer transition-all";

              if (isSold) {
                className += " bg-gray-300 cursor-not-allowed";
              } else if (!selectedTime) {
                className +=
                  " border-gray-600 text-gray-600 cursor-not-allowed";
              } else if (isSelected) {
                className += " bg-green-700 text-white border-green-700";
              } else if (isBestseller) {
                className +=
                  " border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white";
              } else {
                className +=
                  " border-green-500 text-green-500 hover:bg-green-500 hover:text-white";
              }

              return (
                <div
                  key={seatId}
                  className={className}
                  onClick={() => handleSeatSelect(seatId)}
                  title={isSold ? "Already Booked" : `Seat ${seat.seatNumber}`}
                >
                  {seat.seatNumber}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-32 py-10 md:pt-16 text-white relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Sidebar: Timings */}
      <div className="w-full md:w-1/4 bg-[#1e0b0b] border border-[#3a1a1a] rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5">
          {layoutData.timeSlots.map((slot, index) => (
            <div
              key={`${slot.time}-${index}`}
              onClick={() => setSelectedTime(slot)}
              className={`flex items-center gap-2 px-6 py-2 w-full rounded-r-md cursor-pointer transition ${
                selectedTime?.time === slot.time
                  ? "bg-primary text-white"
                  : "hover:bg-[#3a1a1a] text-white"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{slot.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main: Seat layout */}
      <div className="flex-1 flex flex-col items-center max-md:mt-16 relative">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>

        {selectedTime && (
          <p className="text-green-500 font-medium mb-4 text-sm">
            Selected Time: {selectedTime.time}
          </p>
        )}

        {!selectedTime && (
          <p className="text-red-500 font-medium mb-4 text-sm">
            Please select a time to choose seats
          </p>
        )}

        {Object.entries(seatRows).map(([key, section]) =>
          renderSeats(key, section)
        )}

        {/* Screen */}
        <div className="mt-6 w-3/4 bg-gray-400 h-2 rounded-lg flex items-center justify-center">
          <p className="text-gray-800 text-xs font-bold">SCREEN</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-8 text-sm flex-wrap justify-center">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border border-green-500 bg-green-500"></div>
            <span className="text-green-500">Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-700"></div>
            <span className="text-white">Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-300"></div>
            <span className="text-gray-300">Sold</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border border-yellow-500"></div>
            <span className="text-yellow-500">Bestseller</span>
          </div>
        </div>

        {/* Checkout Button */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 p-4 bg-[#2a0f0f] rounded-lg">
            <p className="text-sm text-gray-300">
              Selected Seats:{" "}
              <span className="text-white font-semibold">
                {selectedSeats.join(", ")}
              </span>
            </p>
            <p className="text-sm text-gray-300 mt-1">
              Total Amount:{" "}
              <span className="text-white font-semibold">
                ₹
                {selectedSeats.reduce((total, seatId) => {
                  const [categoryName] = seatId.split("-");
                  const section = seatRows[categoryName];
                  return total + (section?.price || 0);
                }, 0)}
              </span>
            </p>
          </div>
        )}

        <div className="w-full flex justify-center mt-10">
          <button
            onClick={handleCheckout}
            disabled={!selectedTime || selectedSeats.length === 0}
            className={`flex items-center gap-2 px-8 py-3 transition rounded-full font-semibold text-white text-sm shadow-md active:scale-95 ${
              selectedTime && selectedSeats.length > 0
                ? "bg-[#e64949] hover:bg-[#d13c3c] cursor-pointer"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Proceed to Checkout
            <ArrowRightIcon strokeWidth={2.5} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
