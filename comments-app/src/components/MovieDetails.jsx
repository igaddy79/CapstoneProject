import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  const movieUrl = `http://localhost:3000/movies/${id}`;
  const reviewsUrl = `http://localhost:3000/reviews?movieId=${id}`;
  const commentsUrl = `http://localhost:3000/comments?movieId=${id}`;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movieResponse = await fetch(movieUrl);
        if (!movieResponse.ok) throw new Error('Failed to fetch movie');
        const movieData = await movieResponse.json();
        setMovie(movieData);

        const reviewsResponse = await fetch(reviewsUrl);
        if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews');
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);

        const commentsResponse = await fetch(commentsUrl);
        if (!commentsResponse.ok) throw new Error('Failed to fetch comments');
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDetails();
  }, [id]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>{review.text}</li>
        ))}
      </ul>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default MovieDetails;
