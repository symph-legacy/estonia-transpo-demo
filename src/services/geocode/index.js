import queryString from 'query-string';

export const getAddressByLatLng = latlng => {
    let params = {
        key: 'AIzaSyDbESyZ10IaxgVmjcMBDN2WlGzSEu9vzMM',
        latlng: `${latlng.lat},${latlng.lng}`,
    };

    let qs = queryString.stringify(params);
    return fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?${qs}`)
        .then((res) => res.json())
        .then((json) => {
            if (json.status !== 'OK') {
                throw new Error(`Geocode error: ${json.status}`);
            }
            return json;
        });
}

