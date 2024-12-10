import "./MovieCard.css";
import Movies from "./WelcomePage";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie, isSingle }) {
  const navigate = useNavigate();

  const detailsButton = () => {
    navigate(`/movies/${movie.id}`);
  }

  const backButton = () => {
    navigate("/movies");
  }

  return (
    <div className="movie-card">
      <h2 className="movie-title">{movie.name}</h2>
      {movie.image_url ? (
        <img src={movie.image_url} alt={movie.name} />
      ) : (
        <p>No image available</p>
      )}
      <p className="movie-description">{movie.description}</p>
      <p className="movie-genre">Genre: {movie.genre}</p>
      <p className="movie-rating">Rating: {movie.average_rating}</p>
      {isSingle ? (
        <>
          <Movies />
          <div className="button-container">
            <button onClick={backButton} className="movie-card-button">Go Back</button>
          </div>
        </>
      ) : (
        <button onClick={detailsButton} className="movie-card-button">See Details</button>
      )
    }
    </div>
  );
}
