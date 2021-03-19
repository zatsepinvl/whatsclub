const BASE_URL = "http://localhost:3001";

class ApiClient {

    get(path, token) {
        return this._jsonRequest({path, token, method: "GET"})
    }

    postPublic(path, body) {
        return this._jsonRequest({path, body, method: "POST"})
    }

    post(path, token, body) {
        return this._jsonRequest({path, body, token, method: "POST"})
    }

    put(path, token, body) {
        return this._jsonRequest({path, body, token, method: "PUT"})
    }

    _jsonRequest({path, body, token, method}) {
        const init = {
            method: method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        };
        if (body) {
            init.body = JSON.stringify(body);
        }
        if (token) {
            init.headers["Authorization"] = "Bearer " + token
        }
        return fetch(BASE_URL + path, init)
            .catch(console.error)
            .then(res => res.json());
    }
}

export default ApiClient;