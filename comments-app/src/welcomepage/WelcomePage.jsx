import { useEffect, useState } from "react";
// import { moviesList } from '../data';
import MovieCard from "./MovieCard";

export default function WelcomePage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    console.log(movies.length);
  }, [movies]);

  const fetchAllMovies = async () => {
    const response = await fetch(`http://localhost:3000/movies`);
    const result = await response.json();
    return result;
  };

  useEffect(() => {
    const getAllMovies = async () => {
      try {
        const movies = await fetchAllMovies();
        setMovies(movies);
      } catch (error) {
        console.error("Whoops, there was an error fetching all movies");
      }
    };
    getAllMovies();
  }, []);

  return (
    <div className="movie-card-container">
      {movies.length > 0 ? (
        movies.map((movie) => {
          return (
            <MovieCard key={movie.id} movie={movie} setMovies={setMovies} />
          );
        })
      ) : (
        <h2>No movies!</h2>
      )}
    </div>
  );
}
