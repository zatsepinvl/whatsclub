const BASE_URL = "http://localhost:3001";

class ApiRequestError extends Error {
    constructor(httpCode, error) {
        super(error.message);
        this.httpCode = httpCode;
        this.errorCode = error.code;
    }
}

class ApiClient {

    async get(path, token) {
        return this._jsonRequest({path, token, method: "GET"})
    }

    async postPublic(path, body) {
        return this._jsonRequest({path, body, method: "POST"})
    }

    async post(path, token, body) {
        return this._jsonRequest({path, body, token, method: "POST"})
    }

    async put(path, token, body) {
        return this._jsonRequest({path, body, token, method: "PUT"})
    }

    async _jsonRequest({path, body, token, method}) {
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
        const response = await fetch(BASE_URL + path, init);
        if (!response.ok) {
            const error = await response.json();
            throw new ApiRequestError(response.status, error);
        }
        return response.json();
    }
}

export default ApiClient;