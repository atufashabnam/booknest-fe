import { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import { BookDTO, Book } from './interfaces';
import { AiOutlineSearch } from 'react-icons/ai';
import './Books.css';

function Books(): JSX.Element {
  const APPLICATION_URL = "https://booknest.azurewebsites.net/api/books";
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<BookDTO[]>([]);
  const [dropDownMenu, setDropDownMenu] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios
          .get(APPLICATION_URL,
            {
              headers: {
                "Content-Type": "application/json"
              }
            });
        if (response.data && response.data) {
          setSelectedBooks(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, []);

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    try {
      const response = await axios.get<{ items: Book[] }>(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyCOHP9K6XpLSz_fAhg5jXZfylBnvTcd2AQ`
      );
      setBooks(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropDownChange = () => {
    setDropDownMenu(true);
  };

  const addBookToMain = async (book: Book) => {
    setDropDownMenu(false);
    const requestObj: BookDTO = {
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors[0],
      categories: book.volumeInfo.categories?.[0] ?? '',
      imageLinks: book.volumeInfo.imageLinks?.thumbnail ?? '',
      description: book.volumeInfo.description?.substring(0,200) ?? '',
    }

    try {
      const response = await axios.post<BookDTO>(APPLICATION_URL, requestObj);
      if (response.status === 201) {
        const savedBook = response.data;
        setSelectedBooks((prevSelectedBooks) => [...prevSelectedBooks, savedBook]);
        setQuery('');
      } else {
        console.error('Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <div>
      <div>
        <nav className='header'>
          <h1>Book Nest</h1>
        </nav>
        <div className="search-container">
          <span className="search-span"> <AiOutlineSearch />Search</span>
          <input
            type="text"
            value={query}
            onFocus={handleDropDownChange}
            onChange={handleSearch}
            className="search-input"
            placeholder="Search for books"
          />
          {dropDownMenu && (
            <div className="search-dropdown">
              {books.map((book) => (
                <div key={book.id} className="search-result">
                  <span className="title">{book.volumeInfo.title}</span>
                  {book.volumeInfo.authors && (
                    <p className="authors">Author(s): {book.volumeInfo.authors.join(', ')}</p>
                  )}
                  <button onClick={() => addBookToMain(book)} className="add-button">Add</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="container">
    {selectedBooks.map((book) => (
      <div  key={book.id} className="box">
        <BookCard book={book} setSelectedBooks={setSelectedBooks} />
      </div>
    ))}
  </div>
    </div>
  );
}

export default Books;
