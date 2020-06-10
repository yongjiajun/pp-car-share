import axios from 'axios'
import UserServiceApi from './UserServiceApi';
require('dotenv').config();
const api_url = "http://localhost:3001/api/bookings"

class BookingServiceApi {

    getNextBooking() {
        return axios.get(`${api_url}/customers/next`, { headers: { authorization: UserServiceApi.getUserToken() } });
    }

    createBooking(booking) {
        return axios.post(api_url, booking);
    }
    
    getUserBookings() {
        return axios.get(api_url, { headers: { authorization: UserServiceApi.getUserToken() } });
    }

    getUserBooking(bookingId) {
        return axios.get(`${api_url}/customers/${bookingId}`, { headers: { authorization: UserServiceApi.getUserToken() } })
    }

    modifyBooking(booking) {
        return axios.patch(`${api_url}/customers/${booking.id}`, booking);
    }

    getAllBookings() {
        return axios.get(`${api_url}/customers/all`, { headers: { authorization: UserServiceApi.getUserToken() } });
    }

    getBooking(bookingId) {
        return axios.get(`${api_url}/${bookingId}`, { headers: { authorization: UserServiceApi.getUserToken() } })
    }
}

export default new BookingServiceApi()