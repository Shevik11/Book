import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        text: '',
        rating: 5
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            setError('Please log in to submit a review');
            return;
        }

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/reviews/',
                {
                    book_id: id,
                    text: newReview.text,
                    rating: newReview.rating
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Add new review to the reviews array
            setReviews(prevReviews => [response.data, ...prevReviews]);

            // Clear the form
            setNewReview({
                text: '',
                rating: 5
            });

            // Опционально можно обновить список отзывов
            fetchReviews();

        } catch (error) {
            console.error('Error submitting review:', error);
            setError(error.response?.data?.message || 'Error submitting review');
        }
    };

    // Separate function to fetch reviews
    const fetchReviews = async () => {
        try {
            const accessToken = localStorage.getItem('access');
            const response = await axios.get(
                `http://127.0.0.1:8000/api/reviews/?book_id=${id}`,
                {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }
            );
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    // Function to fetch book details
    const fetchBookDetails = async () => {
        setIsLoading(true);
        try {
            const accessToken = localStorage.getItem('access');
            const response = await axios.get(
                `http://127.0.0.1:8000/api/books/${id}`,
                {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }
            );
            setBook(response.data);
            await fetchReviews(); // Fetch reviews after book details
        } catch (error) {
            console.error('Error fetching book details:', error);
            setError('Error loading book details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({
            ...prev,
            [name]: value
        }));
    };
    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {book && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">{book.title}</h1>

                    {/* Review Form */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Your Review
                                </label>
                                <textarea
                                    name="text"
                                    value={newReview.text}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Rating
                                </label>
                                <select
                                    name="rating"
                                    value={newReview.rating}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>

                            {error && (
                                <div className="text-red-500 mb-4">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>

                    {/* Reviews List */}
                 <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                        {reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="bg-gray-100 rounded-lg shadow-sm p-6 border border-gray-300"
                                    >
                                        <div className="mb-4">
                                            <span className="block text-sm text-gray-600">
                                                Reviewed by: {review.user?.username || 'Anonymous'}
                                            </span>
                                            <span className="block text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-800">{review.text}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-4">
                                No reviews yet. Be the first to review this book!
                            </p>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default BookDetails;