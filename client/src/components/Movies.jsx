import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import axios from "axios";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          "https://movie-project-backend-ufco.onrender.com/shows/getShows"
        );
        console.log(res, "response");
        setMovies(res.data.data || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setMovies([]);
      }
    };

    fetchMovies();
  }, []);

  return movies.length > 0 ? (
    // 🚀 Changed margins: 'my-16 mb-20' for mobile, maintaining 'my-40 mb-60' for desktop (md and up)
    <div className="relative my-16 mb-20 md:my-40 md:mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] text-white">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      {/* 🚀 Changed Heading: Larger font for mobile, better margin */}
      <h1 className="text-xl font-semibold mb-6 md:text-lg md:font-medium md:my-4">
        Now Showing
      </h1>

      {/* 🚀 Changed Gap: 'gap-4' for mobile, maintaining 'gap-8' for desktop (md and up) */}
      <div className="flex flex-wrap max-sm:justify-center gap-4 md:gap-8">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-3xl font-bold text-center">No movies available</h1>
    </div>
  );
};

export default Movies;
