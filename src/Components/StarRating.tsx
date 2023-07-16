import React, { useState } from "react";
import './StarRating.css';
import { BookDTO, ReviewDto } from "./interfaces";
import axios from "axios";

interface BookProps {
  bookId: string;
  starRating: number;
  setSelectedBooks: React.Dispatch<React.SetStateAction<BookDTO[]>>;
}

const StarRating: React.FC<BookProps> = ({ bookId, starRating, setSelectedBooks }) => {
  const [rating, setRating] = useState<number>(starRating);
  const [hover, setHover] = useState<number>(0);
  const APPLICATION_URL = "https://booknest.azurewebsites.net/api/books";

  const handleRatingChange = (index: number) => {
    setRating(index);
    updateRating(bookId, index);
  };

  const updateRating = async (bookId: string, newRating: number) => {
    try {
      const url = `${APPLICATION_URL}/review/${bookId}`;
      const response = await axios.put<ReviewDto>(
        url.trim(),
        {
          rating: newRating
        }
      );

      if (response.status === 200) {
        const updatedReview = response.data;
        setSelectedBooks((prevSelectedBooks: BookDTO[]) =>
          prevSelectedBooks.map((book) => {
            if (book.review && book.review.id === updatedReview.id) {
              return {
                ...book,
                review: {
                  ...book.review,
                  rating: updatedReview.rating
                }
              };
            }
            return book;
          }) as BookDTO[]
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        console.log(star);
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={() => handleRatingChange(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
