import axios from 'axios'
import UserServiceApi from './UserServiceApi';
require('dotenv').config();
const api_url = "http://localhost:3001/api/bookings"

class BookingServiceApi {
    createBooking(booking) {
        return axios.post(api_url, booking);
    }

    getUserBookings() {
        return axios.get(api_url, { headers: { authorization: UserServiceApi.getUserToken() } });
    }

    modifyBooking(booking) {
        return axios.patch(`${api_url}/customer/${booking.id}`, booking);
    }
}

export default new BookingServiceApi()