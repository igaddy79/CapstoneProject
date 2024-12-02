import React, { useEffect, useState } from 'react';
import './Comments.css';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  
  const commentsUrl = 'http://localhost:3000/Comments';
  
  // Fetch comments (Read)
  const fetchComments = async () => {
    try {
      const response = await fetch(commentsUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    }
  };
  
  useEffect(() => {
    fetchComments();
  }, []);

  // Add a new comment (Create)
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await fetch(commentsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: newComment, review_id: 1 }), 
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const addedComment = await response.json();
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit an existing comment (Update)
  const handleEditComment = async (id) => {
    if (!editCommentText.trim()) return;
    try {
      const response = await fetch(`${commentsUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: editCommentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const updatedComment = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? updatedComment : comment
        )
      );
      setEditCommentId(null);
      setEditCommentText('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a comment (Delete)
  const handleDeleteComment = async (id) => {
    try {
      const response = await fetch(`${commentsUrl}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="comments-container">
      <h1>Comments</h1>
      {error && <p className="error">{error}</p>}

      
      <div className="new-comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a new comment..."
        ></textarea>
        <button onClick={handleAddComment}>Add Comment</button>
      </div>

      
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            {editCommentId === comment.id ? (
              <div>
                <textarea
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                ></textarea>
                <button onClick={() => handleEditComment(comment.id)}>
                  Save
                </button>
                <button onClick={() => setEditCommentId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>review {comment.review_id}:</strong> {comment.comment_text}
                </p>
                <p>
                  <small>
                    Posted on: {new Date(comment.created_at).toLocaleString()}
                  </small>
                </p>
                <button onClick={() => {
                  setEditCommentId(comment.id);
                  setEditCommentText(comment.comment_text);
                }}>Edit</button>
                <button onClick={() => handleDeleteComment(comment.id)}>
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

export default Comments;