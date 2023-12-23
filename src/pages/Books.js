import React, {useState, useContext} from 'react';

import BookCard from '../components/books/BookCard.js';
import GOTContext from '../auth/GOTContext.js';

import '../styles/Books.css';

/**
 * Displays a list of books with the dropdown option to select a single book
 */
const Books = () => {
    const {booksArray, booksLoaded} = useContext(GOTContext);
    const [bookSelection, setBookSelection] = useState('Select a Book');

    if (!booksLoaded) return <p>Loading...</p>;

    //Dropdown options
    let bookNames = booksArray.map(book => {
        return (
            <option key={book.isbn} value={book.name}>
                {book.name}
            </option>
        );
    });

    // Get filtered book(s) based on select
    let filteredBooks = [...booksArray];

    if (bookSelection !== 'Select a Book') {
        filteredBooks = filteredBooks.filter(
            book => book.name === bookSelection
        );
    }

    let bookCards = filteredBooks.map(book => {
        return <BookCard key={book.isbn} book={book} />;
    });

    /**
     *   On Change it sets the book selection to the targetted selection
     */
    function handleChange(e) {
        setBookSelection(e.target.value);
    }

    return (
        <div className="Books">
            <h1 className="Books-title">Books</h1>
            <div className="Books-dropdown">
                <select
                    name="book-dropdown"
                    id="book-dropdown"
                    defaultValue={bookSelection} // Determines what is selected
                    onChange={handleChange}
                >
                    <option>Select a Book</option>
                    {bookNames}
                </select>
            </div>
            <div className="Books-cards">{bookCards}</div>
        </div>
    );
};
export default Books;
