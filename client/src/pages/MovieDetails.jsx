import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3690/shows/getShows/${id}`
        );
        setMovie(res.data.data); // ✅ response se data pick
        console.log("Movie Response:", res.data.data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="px-6 md:px-16  lg:px-40 pt-40">
      <div className="flex flex-col  md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Movie Poster */}
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        {/* Movie Info */}
        <div className="relative flex flex-col gap-3">
          <p className="text-primary">{movie.language || "N/A"}</p>
          <h1 className="text-4xl font-semibold">{movie.title}</h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {movie.vote_average?.toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight">
            {movie.overview}
          </p>

          <p>
            {timeFormat(movie.runtime)} •{" "}
            {Array.isArray(movie.genres) ? movie.genres.join(", ") : "N/A"} •{" "}
            {new Date(movie.release_date).getFullYear()}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className="w-5 h-5 " />
              Watch Trailer
            </button>
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>
            <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95 ">
              <Heart className={`w-5 h-5`} />
            </button>
          </div>

          {/* Cast Section */}
          <p className="text-lg font-medium mt-20">Your Favorite Cast</p>
          <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
            <div className="flex items-center gap-4 w-max px-4">
              {movie.cast?.slice(0, 12).map((cast, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <img
                    src={cast.profile_path}
                    alt=""
                    className="rounded-full h-20 md:h-20 aspect-square object-cover"
                  />
                  <p className="font-medium text-xs mt-3">{cast.name}</p>
                </div>
              )) || <p className="text-gray-400 text-sm">No cast available</p>}
            </div>
          </div>

          {/* Date Selection Section */}
          <DateSelect dateTime={movie.showDates || {}} movieId={id} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
