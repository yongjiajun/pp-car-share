import axios from 'axios'

const api_url = process.env.server_url || "http://localhost:3001/api/users"

export const USER_ID_SESSION_ATTRIBUTE_NAME = 'authenticatedUserID'
export const TOKEN_SESSION_ATTRIBUTE_NAME = 'userToken'

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

    registerSuccessfulLoginForJwt(userID, token) {
        sessionStorage.setItem(USER_ID_SESSION_ATTRIBUTE_NAME, userID)
        sessionStorage.setItem(TOKEN_SESSION_ATTRIBUTE_NAME, token)
        // this.setupAxiosInterceptors(this.createJWTToken(token))
    }

    getLoggedInUserID() {
        let userID = sessionStorage.getItem(USER_ID_SESSION_ATTRIBUTE_NAME)
        if (userID === null) return ''
        return userID
    }

    // setupAxiosInterceptors(token) {
    //     axios.interceptors.request.use(
    //         (config) => {
    //             if (this.isUserLoggedIn()) {
    //                 config.headers.authorization = token
    //                 console.log(token);
    //             }
    //             return config
    //         }
    //     )
    // }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(USER_ID_SESSION_ATTRIBUTE_NAME)
        if (user === null){
            return false
        } 
        return true
    }

    logout() {
        sessionStorage.removeItem(USER_ID_SESSION_ATTRIBUTE_NAME);
        sessionStorage.removeItem(TOKEN_SESSION_ATTRIBUTE_NAME);
    }
}

export default new UserServiceApi()