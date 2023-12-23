import {useNavigate, useParams} from 'react-router-dom';
import React, {useContext, useEffect, useState} from 'react';

import Api from '../modules/Api.js';
import GOTContext from '../auth/GOTContext.js';
import AuthContext from '../auth/AuthContext.js';
import {getIdFromURL} from '../utils/utils.js';

import '../styles/BookDetails.css';

const BASE_URL = 'https://anapioficeandfire.com/api/books';

/**
 * Lists the details of a specific book and the list of characters that appear in the book
 */
const BookDetails = () => {
    // Set initial state
    const {booksArray, booksLoaded, charactersArray, charactersLoaded} =
        useContext(GOTContext);
    const [, currentUser] = useContext(AuthContext);
    const [bookObj, setBookObj] = useState();
    const [bookCharArr, setBookCharArr] = useState();
    const [isSelectedBookLoaded, setIsSelectedBookLoaded] = useState(false);
    const [isCharLoaded, setIsCharLoaded] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    const api = new Api();

    // Populate the selected book and characters after the external API has finished loading
    useEffect(() => {
        loadSelectedBook();
        loadBookCharacters();
    }, [booksLoaded, isSelectedBookLoaded, charactersLoaded]);

    /**
     * Load book details based on selection or URL input
     */
    function loadSelectedBook() {
        if (booksLoaded) {
            let selectedBook = booksArray.filter(
                book => book.url === `${BASE_URL}/${params.bookid}`
            );

            if (selectedBook.length <= 0) {
                navigate(`/`);
            }

            setBookObj(selectedBook[0]);
            setIsSelectedBookLoaded(true);
        }
    }

    /**
     * Filter out and load characters related to the selected book
     */
    function loadBookCharacters() {
        if (isSelectedBookLoaded && charactersLoaded) {
            let chars = getBookCharacters(bookObj, charactersArray);

            //save character names
            setBookCharArr(filterCharNames(chars));
            setIsCharLoaded(true);
        }
    }

    /**
     * Filtered characters based on a book for book details page
     */
    function getBookCharacters(bObj, cArray) {
        let filteredChars = [];
        bObj.characters.forEach(charURL => {
            let filteredBookbookCharArr = cArray.filter(
                char => charURL === char.url
            );
            filteredChars = [...filteredChars, ...filteredBookbookCharArr];
        });
        return filteredChars;
    }

    /**
     * Filtered character names based on a book for book details page
     */
    function filterCharNames(charsArr) {
        //get favorite characters from Api
        let favChars = api.getFavorites(currentUser, api.favTypes.characters);

        //loop through all characters for this book
        let listCharNames = charsArr.map(char => {
            let validName = char.name === '' ? 'Unknown Character' : char.name;

            // get charid from URL
            let charid = getIdFromURL(char.url);

            //check if this character is a favorite
            let isFav = favChars.filter(cid => cid === charid).length > 0;

            return (
                <option key={charid} value={charid} onClick={handleClick}>
                    {validName}
                    {isFav ? '❤️' : ''}
                </option>
            );
        });
        return listCharNames;
    }

    // Api loading validation
    if (!booksLoaded || !isSelectedBookLoaded)
        return <h1 className="BookDetails">Loading...</h1>;

    // load authors after the bookObj is loaded
    let bookAuthors = bookObj.authors.map(author => {
        return <p key={author}>{author}</p>; //TODO: how to set key here?
    });

    /**
     * When the event is triggered navigates to the selected character
     */
    function handleClick(e) {
        e.preventDefault();
        navigate(`/characters/${e.target.value}`);
    }

    return (
        <div className="BookDetails-wrapper">
            <h1 className="BookDetails-title">{bookObj.name}</h1>
            <div className="BookDetails">
                <div className="BookDetails-lc">
                    <p>
                        <span className="BookDetails-title">Title:</span>
                        {bookObj.name}
                    </p>
                    <p>
                        <span className="BookDetails-title">ISBN: </span>
                        {bookObj.isbn}
                    </p>
                    <p>
                        <span className="BookDetails-title">Publisher: </span>
                        {bookObj.publisher}
                    </p>
                    <p>
                        <span className="BookDetails-title">
                            Number of Pages:
                        </span>
                        {bookObj.numberOfPages}
                    </p>
                    <p>
                        <span className="BookDetails-title">Country: </span>
                        {bookObj.country}
                    </p>
                    <p>
                        <span className="BookDetails-title">Media Type: </span>
                        {bookObj.mediaType}
                    </p>
                    <p>
                        <span className="BookDetails-title">Released: </span>
                        {bookObj.released}
                    </p>
                    <div>
                        <span className="BookDetails-title">Authors:</span>
                        <div className="BookDetails-author">{bookAuthors}</div>
                    </div>
                </div>
                <div className="BookDetails-rc">
                    <h4>Characters</h4>
                    {!isCharLoaded ? (
                        'Loading...'
                    ) : (
                        <select name="chars" size="20" multiple="multiple">
                            {bookCharArr}
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
};
export default BookDetails;
