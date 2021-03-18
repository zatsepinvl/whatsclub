const BASE_URL = "http://localhost:3001";

class ApiClient {
    get(path, token) {
        return fetch(BASE_URL + path, {
                headers: {
                    "Authorization": "Bearer " + token
                },
            }
        )
            .catch(console.error)
            .then(res => res.json())
    }

    post(path, body, token) {
        return fetch(BASE_URL + path, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(body)
            }
        )
            .catch(console.error)
            .then(res => res.json());
    }
}

export default ApiClient;