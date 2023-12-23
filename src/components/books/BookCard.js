import {useNavigate} from 'react-router-dom';

import bookImgs from '../../assets/utils/bookImages.js';

import '../../styles/BookCard.css';

/**
 *  This component returns the JSX card for Books.js
 */
export default function BookCard({book}) {
    let bookURLArr = book.url.split('/');
    let bookid = bookURLArr[bookURLArr.length - 1];
    const navigate = useNavigate();

    function handleClick(e) {
        e.preventDefault();
        navigate(`/books/${bookid}`);
    }

    return (
        <div className="BookCard card-style private-card appearAnimation">
            <div className="BookCard-img">
                <img
                    src={bookImgs[book.isbn]}
                    placeholder={book.name}
                    width="150px"
                    height="200px"
                />
            </div>
            <div className="BookCard-content">
                <p>Book Name: {book.name}</p>
                <p>Book ISBN: {book.isbn}</p>
                <p>Book Publisher: {book.publisher}</p>
                <p>Number of Pages: {book.numberOfPages}</p>
                <button onClick={handleClick}>View Details</button>
            </div>
        </div>
    );
}
