const BASE_URL = '/';


export const submitOrder = params => {
    return fetch(
        `${BASE_URL}api/ride_orders/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(params)
        })
        .then((res) => res.json());
}

export const deleteOrder = id => {
    let csrftoken = document.head.querySelector("[name='csrf-token']").content;
    let headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', "application/x-www-form-urlencoded");

    return fetch(
        `${BASE_URL}api/ride_orders/${id}/`, {
            method: "DELETE",
            headers: headers,
            credentials: 'include'
        });
}

export const getAllOrders = () => {
    return fetch(`${BASE_URL}api/ride_orders/`).then((res) => res.json());
}

export const getLatestOrder = () => {
    return fetch(`${BASE_URL}api/ride_orders/latest`).then((res) => res.json());
}