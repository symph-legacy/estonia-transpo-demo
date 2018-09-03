import querystring from 'querystring';
// import dotenv from 'dotenv';

// dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GMAP_BASE_URL = 'https://maps.googleapis.com'

export const getAddressByLatLng = latlng => {
    let params = {
        key: GOOGLE_API_KEY,
        latlng: `${latlng.lat},${latlng.lng}`,
    };

    let qs = querystring.stringify(params);
    return fetch(
        `${GMAP_BASE_URL}/maps/api/geocode/json?${qs}`)
        .then((res) => res.json())
        .then((json) => {
            if (json.status !== 'OK') {
                throw new Error(`Geocode error: ${json.status}`);
            }
            return json;
        });
}