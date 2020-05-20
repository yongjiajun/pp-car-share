import axios from 'axios'
require('dotenv').config();
const api_url = process.env.server_url || "http://localhost:3001/api/cars"

class BookingServiceApi {
    searchAvailableCars(search) {
        return axios.post(api_url + '/availability', search);
    }

    filterCars(filter) {
        return axios.post(api_url + '/filter', filter);
    }
}

export default new BookingServiceApi()