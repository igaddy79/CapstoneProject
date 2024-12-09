import "./MovieCard.css";
import Movies from "./Movies";

export default function MovieCard ({ movie }) {
    return (
        <div className="movie-card">
            <h2 className="movie-title">{movie.name}</h2>
            {/* <p className="movie-description">{movie.description}</p> */}
            {/* <img src={movie.image_url} alt={movie.name} /> */}
            {
                movie.image_url ? (
                    <img src={movie.image_url} alt={movie.name} />
                ) : (
                    <p>No image available</p>
                )
            }
            <p className="movie-description">{movie.description}</p>
            <p className="movie-genre">Genre: {movie.genre}</p>
            <p className="movie-rating">Rating: {movie.average_rating}</p>
        </div>
    )
}