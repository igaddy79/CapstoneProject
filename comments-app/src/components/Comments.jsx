import React, { useEffect, useState } from 'react';
import './Comments.css';



const Comments = () => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:3000/Comments');
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="comments-container">
      <h1>Comments</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <p><strong>User {comment.user_id}:</strong> {comment.comment_text}</p>
            <p><small>Posted on: {new Date(comment.created_at).toLocaleString()}</small></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
