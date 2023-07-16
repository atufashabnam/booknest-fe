// BookCard.tsx
import React, { useState } from 'react';
import StarRating from './StarRating';
import './BookCard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import StatusDropdown from './StatusDropdown';
import { BookDTO } from './interfaces';
import DeleteBook from './DeleteBook';
import Note from './Note';

interface BookCardProps {
  book: BookDTO;
  setSelectedBooks: React.Dispatch<React.SetStateAction<BookDTO[]>>;
}

const BookCard: React.FC<BookCardProps> = ({ book, setSelectedBooks }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className='book-card'>
      <div className="book-card-container">
        <div className={`book ${isFlipped ? 'flipped' : ''}`} >
          <div className="book-details">
            <h3 className='book-title'>{book.title}</h3>
            <p>{book.authors}</p>
            <img src={book.imageLinks} alt={book.title} onClick={handleCardClick}/>
            <StarRating
              bookId={book.id}
              setSelectedBooks={setSelectedBooks}
              starRating={book.review ? book.review.rating : 0}
            />
            <StatusDropdown book={book} setSelectedBooks={setSelectedBooks} />
            <div>
              <Note book={book} setSelectedBooks={setSelectedBooks} />
              <DeleteBook bookId={book.id} setSelectedBooks={setSelectedBooks} />
            </div>
          </div>
          <div className="book-back" onClick={handleCardClick}>
            <p className='book-description'>{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
