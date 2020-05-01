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

    getGeocodeFromAddress(address) {
        const url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        const api_key = "&key=AIzaSyCw4AB0ysQbI33KWKGEuLCuORtcgoFT8U4"
        const formatted_address = address.replace(/ /g, "+");
        return axios.get(`${url + formatted_address + api_key}`);
    }

}

export default new LocationServiceApi()