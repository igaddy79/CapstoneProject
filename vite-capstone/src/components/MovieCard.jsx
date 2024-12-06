import "./MovieCard.css";
import Movies from "./Movies";

export default function MovieCard ({ movie }) {
    return (
        <div className="movie-card">
            <h2 className="movie-title">{movie.name}</h2>
            <p className="movie-description">{movie.namedescription}</p>
            {/* <img src={movie.image_url} alt={movie.name} /> */}
            {
                movie.image_url ? (
                    <img src={movie.image_url} alt={movie.name} />
                ) : (
                    <p>No image available</p>
                )
            }
        </div>
    )
}