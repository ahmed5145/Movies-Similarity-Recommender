import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from './components/MovieList';
import MovieSearch from './components/MovieSearch';
import './App.css'; 

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('api/similar', {
        plot: searchText,
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (year) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      const filteredMovies = response.data
        .filter(movie => movie['Release Year'] === year)
        .sort((a, b) => b['Release Year'] - a['Release Year']);
      setMovies(filteredMovies);
    } catch (error) {
      console.error('Error filtering movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="app">
      <h1>Movie Similarity Search</h1>
      <MovieSearch setMovies={setMovies} />
      <button onClick={fetchMovies}>Show All Movies</button>
      <button onClick={() => handleFilter('2023')}>Filter by Newest Movies</button>
      {loading ? <p>Loading...</p> : <MovieList movies={movies} />}
    </div>
  );
};

export default App;
