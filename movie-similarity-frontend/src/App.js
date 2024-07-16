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
      const response = await axios.get('/api/movies');
      console.log('Fetched movies:', response.data);
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (plot) => {
    setLoading(true);
    setError('');
    setMovies([]);
    try {
        const response = await axios.post('/api/similar', { plot });
        setMovies(response.data);
    } catch (err) {
        setError('Error fetching similar movies.');
        console.error(err);
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
      <MovieSearch handleSearch={handleSearch} />
      <button onClick={fetchMovies}>Show All Movies</button>
      {loading ? <p>Loading...</p> : <MovieList movies={movies} />}
    </div>
  );
};

export default App;
