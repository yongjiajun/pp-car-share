import axios from 'axios'
import jwt_decode from 'jwt-decode'

const api_url = process.env.server_url || "http://localhost:3001/api/users"

export const TOKEN_SESSION_ATTRIBUTE_NAME = 'token'
export const TOKEN_HEADER_LENGTH = 7

class UserServiceApi {
    getAllUsers() {
        return axios.get(api_url)
    }

    getAllCustomers() {
        return axios.get(api_url+'/customers', { headers: { authorization: this.getUserToken() } })
    }

    getUserFromId(id) {
        return axios.get(`${api_url}/${id}`, { headers: { authorization: this.getUserToken() } })
    }

    checkEmailExists(email) {
        return axios.post(`${api_url}/email`, email);
    }

    createNewUser(newUser) {
        return axios.post(api_url, newUser)
    }

    loginUser(creds) {
        return axios.post(`${api_url}/login`, creds)
    }

    updateUser(user) {
        return axios.patch(`${api_url}/${user._id}`, user);
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

    isUserStaff() {
        let user = this.getLoggedInUserDetails()
        if(user.usertype === "admin" || user.usertype === "staff") {
            return true
        }
        return false
    }

    isUserAdmin() {
        let user = this.getLoggedInUserDetails()
        if(user.usertype === "admin") {
            return true
        }
        return false
    }

    logout() {
        sessionStorage.removeItem(TOKEN_SESSION_ATTRIBUTE_NAME);
        window.location.href = `/`;
    }
}

export default new UserServiceApi()