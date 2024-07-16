import React, { useState } from 'react';
import './MovieSearch.css';

const MovieSearch = ({ handleSearch }) => {
    const [plot, setPlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onSearch = async () => {
        setLoading(true);
        setError('');
        try {
            await handleSearch(plot);
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
            <button onClick={onSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Find Similar Movies'}
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default MovieSearch;
