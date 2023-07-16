import React, { useState } from "react";
import './StarRating.css';
import { BookDTO, ReviewDto } from "./interfaces";
import axios from "axios";
import { RiStickyNoteLine } from 'react-icons/ri';
import NotesModal from './NotesModal';

interface BookProps {
    book: BookDTO;
    setSelectedBooks: React.Dispatch<React.SetStateAction<BookDTO[]>>;
}

const Note: React.FC<BookProps> = ({ book, setSelectedBooks }) => {
    const APPLICATION_URL = "https://booknest.azurewebsites.net/api/books";
    const [showModal, setShowModal] = useState(false);
    const [notes, setNotes] = useState<{ [id: string]: string }>({});
    const [selectedBookId, setSelectedBookId] = useState('');


    const handleAddNote = (id: string) => {
        setSelectedBookId(id);
        if (book && book.review) {
            const { notes } = book.review;
            setNotes((prevNotes) => {
                const newNotes = Object.assign({}, prevNotes);
                newNotes[id] = notes;
                return newNotes;
            });
        }
        setShowModal(true);
    };

    const updateNotes = async (bookId: string, newNotes: string) => {

        try {
            const url = `${APPLICATION_URL}/review/${bookId}`;
            const response = await axios.put<ReviewDto>(
                url.trim(),
                { notes: newNotes }
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
                                    notes: updatedReview.notes,
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
        <>
            <RiStickyNoteLine className="notes-icon"
                onClick={() => handleAddNote(book.id)} size={30} />

            <NotesModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={() => {
                    updateNotes(selectedBookId, notes[selectedBookId] || '');
                    setShowModal(false);
                }}
                value={notes[selectedBookId] || ''}
                onChange={(value) => setNotes({ ...notes, [selectedBookId]: value })}
                title="Add Notes"
            />
        </>
    );
};

export default Note;
