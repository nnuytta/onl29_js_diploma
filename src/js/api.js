export const httpGET = (url) => {
    return fetch (url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error('Wrong url');
        }
    })
}

export const httpPOST = (url, body) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.json());
}