import axios from 'axios'
require('dotenv').config();
const api_url = process.env.server_url || "http://localhost:3001/api/cars"

class CarServiceApi {
    createNewCar(newCar) {
        return axios.post(api_url, newCar)
    }
}

export default new CarServiceApi()
