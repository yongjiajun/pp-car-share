import axios from 'axios'
require('dotenv').config();
const car_api_url = process.env.server_url || "http://localhost:3001/api/cars"
const booking_api_url = "http://localhost:3001/api/bookings"

class BookingServiceApi {
    searchAvailableCars(search) {
        return axios.post(car_api_url + '/availability', search);
    }

    filterCars(filter) {
        return axios.post(car_api_url + '/filter', filter);
    }

    createBooking(booking) {
        return axios.post(booking_api_url, booking);
    }
}

export default new BookingServiceApi()