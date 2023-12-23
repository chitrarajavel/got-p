import React, {useState, useEffect, useContext, useRef} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';

import GOTContext from '../auth/GOTContext.js';
import AuthContext from '../auth/AuthContext.js';
import Api from '../modules/Api.js';
import {getIdFromURL} from '../utils/utils.js';

import Female from '../assets/images/Female.png';
import Male from '../assets/images/Male.png';
import PlainHeart from '../assets/images/PlainHeart.png'; //Source: https://www.flaticon.com/authors/freepik
import RedHeart from '../assets/images/RedHeart.png'; //Source: https://www.flaticon.com/authors/kiranshastry

import '../styles/CharacterDetails.css';

/**
 * Lists the details of a specific character and the list of books character appears in
 */
const CharacterDetails = () => {
    const {booksArray, booksLoaded, charactersArray, charactersLoaded} =
        useContext(GOTContext);
    const [isAuthenticated, currentUser] = useContext(AuthContext);
    const [isCharLoaded, setIsCharLoaded] = useState(false);
    const [isBookLoaded, setIsBookLoaded] = useState(false);
    const [charLookUpObj, setCharLookUpObj] = useState({});
    const [isFavorited, setIsFavorited] = useState(false);
    let maxId = useRef(0);

    let params = useParams();
    let navigate = useNavigate();
    const api = new Api();

    // Populate the selected charcter and books after the external API has finished loading
    useEffect(() => {
        if (charactersLoaded) {
            createCharLookUpObj(charactersArray);
            setIsCharLoaded(true);

            // On load check if the character is favorited
            let isFav = api.isFavorited(
                currentUser,
                params.charid,
                api.favTypes.characters
            );
            setIsFavorited(isFav);
        }
        if (charactersLoaded && booksLoaded) {
            setIsBookLoaded(true);
        }
    }, [charactersLoaded, booksLoaded]);

    /**
     * Converts an array of character objects to an object that contains charid(s) as keys and corresponding character objects
     * as values for a faster lookup
     * [{},{}] to {key: {}, key: {}}
     */
    function createCharLookUpObj(charArr) {
        let cObj = {};

        charArr.forEach(charObj => {
            let charid = getIdFromURL(charObj.url);
            cObj[charid] = charObj;
            maxId.current =
                Number(charid) > maxId.current ? Number(charid) : maxId.current;
        });

        setCharLookUpObj(cObj);
    }

    /**
     * Given a list of book URLs, it returns a filtered list of book objects for this character
     */
    function getCharBooks(charBookURLArr, allBookArr) {
        let bArray = [];
        charBookURLArr.forEach(bookURL => {
            let bookObj = allBookArr.filter(book => {
                return bookURL === book.url;
            });
            bArray.push(bookObj[0]);
        });
        return bArray;
    }

    if (!isCharLoaded) return <p>Loading...</p>;

    // Param validation - validate the id that is passed in through URL
    if (
        isNaN(params.charid) ||
        Number(params.charid) > maxId.current ||
        Number(params.charid) <= 0
    ) {
        navigate(`/`);
        return;
    }

    // Gets character objects based on charid
    let charObj = charLookUpObj[params.charid];
    let fatherObj = charLookUpObj[getIdFromURL(charObj.father)];
    let motherObj = charLookUpObj[getIdFromURL(charObj.mother)];
    let spouseObj = charLookUpObj[getIdFromURL(charObj.spouse)];

    // Load Character Books
    let charBooks = getCharBooks(charObj.books, booksArray);

    let bookList = charBooks.map(book => {
        let bookid = getIdFromURL(book.url);
        return (
            <Link to={`/books/${bookid}`} className="Link-Style" key={book.url}>
                {book.name}
            </Link>
        );
    });

    let validName = charObj.name === '' ? 'Unknown Character' : charObj.name;

    let validImg = charObj.gender === 'Male' ? Male : Female;

    /**
     * Add favorites user{ favorites: []}
     */
    function toggleFavorite() {
        if (!isAuthenticated) return;

        if (isFavorited) {
            api.deleteFavorite(
                currentUser,
                params.charid,
                api.favTypes.characters
            );
            setIsFavorited(false);
        } else {
            api.addFavorite(
                currentUser,
                params.charid,
                api.favTypes.characters
            );
            setIsFavorited(true);
        }
    }

    return (
        <div className="CharacterDetails-wrapper">
            <div className="CharacterDetails-fav-img-c">
                <h1>{validName}</h1>
                <img
                    width="40px"
                    height="40px"
                    src={isFavorited ? RedHeart : PlainHeart}
                    onClick={toggleFavorite}
                />
            </div>
            <div className="CharacterDetails">
                <div className="CharacterDetails-lc">
                    <div className="CharacterDetails-img-container">
                        <img className="CharacterDetails-img" src={validImg} />
                    </div>
                    <p>
                        <span className="CharacterDetails-title">Name:</span>
                        {validName}
                    </p>
                    <p>
                        <span className="CharacterDetails-title">Gender:</span>
                        {charObj.gender}
                    </p>
                    <p>
                        <span className="CharacterDetails-title">Born:</span>
                        {charObj.born}
                    </p>
                    <p>
                        <span className="CharacterDetails-title">Died:</span>
                        {charObj.died}
                    </p>
                    <p>
                        <span className="CharacterDetails-title">Father:</span>
                        {fatherObj?.name}
                    </p>
                    <p>
                        <span className="CharacterDetails-title">Mother:</span>
                        {motherObj?.name}
                    </p>
                    <p>
                        <span className="CharacterDetails-title">Spouse:</span>
                        {spouseObj?.name}
                    </p>
                </div>
                <div className="CharacterDetails-rc">
                    <h4>Appears in the following books:</h4>
                    {!isBookLoaded ? (
                        'Loading...'
                    ) : (
                        <div className="BookList-container">{bookList}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CharacterDetails;
