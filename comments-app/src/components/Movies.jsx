import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Movies = () => {
  const { id } = useParams(); // Get the movie id from the URL params
  const [movieData, setMovieData] = useState(null); // Holds the movie, reviews, and comments data
  const [error, setError] = useState(null);

  const movieUrl = `http://localhost:3000/movies/${id}`; // URL to fetch all movie-related data

  // Fetch all movie-related data (movie, reviews, and comments)
  const fetchMovieData = async () => {
    try {
      console.log(`Fetching movie data from ${movieUrl}`);
      const response = await fetch(movieUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch movie data');
      }
      const data = await response.json();
      console.log('Fetched movie data:', data);
      setMovieData(data);
    } catch (err) {
      console.error('Error fetching movie data:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, [id]); // Fetch data again if movie id changes

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!movieData) {
    return <p>Loading movie details...</p>;
  }

  const { movie, reviews, comments } = movieData; // Assuming response structure

  return (
    <div className="movies-container">
      <h1>Movie Details</h1>
      {movie && (
        <div className="movie-detail">
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
          <img src={movie.poster_url} alt={movie.title} />
        </div>
      )}

      <h2>Reviews</h2>
      {reviews && reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <p>{review.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews available.</p>
      )}

      <h2>Comments</h2>
      {comments && comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.comment_text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
};

export default Movies;
