function getIdFromURL(url) {
    let charidArr = url.split('/');
    return charidArr[charidArr.length - 1];
}

export {getIdFromURL};
