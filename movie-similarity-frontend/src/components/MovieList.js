import React from 'react';
import './MovieList.css';

const MovieList = ({ movies }) => {
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
