import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Moviesstyles.css';

const Movies = () => {
  const { id } = useParams(); 
  const [movieData, setMovieData] = useState(null);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: '', review_text: '' });
  const [newComment, setNewComment] = useState({ comment_text: '', reviewId: '' });
  const [editReviewData, setEditReviewData] = useState({ id: '', rating: '', review_text: '' });
  const [editCommentData, setEditCommentData] = useState({ id: '', comment_text: '' });

  const movieUrl = `http://localhost:3000/movies/${id}`;
  const addReviewUrl = `http://localhost:3000/reviews`;
  const addCommentUrl = `http://localhost:3000/comments`;

  const fetchMovieData = useCallback(async () => {
    try {
      console.log(`Fetching movie data from ${movieUrl}`);
      const response = await fetch(movieUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch movie data');
      }
      const data = await response.json();
      setMovieData(data);
    } catch (err) {
      console.error('Error fetching movie data:', err);
      setError(err.message);
    }
  }, [movieUrl]);

  const handleAddReview = async () => {
    try {
      const payload = {
        ...newReview,
        movie_id: id,
        user_id: id, 
      };
        const response = await fetch(addReviewUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add review');
      }
  
      await fetchMovieData(); 
      setNewReview({ rating: '', review_text: '' });
    } catch (err) {
      console.error('Error adding review:', err);
      setError(err.message);
    }
  };
  

  const handleAddComment = async () => {
    if (!newComment.reviewId || !newComment.comment_text.trim()) {
      alert('Please select a review and enter a comment.');
      return;
    }
  
    const payload2 = {
      comment_text: newComment.comment_text,
      review_id: newComment.reviewId,
      movie_id: id,
      user_id: id,
    };
  
    try {
      console.log('Adding comment with payload:', payload2);
  
      const response = await fetch(addCommentUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload2),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to add comment');
      }
  
      await fetchMovieData();
      setNewComment({ comment_text: '', reviewId: '' });
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.message);
    }
  };
  

  const handleEditReview = async () => {
    try {
      const editReviewUrl = `http://localhost:3000/reviews/${editReviewData.id}`;
      const response = await fetch(editReviewUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editReviewData),
      });
      if (!response.ok) {
        throw new Error('Failed to edit review');
      }
      await fetchMovieData();
      setEditReviewData({ id: '', rating: '', review_text: '' });
    } catch (err) {
      console.error('Error editing review:', err);
      setError(err.message);
    }
  };

  const handleEditComment = async () => {
    try {
      const editCommentUrl = `http://localhost:3000/comments/${editCommentData.id}`;
      const response = await fetch(editCommentUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCommentData),
      });
      if (!response.ok) {
        throw new Error('Failed to edit comment');
      }
      await fetchMovieData();
      setEditCommentData({ id: '', comment_text: '' });
    } catch (err) {
      console.error('Error editing comment:', err);
      setError(err.message);
    }
  };

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
            <button onClick={() => setEditReviewData(review)}>Edit Review</button>
            <h4>Comments:</h4>
            {review.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>{comment.comment_text} - {new Date(comment.created_at).toLocaleString()}</p>
                <button onClick={() => setEditCommentData({ id: comment.id, comment_text: comment.comment_text })}>
                  Edit Comment
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="add-review">
        <h3>Add Review</h3>
        <input
          type="text"
          placeholder="Rating"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
        />
        <textarea
          placeholder="Review text"
          value={newReview.review_text}
          onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
        />
        <button onClick={handleAddReview}>Submit</button>
      </div>

      <div className="add-comment">
        <h3>Add Comment</h3>
        <select onChange={(e) => setNewComment({ ...newComment, reviewId: e.target.value })}>
          <option value="">Select Review</option>
          {movie.reviews.map((review) => (
            <option key={review.id} value={review.id}>{review.review_text}</option>
          ))}
        </select>
        <textarea
          placeholder="Comment text"
          value={newComment.comment_text}
          onChange={(e) => setNewComment({ ...newComment, comment_text: e.target.value })}
        />
        <button onClick={handleAddComment}>Submit</button>
      </div>

      {editReviewData.id && (
        <div className="edit-review">
          <h3>Edit Review</h3>
          <input
            type="text"
            placeholder="Rating"
            value={editReviewData.rating}
            onChange={(e) => setEditReviewData({ ...editReviewData, rating: e.target.value })}
          />
          <textarea
            placeholder="Review text"
            value={editReviewData.review_text}
            onChange={(e) => setEditReviewData({ ...editReviewData, review_text: e.target.value })}
          />
          <button onClick={handleEditReview}>Save</button>
        </div>
      )}

      {editCommentData.id && (
        <div className="edit-comment">
          <h3>Edit Comment</h3>
          <textarea
            placeholder="Comment text"
            value={editCommentData.comment_text}
            onChange={(e) => setEditCommentData({ ...editCommentData, comment_text: e.target.value })}
          />
          <button onClick={handleEditComment}>Save</button>
        </div>
      )}
    </div>
  );
};

export default Movies;
