/**
 * Splits URL and returns the last value of the array that contains the id needed
 */
function getIdFromURL(url) {
    let urlArr = url.split('/');
    return urlArr[urlArr.length - 1];
}

export {getIdFromURL};
