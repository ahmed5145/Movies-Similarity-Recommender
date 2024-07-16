import React from 'react';
import './MovieList.css';

const MovieList = ({ movies }) => {
  console.log('Movies prop:', movies);
  if (!Array.isArray(movies)) {
    console.error('Expected movies to be an array but got:', movies);
    return null;
  }
  return (
    <div className="movie-list">
      {movies.map((movie, index) => (
        <div key={index} className="movie-item">
          <h3>{movie.Title.replace(/\([^()]*\)/g, '').trim()}</h3>
          <p>{`Release Year: ${movie['Release Year']}`}</p>
          <p>{`Plot: ${movie.Plot}`}</p>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
