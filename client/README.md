# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



import { StarIcon } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAuth } from "./context/AuthContext";
import axios from "axios";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { token } = useAuth(); // get JWT token from context

  const handleBuyTicket = async () => {
    console.log(token, "buyticket");
    try {
      // Send POST request to backend
      const res = await axios.post(
        "http://localhost:3690/buy-ticket/purchase",
        {
          title: movie.title,
          image: movie.backdrop_path,
          releaseYear: new Date(movie.release_date).getFullYear(),
          genres: Array.isArray(movie.genres)
            ? movie.genres.map((g) => g.name || g)
            : [],
          runtime: movie.runtime || 0,
          rating: movie.vote_average || 0,
          seats: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // send JWT for auth
          },
        }
      );
      console.log(token, "token--");
      // navigate(`/movies/${movie._id}`, { state: { movie } });

      console.log("Ticket saved:", res.data);
      navigate(`/movies/${movie._id}`); // <-- your BookNow / DateSelect page
      scrollTo(0, 0);
      alert("🎉 Ticket booked successfully!");
    } catch (err) {
      console.log("Booking error:", err);
      alert("❌ Error booking ticket");
    }
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        src={movie.backdrop_path}
        alt=""
        className="rounded-lg h-52 w-full object-cover object-center cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} .{" "}
        {Array.isArray(movie.genres)
          ? movie.genres
              .slice(0, 2)
              .map((g) => g.name || g)
              .join(" | ")
          : "No genres"}{" "}
        . {movie.runtime ? timeFormat(movie.runtime) : "N/A"}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3 px-2">
        {/* Buy Tickets Button */}
        <Link to={`/movies/${movie._id}`}>
          <button
            onClick={handleBuyTicket} // navigate inside handleBuyTicket
            className="bg-[#f84c56] hover:bg-[#e03e47] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md transition duration-300"
          >
            Buy Tickets
          </button>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm text-white bg-[#121212] px-3 py-1 rounded-full shadow-sm">
          <svg
            className="w-4 h-4 text-[#f84c56] fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.905L19.335 24 12 19.897 4.665 24 6 15.655 0 9.75l8.332-1.595z" />
          </svg>
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import axios from "axios";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:3690/shows/getShows");
        console.log(res.data.shows, "response");

        setMovies(res.data.shows); // 👈 your backend sends { shows: [...] }
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, []);

  return movies.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />
      <h1 className="text-lg font-medium my-4">Now Showing</h1>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">No movies available</h1>
    </div>
  );
};

export default Movies;


remove buyTicket button in only for home page

        <Route path="/" element={<Home />} />

import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'


const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
    </>
  )
}

export default Home

import React from "react";
import { assets } from "../../../../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'>
      <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20" />

      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
        Guardians <br /> of the Galaxy
      </h1>

      <div className="flex items-center gap-4 text-gray-300">
        <span>Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4.5 h-4.5" /> 2018
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4.5 h-4.5" /> 2h 8m
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        🎬 Welcome to MovieTickets – Your Gateway to Entertainment! Find the
        latest movies, showtimes, and cinemas near you. Book tickets instantly,
        enjoy secure payments, and experience the magic of cinema with just a
        few clicks!
      </p>
      <button
        onClick={() => navigate("/movies")}
        className="flex items-center gap-2 px-6 py-3 text-sm bg-red-500 hover:bg-red-600 text-white transition rounded-full font-medium cursor-pointer"
      >
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeroSection;

import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Movies from "./Movies";
import BlurCircle from "./BlurCircle";
import { dummyShowsData } from "../../../../assets/assets";
import MovieCard from "./MovieCard";

const FeaturedSection = () => {
  const navigate = useNavigate();
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-80px" />
        <p className="text-gray-300 font-medium text-lg">Now Showing</p>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
        >
          View All
          <ArrowRightIcon className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
        </button>
      </div>

      <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
        {dummyShowsData.slice(0, 8).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-6 py-3 bg-[#f34c65] hover:bg-[#e13b54] text-white font-semibold rounded-lg shadow-md transition"
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
 