import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SearchBooks = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');

    const fetchData = async () => {
        if (!query?.trim()) {
            setResults([]);
            return;
        }

        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            setError('No access token. Please log in.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/books/?search=${encodeURIComponent(query)}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setResults(response.data);
        } catch (error) {
            setError(
                error.response?.status === 401
                    ? 'Unauthorized: Please log in.'
                    : 'Error fetching data. Please try again.'
            );
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [query]); // Make sure to add query as a dependency

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
                Search Results for "{query || ''}"
            </h2>

            {error && (
                <p className="text-red-500 mb-4 p-2 bg-red-100 rounded">
                    {error}
                </p>
            )}

            <div>
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((book) => (
                            // Use both id and bookId as fallbacks for the key
                            <div
                                key={book.id || book.bookId || `${book.title}-${book.author}`}
                                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                            >
                                <Link
                                    to={`/books/${book.bookId || book.id}`}
                                    className="block"
                                >
                                    {book.coverImg && (
                                        <img
                                            src={book.coverImg}
                                            alt={`${book.title} cover`}
                                            className="w-full h-48 object-cover mb-4 rounded"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-book.png'; // Add a placeholder image
                                                e.target.onerror = null; // Prevent infinite loop
                                            }}
                                        />
                                    )}
                                    <h3 className="text-lg font-semibold mb-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {book.author}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">
                        {query?.trim() ? 'No results found.' : 'Enter a search term to find books.'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SearchBooks;