const BASE_URL = 'http://localhost:8000';


export const submitOrder = params => {
    return fetch(
        `${BASE_URL}/api/ride_orders/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(params)
        })
        .then((res) => res.json());
}