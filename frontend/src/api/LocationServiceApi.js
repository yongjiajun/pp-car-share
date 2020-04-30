import axios from 'axios'

const api_url = process.env.server_url || "http://localhost:3001/api/locations"

class LocationServiceApi {
    getAllLocations() {
        return axios.get(api_url)
    }

    getLocationFromId(id) {
        return axios.get(`${api_url}/${id}`)
    }

    createNewLocation(newLocation) {
        return axios.post(api_url, newLocation)
    }

}

export default new LocationServiceApi()