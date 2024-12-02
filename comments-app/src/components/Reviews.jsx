import React, { useEffect, useState } from 'react';
import './Reviews.css';

const Reviews = () => {
  const [Reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [newreview, setnewreview] = useState('');
  const [editreviewId, setEditreviewId] = useState(null);
  const [editreviewText, setEditreviewText] = useState('');
  
 const reviewsUrl = 'http://localhost:3000/reviews';
  

  // Fetch Reviews (Read)
  const fetchReviews = async () => {
    try {
      const response = await fetch(reviewsUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchreviews = async () => {
    try {
      const response = await fetch(reviewsUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchreviews();
  }, []);
  




  // Add a new review (Create)
  const handleAddreview = async () => {
    if (!newreview.trim()) return;
    try {
      const response = await fetch(reviewsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_text: newreview, review_id: 1 }), 
      });

      if (!response.ok) {
        throw new Error('Failed to add review');
      }

      const addedreview = await response.json();
      setReviews((prevReviews) => [...prevReviews, addedreview]);
      setnewreview('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit an existing review (Update)
  const handleEditreview = async (id) => {
    if (!editreviewText.trim()) return;
    try {
      const response = await fetch(`${reviewsUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_text: editreviewText }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      const updatedreview = await response.json();
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? updatedreview : review
        )
      );
      setEditreviewId(null);
      setEditreviewText('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a review (Delete)
  const handleDeletereview = async (id) => {
    try {
      const response = await fetch(`${reviewsUrl}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="Reviews-container">
      <h1>Reviews</h1>
      {error && <p className="error">{error}</p>}

      
      <div className="new-review">
        <textarea
          value={newreview}
          onChange={(e) => setnewreview(e.target.value)}
          placeholder="Write a new review..."
        ></textarea>
        <button onClick={handleAddreview}>Add review</button>
      </div>

      
      <ul>
        {Reviews.map((review) => (
          <li key={review.id} className="review-item">
            {editreviewId === review.id ? (
              <div>
                <textarea
                  value={editreviewText}
                  onChange={(e) => setEditreviewText(e.target.value)}
                ></textarea>
                <button onClick={() => handleEditreview(review.id)}>
                  Save
                </button>
                <button onClick={() => setEditreviewId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>review {review.review_id}:</strong> {review.review_text}
                </p>
                <p>
                  <small>
                    Posted on: {new Date(review.created_at).toLocaleString()}
                  </small>
                </p>
                <button onClick={() => {
                  setEditreviewId(review.id);
                  setEditreviewText(review.review_text);
                }}>Edit</button>
                <button onClick={() => handleDeletereview(review.id)}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;