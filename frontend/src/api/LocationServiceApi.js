import axios from 'axios'
require('dotenv').config();
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

    getGeocodeFromAddress(address) {
        const url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        const api_key = process.env.REACT_APP_API_KEY;
        const formatted_address = address.replace(/ /g, "+");
        const key_input = "&key="
        return axios.get(`${url + formatted_address + key_input + api_key}`);
    }

}

export default new LocationServiceApi()