import React, { useEffect, useState } from 'react';
//import './movies.css';

const Movies = () => {
  const [movies, setmovies] = useState([]);
  const [error, setError] = useState(null);
  //const [newMovie, setNewMovie] = useState('');
  //const [editMovieId, setEditMovieId] = useState(null);
  //const [editMovieText, setEditMovieText] = useState('');
  const moviesUrl = 'http://localhost:3000/movies';
  

  // Fetch movies (Read)
  const fetchMovies = async () => {
    try {
      const response = await fetch(moviesUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setmovies(data);
    } catch (err) {
      setError(err.message);
    }
  };
  
  useEffect(() => {
    fetchMovies();
  }, []);

  
  // Add a new Movie (Create)
  // const handleAddMovie = async () => {
  //   if (!newMovie.trim()) return;
  //   try {
  //     const response = await fetch(moviesUrl, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ Movie_text: newMovie, review_id: 1 }), 
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to add Movie');
  //     }

  //     const addedMovie = await response.json();
  //     setmovies((prevmovies) => [...prevmovies, addedMovie]);
  //     setNewMovie('');
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  // // Edit an existing Movie (Update)
  // const handleEditMovie = async (id) => {
  //   if (!editMovieText.trim()) return;
  //   try {
  //     const response = await fetch(`${moviesUrl}/${id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ Movie_text: editMovieText }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update Movie');
  //     }

  //     const updatedMovie = await response.json();
  //     setmovies((prevmovies) =>
  //       prevmovies.map((Movie) =>
  //         Movie.id === id ? updatedMovie : Movie
  //       )
  //     );
  //     setEditMovieId(null);
  //     setEditMovieText('');
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  // // Delete a Movie (Delete)
  // const handleDeleteMovie = async (id) => {
  //   try {
  //     const response = await fetch(`${moviesUrl}/${id}`, { method: 'DELETE' });

  //     if (!response.ok) {
  //       throw new Error('Failed to delete Movie');
  //     }

  //     setmovies((prevmovies) =>
  //       prevmovies.filter((Movie) => Movie.id !== id)
  //     );
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  return (
    <div className="movies-container">
      <h1>movies</h1>
      {error && <p className="error">{error}</p>}
    
      <ul>
        {movies.map((Movie) => (
          <li key={Movie.id} className="Movie-item">
            {Movie === Movie.id ? (
              <div>
                </div>
            ) : (
              <div>
                
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;

