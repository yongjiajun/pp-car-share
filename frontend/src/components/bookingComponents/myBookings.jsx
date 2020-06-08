import React, { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import CarServiceApi from '../../api/CarServiceApi';

class MyBookingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            locations: [],
            cars: [],
            errorMessage: ''
        }
        this.handleCancelButton = this.handleCancelButton.bind(this);
        this.getUsersBookings = this.getUsersBookings.bind(this);
        this.checkBookingPast = this.checkBookingPast.bind(this);
    }

    componentDidMount() {
        this.getUsersBookings();
        LocationServiceApi.getAllLocations()
            .then(res => {
                let locationArray = this.state.locations;
                res.data.map(location => {
                    let locationObject = {
                        id: location._id,
                        address: location.address,
                        name: location.name
                    }
                    locationArray.push(locationObject);
                    this.setState({ locations: locationArray });
                })
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            })
        CarServiceApi.getAllCars()
            .then(res => {
                this.setState({
                    cars: res.data.cars
                })
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            })
    }

    getUsersBookings() {
        BookingServiceApi.getUserBookings()
            .then(res => {
                this.setState({
                    bookings: res.data.bookings.reverse()
                })
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            })
    }

    checkBookingPast(pickupTime) {
        let currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset())
        return new Date(pickupTime) > currentTime;
    }

    handleCancelButton(booking) {
        booking.status = 'Cancelled';
        BookingServiceApi.modifyBooking(booking)
            .then(() => {
                this.getUsersBookings();
            })
    }

    render() {
        return (
            <div className="container">
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error obtaining bookings!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <h2>My Bookings</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Car ID</th>
                            <th>Booked Time</th>
                            <th>Pickup Time</th>
                            <th>Return Time</th>
                            <th>Cost</th>
                            <th>Location</th>
                            <th>Address</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.bookings.map(booking =>
                            <tr>
                                <td>{booking.id}</td>
                                <td>{booking.car}</td>
                                <td>{booking.bookedtime}</td>
                                <td>{booking.pickuptime}</td>
                                <td>{booking.returntime}</td>
                                <td>${booking.cost}</td>
                                <td>
                                    {this.state.locations.map(location =>
                                        <>
                                            {location.id === booking.location &&
                                                <>
                                                    {location.name}
                                                </>
                                            }
                                        </>
                                    )}
                                </td>
                                <td>
                                    {this.state.locations.map(location =>
                                        <>
                                            {location.id === booking.location &&
                                                <>
                                                    {location.address}
                                                </>
                                            }
                                        </>
                                    )}
                                </td>
                                <td>{booking.status}</td>
                                <td>
                                    <Button href={`/mybookings/${booking.id}`}>View</Button>
                                </td>
                                <td>
                                    {(booking.status === "Confirmed" && this.checkBookingPast(booking.pickuptime)) && 
                                        <Button onClick={() => this.handleCancelButton(booking)}>Cancel</Button>
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default MyBookingPage;