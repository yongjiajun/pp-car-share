import axios from 'axios'
require('dotenv').config();
const api_url = process.env.server_url || "http://localhost:3001/api/cars"

class CarServiceApi {
    createNewCar(newCar) {
        return axios.post(api_url, newCar)
    }

    getAllCars() {
        return axios.get(api_url);
    }

    searchAvailableCars(search) {
        return axios.post(api_url + '/availability', search);
    }

    filterCars(filter) {
        return axios.post(api_url + '/filter', filter);
    }

}

export default new CarServiceApi()
