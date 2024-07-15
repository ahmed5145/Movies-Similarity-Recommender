import React, { useState } from 'react';
import axios from 'axios';
import './MovieSearch.css';

const MovieSearch = ({ setMovies }) => {
    const [plot, setPlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setMovies([]); // Clear previous results
        try {
            const response = await axios.post('/api/similar', { plot });
            setMovies(response.data);
        } catch (err) {
            setError('Error fetching similar movies.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="movie-search">
            <textarea
                placeholder="Enter movie plot..."
                value={plot}
                onChange={(e) => setPlot(e.target.value)}
                rows="4"
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Find Similar Movies'}
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default MovieSearch;
