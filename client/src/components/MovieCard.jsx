import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAuth } from "./context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const MovieCard = ({ movie, showBuyButton = true }) => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleBuyTicket = async () => {
    if (!token) {
      toast.error("Login required to purchase tickets.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "https://movie-project-backend-ufco.onrender.com/buy-ticket/purchase",
        {
          showId: movie._id,
          seats: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("🎉 Ticket purchased successfully!");
      navigate(`/movies/${movie._id}`);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "❌ Error purchasing ticket");
    }
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-full max-w-xs md:max-w-[264px]">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        src={movie.backdrop_path}
        alt={movie.title}
        className="rounded-lg h-48 md:h-52 w-full object-cover object-center cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate text-base md:text-lg">
        {movie.title}
      </p>

      <p className="text-xs text-gray-400 mt-2 md:text-sm">
        {new Date(movie.release_date).getFullYear()} •{" "}
        {Array.isArray(movie.genres)
          ? movie.genres
              .slice(0, 2)
              .map((g) => g.name || g)
              .join(" | ")
          : "No genres"}{" "}
        • {movie.runtime ? timeFormat(movie.runtime) : "N/A"}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3 px-2">
        {showBuyButton && (
          <button
            onClick={handleBuyTicket}
            className="bg-[#f84c56] hover:bg-[#e03e47] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md transition duration-300 md:text-sm md:px-5 md:py-2"
          >
            Buy Ticket
          </button>
        )}

        <div className="flex items-center gap-1 text-xs text-white bg-[#121212] px-2 py-0.5 rounded-full shadow-sm md:text-sm md:px-3 md:py-1">
          <StarIcon className="w-3 h-3 text-[#f84c56] md:w-4 md:h-4" />
          {movie.vote_average?.toFixed(1) || "N/A"}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
