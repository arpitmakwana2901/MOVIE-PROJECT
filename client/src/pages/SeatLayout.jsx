import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../components/context/AuthContext";

const SeatLayout = () => {
  const { id } = useParams();
  console.log(id, "FRONTEND_ID");
  const navigate = useNavigate();


  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [layoutData, setLayoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  console.log(token, "TOKEN");
  // ✅ Backend se seat layout fetch karne ka function
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
      console.error("Error fetching layout:", error);
      toast.error("Error fetching layout");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatLayout();
  }, [id]);

  const handleCheckout = async () => {
    if (!selectedTime) {
      toast.error("Please select a time");
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Login required");
        return;
      }

      const res = await axios.post(
        "http://localhost:3690/seat-booking/book-seats",
        {
          movieId: id,
          time: selectedTime.time,
          seats: selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setSelectedSeats([]);
        setSelectedTime(null);
        navigate("/my-bookings");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return <div className="text-white px-6 py-12">Loading...</div>;
  if (!layoutData)
    return <div className="text-white px-6 py-12">No layout found</div>;

  // Backend se data ko map karne ke liye
  const seatRows = {};
  layoutData.timeSlots.forEach((slot) => {
    slot.categories.forEach((cat) => {
      if (!seatRows[cat.categoryName]) {
        seatRows[cat.categoryName] = {
          price: cat.price,
          rows: cat.rows,
        };
      }
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
              const seatId = seat.seatNumber;
              const isSelected = selectedSeats.includes(seatId);

              let className =
                "w-6 h-6 rounded-sm flex items-center justify-center border text-xs cursor-pointer";

              // 1️⃣ Sold seats
              if (seat.isBooked) {
                className += " bg-gray-300 cursor-not-allowed ";
              }
              // 2️⃣ Selected by user
              else if (selectedSeats.includes(seat.seatNumber)) {
                className += " bg-green-700 text-white";
              }
              // 3️⃣ Default available
              else {
                className += " border-gray-500 text-gray-500";
              }

              return (
                <div
                  key={seatId}
                  className={className}
                  onClick={() => {
                    if (seat.isBooked) return;
                    if (!selectedTime) {
                      toast.custom(
                        (t) => (
                          <div
                            className={`bg-red-600 text-white px-3 py-1 rounded shadow-md text-sm transition-all duration-300 ${
                              t.visible ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            Please select a time
                          </div>
                        ),
                        { duration: 2000 }
                      );
                      return;
                    }

                    const isAlreadySelected = selectedSeats.includes(seatId);

                    if (!isAlreadySelected && selectedSeats.length >= 5) {
                      toast.error("Maximum 5 seats are selected");
                      return;
                    }

                    setSelectedSeats((prev) =>
                      isAlreadySelected
                        ? prev.filter((s) => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                >
                  {seat.seatNumber.replace(/[A-Z]+-/, "")}
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
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
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

        {!selectedTime && (
          <p className="text-red-500 font-medium mb-4 text-sm">
            Please select a time
          </p>
        )}

        {Object.entries(seatRows).map(([key, section]) =>
          renderSeats(key, section)
        )}

        <div className="mt-6">
          <p className="text-gray-400 text-sm text-center mt-2">SCREEN SIDE</p>
        </div>

        <div className="flex items-center gap-4 mt-8 text-sm flex-wrap justify-center">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border border-green-500"></div>
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
        </div>

        <div className="w-full flex justify-center mt-10">
          <button
            onClick={handleCheckout}
            className="flex items-center gap-2 px-8 py-3 bg-[#e64949] hover:bg-[#d13c3c] transition rounded-full font-semibold text-white text-sm shadow-md active:scale-95"
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
