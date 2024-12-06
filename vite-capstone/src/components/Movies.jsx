import { useEffect, useState } from 'react';
// import { moviesList } from '../data';
import MovieCard from './MovieCard';

export default function Movies () {
    const [movies, setMovies] = useState([]);
    console.log(movies);

    const fetchAllMovies = async () => {
        const response = await fetch(`http://localhost:3000/movies`);
        const result = await response.json();
        return result;
    }

    useEffect (() => {
        const getAllMovies = async () => {
            try {
                const movies = await fetchAllMovies();
                console.log(movies);
                setMovies(movies);
            } catch (error) {
                console.error("Whoops, there was an error fetching all movies");
            }
        }
        getAllMovies();
    }, []);

    return (
        <div>
         {
            movies.length > 0 ? (
                movies.map((movie) => {
                    return <MovieCard key={movie.id} movie={movie} setMovies={setMovies} />
                })
            ) : (
                <h2>No movies!</h2>
            )
         }
        </div>
    )
}