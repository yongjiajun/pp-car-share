import axios from 'axios'
import jwt_decode from 'jwt-decode'

const api_url = process.env.server_url || "http://localhost:3001/api/users"

export const TOKEN_SESSION_ATTRIBUTE_NAME = 'token'
export const TOKEN_HEADER_LENGTH = 7

class UserServiceApi {
    getAllUsers() {
        return axios.get(api_url)
    }

    getUserFromId(id) {
        return axios.get(`${api_url}/${id}`)
    }

    createNewUser(newUser) {
        return axios.post(api_url, newUser)
    }

    loginUser(creds) {
        return axios.post(`${api_url}/login`, creds)
    }

    registerSuccessfulLoginForJwt(token) {
        sessionStorage.setItem(TOKEN_SESSION_ATTRIBUTE_NAME, token)
        this.setupAxiosInterceptors(token)
    }

    getLoggedInUserID() {
        let token = sessionStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME)
        if (token === null) return ''
        return jwt_decode(token.slice(TOKEN_HEADER_LENGTH)).id
    }

    getLoggedInUserDetails() {
        let token = sessionStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME)
        if (token === null) return ''
        return jwt_decode(token.slice(TOKEN_HEADER_LENGTH))
    }

    getUserToken() {
        let token = sessionStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME)
        if (token === null) return ''
        return token.slice(TOKEN_HEADER_LENGTH)
    }

    setupAxiosInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                    console.log(token);
                }
                return config
            }
        )
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME)
        if (user === null){
            return false
        } 
        return true
    }

    logout() {
        sessionStorage.removeItem(TOKEN_SESSION_ATTRIBUTE_NAME);
        window.location.href = `/`;
    }
}

export default new UserServiceApi()