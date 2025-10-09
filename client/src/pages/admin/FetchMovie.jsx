import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../../components/MovieCard";

const FetchMovie = () => {
  const [movie, setMovie] = useState([]);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:3690/shows/getShows");
      setMovie(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Available Movies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {movie.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default FetchMovie;
