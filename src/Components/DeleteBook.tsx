import React from "react";
import './StarRating.css';
import { BookDTO, ReviewDto } from "./interfaces";
import axios from "axios";
import { AiFillDelete } from 'react-icons/ai';

interface BookProps {
  bookId: string;
  setSelectedBooks: React.Dispatch<React.SetStateAction<BookDTO[]>>;
}

const DeleteBook: React.FC<BookProps> = ({ bookId, setSelectedBooks }) => {
  const APPLICATION_URL = "https://booknest.azurewebsites.net/api/books";

  const deleteBookData = async (bookId: string) => {

    try {
      const url = `${APPLICATION_URL}/${bookId}`;
      const response = await axios.delete<ReviewDto>(
        url.trim()
      );
      if (response.status === 200) {
        setSelectedBooks((prevSelectedBooks) =>
          prevSelectedBooks.filter((book) => book.id !== bookId)
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <>
      <AiFillDelete className="delete-icon"
        onClick={() => deleteBookData(bookId)} size={30} />
    </>
  );
};

export default DeleteBook;
