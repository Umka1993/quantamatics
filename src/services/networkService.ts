import axios from 'axios'

export const network = {
    apiUrl() {
        return 'https://oauth.dev.quantamatics.net/'
    },
    headers() {
        const headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
        /*if (store.state.authentication.isAuthenticated) headers['Authorization'] = `Bearer ${this.token()}`*/

        return headers
    },
    get(url: string) {
        if (!url.startsWith('/')) {
            url = `/${url}`
        }
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.apiUrl()}${url}`, { headers: this.headers() })
                .then(this.handleStatusCode)
                .then((data) => {
                    resolve(data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    post(url: string, body: any, options?: any) {
        if (!url.startsWith('/')) {
            url = `/${url}`
        }
        return new Promise((resolve, reject) => {
            axios
                .post(`${this.apiUrl()}${url}`, body, options? options : { headers: this.headers() })
                .then(this.handleStatusCode)
                .then((data) => {
                    resolve(data)
                })
                .catch((err) => {
                    url.includes('oauth/token') ? reject(err.response.data.error_description) : reject(err)
                })
        })
    },
    put(url: string, body: any) {
        if (!url.startsWith('/')) {
            url = `/${url}`
        }
        return new Promise((resolve, reject) => {
            axios
                .put(`${this.apiUrl()}${url}`, body, { headers: this.headers() })
                .then(this.handleStatusCode)
                .then((data) => {
                    resolve(data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    handleStatusCode(res: any) {
        switch (res.status) {
            case 400:
                throw new Error('Bad Request')
            case 401:
                throw new Error('Unauthorized')
            case 404:
                throw new Error('Endpoint not found (404)')
            default:
                return res
        }
    }
}
