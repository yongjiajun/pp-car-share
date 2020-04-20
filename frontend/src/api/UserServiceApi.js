import axios from 'axios'

const api_url = process.env.server_url || "http://localhost:3001/api/users"

class UserServiceApi {
    getAllUsers() {
        return axios.get(api_url)
    }

    getUserFromId(id) {
        return axios.get(`$(api_url)/$(id)`)
    }

    createNewUser(newUser) {
        return axios.post(api_url, newUser)
    }
}

export default new UserServiceApi()