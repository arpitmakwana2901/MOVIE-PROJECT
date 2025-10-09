import React, { useState } from "react";
import axios from "axios";
import BlurCircle from "./BlurCircle";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const DateSelect = ({ dateTime, movieId }) => {
  const [selected, setSelected] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const onBookHandler = async () => {
    if (!selected) {
      alert("Pehle koi date select karo!");
      return;
    }

    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3690/book-ticket",
        { movieId, selectedDate: selected }, // ✅ no userId
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data.message);
      alert(res.data.message);
      navigate(`/movies/${movieId}/${selected}`);
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
      console.log(err.message);
    }
  };

  return (
    <div id="dateSelect" className="px-6 md:px-16 lg:px-40 pt-6">
      <div className="flex w-full flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        <div>
          <p className="text-lg font-semibold text-white">Choose Date</p>
          <div className="flex items-center gap-6 text-sm mt-5">
            <ChevronLeftIcon
              width={28}
              className="text-gray-400 cursor-pointer"
            />

            <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
              {Object.keys(dateTime).map((date) => (
                <button
                  key={date}
                  onClick={() => setSelected(date)}
                  className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded-md transition-all ${
                    selected === date
                      ? "bg-primary text-white"
                      : "border border-gray-500 text-gray-300"
                  }`}
                >
                  <span>{new Date(date).getDate()}</span>
                  <span className="text-xs">
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                </button>
              ))}
            </span>

            <ChevronRightIcon
              width={28}
              className="text-gray-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-30 md:w-auto">
          <button
            onClick={onBookHandler}
            className="bg-primary text-white px-8 py-2 mt-6 md:mt-0 rounded hover:bg-primary/90 transition-all cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateSelect;
