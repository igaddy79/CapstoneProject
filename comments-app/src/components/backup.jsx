import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Moviesstyles.css';


const Movies = () => {
  const { id } = useParams(); 
  const [movieData, setMovieData] = useState(null);
  const [error, setError] = useState(null);

  const movieUrl = `http://localhost:3000/movies/${id}`;
  const addReview = `http://localhost:3000/reviews`;
  const editReview = `http://localhost:3000/reviews/${id}`;
  const addComment = `http://localhost:3000/comments`;
  const editComment = `http://localhost:3000/reviews/${id}`;

  
  const fetchMovieData = useCallback(async () => {
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
  }, [movieUrl]); 

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]); 

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!movieData) {
    return <p>Loading movie details...</p>;
  }

  const movie = movieData;

  return (
    <div className="movies-container">
      
      <div className="movie-detail">
        <h2>{movie.title}</h2>
        <p>{movie.description}</p>
        <img src={movie.image_url} alt={movie.title} />
        <p>Genre: {movie.genre}</p>
        <p>Average Rating: {movie.average_rating}</p>
      </div>

      
      <div className="reviews-section">
        <h3>Reviews:</h3>
        {movie.reviews.map((review) => (
          <div key={review.id} className="review">
            <p>Rating: {review.rating}</p>
            <p>{review.review_text}</p>
            <h4>Comments:</h4>
            {review.comments.map((comment) => (
              <p key={comment.id} className="comment">
                {comment.comment_text} - {new Date(comment.created_at).toLocaleString()}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;