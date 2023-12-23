import {useEffect, useState} from 'react';
import axios from 'axios';

/**
 * This hook gets data from the external GOT Api
 */
export default function useGOTApi(URL) {
    const [data, setData] = useState();
    const [isLoaded, setIsloaded] = useState(false);

    useEffect(() => {
        async function loadData() {
            let response;
            let allData = [];
            let page = 1;
            try {
                response = await axios.get(URL);

                while (true) {
                    let GOTURL = `${URL}?page=${page}&pageSize=50`;
                    response = await axios.get(GOTURL);
                    if (response.data.length <= 0) break;
                    allData = [...allData, ...response.data]; //should be 2138 charcters but 2134 loaded
                    page++;
                }
            } catch (error) {
                console.log('error getting data from API');
            }
            setData(allData);
            setIsloaded(true);
        }
        loadData();
    }, []);

    return [data, isLoaded];
}
