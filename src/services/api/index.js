const BASE_URL = '/';


export const submitOrder = params => {
    let csrftoken = document.head.querySelector("[name='csrf-token']").content;
    let headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return fetch(
        `${BASE_URL}api/ride_orders/`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(params)
        })
        .then((res) => res.json());
}

export const updateOrder = params => {
    let csrftoken = document.head.querySelector("[name='csrf-token']").content;
    let headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', 'application/json; charset=utf-8');

    return fetch(
        `${BASE_URL}api/ride_orders/${params.id}`, {
            method: "PUT",
            headers: headers,
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

export const deleteIssue = id => {
    let csrftoken = document.head.querySelector("[name='csrf-token']").content;
    let headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', "application/x-www-form-urlencoded");

    return fetch(
        `${BASE_URL}api/issues/${id}/`, {
            method: "DELETE",
            headers: headers,
            credentials: 'include'
        });
}

export const getAllOrders = () => {
    return fetch(`${BASE_URL}api/ride_orders/`).then((res) => res.json());
}

export const getAllIssues = () => {
    return fetch(`${BASE_URL}api/issues/`).then((res) => res.json());
}

export const getLatestOrder = () => {
    return fetch(`${BASE_URL}api/ride_order/latest`).then((res) => res.json());
}

export const getOrderById = id => {
    return fetch(`${BASE_URL}api/ride_orders/${id}`).then((res) => res.json());
}

export const getAllUsers = () => fetch(`${BASE_URL}api/users/`).then((res) => res.json());
export const getUserById = id => fetch(`${BASE_URL}api/users/${id}`).then((res) => res.json());
export const saveUser = params => {
    let csrftoken = document.head.querySelector("[name='csrf-token']").content;
    let headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', 'application/json; charset=utf-8');

    return fetch(
        `${BASE_URL}api/users/${params.id || ''}`, {
            method: `${params.id ? 'PUT' : 'POST'}`,
            headers: headers,
            body: JSON.stringify(params)
        });
}

export const deleteUser = id => {
    let csrftoken = document.head.querySelector("[name='csrf-token']").content;
    let headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', "application/x-www-form-urlencoded");

    return fetch(
        `${BASE_URL}api/users/${id}/`, {
            method: "DELETE",
            headers: headers,
            credentials: 'include'
        });
}
