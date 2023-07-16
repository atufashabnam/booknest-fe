import React from 'react';
import { Form } from 'react-bootstrap';

import { BookDTO, ReviewDto } from './interfaces';
import axios from 'axios';
import './StatusDropdown.css';

interface StatusDropdownProps {
  book: BookDTO,
  setSelectedBooks: React.Dispatch<React.SetStateAction<BookDTO[]>>;
}


const StatusDropdown: React.FC<StatusDropdownProps> = ({ book, setSelectedBooks }) => {

  const APPLICATION_URL = "https://booknest.azurewebsites.net/api/books";

  const updateStatus = async (bookId: string, newStatus: string) => {
    try {
      const url = `${APPLICATION_URL}/review/${bookId}`;
      const response = await axios.put<ReviewDto>(
        url.trim(),
        { status: newStatus }
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
                  status: updatedReview.status,
                }
              };
            } else if (!book.review) {
              return {
                ...book,
                review: {
                  status: updatedReview.status,
                  id: updatedReview.id,
                  rating: updatedReview.rating,
                  notes: updatedReview.notes
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
    <Form.Control
      as="select"
      defaultValue={book.review?.status || ''}
      data-rating={book.review?.rating}
      onChange={(event) => updateStatus(book.id, event.target.value)}
      className="status-dropdown"
    >
      <option value="">Select Status</option>
      <option value="Read">Read</option>
      <option value="Unread">Unread</option>
      <option value="Reading">Reading</option>
    </Form.Control>
  );
}

export default StatusDropdown;
