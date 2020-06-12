import React, { Component } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
const { default: LocationServiceApi } = require("../../api/LocationServiceApi")
const { default: CarServiceApi } = require("../../api/CarServiceApi")

export default class ViewCustomerBookingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            locations: [],
            cars: [],
            errorMessage: ''
        }
    }

    componentDidMount() {
        BookingServiceApi.getUserBookings(this.props.match.params.id).then(res => {
            this.setState({
                bookings: res.data.bookings.reverse()
            })
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        })
        LocationServiceApi.getAllLocations()
            .then(res => {
                let locationArray = this.state.locations;
                res.data.forEach(location => {
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

    render() {
        return (
            <div className="container">
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error fetching customer's bookings!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <h2>Bookings for Customer {this.props.match.params.id}</h2>
                <Button href={`/admin/view/customers/${this.props.match.params.id}`}>View Customer Profile</Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Booked Time</th>
                            <th>Pickup Time</th>
                            <th>Return Time</th>
                            <th>Car</th>
                            <th>Cost</th>
                            <th>Location</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.bookings.map(booking =>
                            <tr>
                                <td>{booking.id}</td>
                                <td>{booking.bookedtime}</td>
                                <td>{booking.pickuptime}</td>
                                <td>{booking.returntime}</td>
                                <td>
                                    {this.state.cars.map(car =>
                                        <>
                                            {car.id === booking.car &&
                                                <>
                                                    <a href={`/admin/view/cars/${booking.car}`}>{car.make}</a>
                                                </>
                                            }
                                        </>
                                    )}
                                </td>
                                <td>${booking.cost}</td>
                                <td>
                                    {this.state.locations.map(location =>
                                        <>
                                            {location.id === booking.location &&
                                                <>
                                                    <a href={`/admin/view/location/${booking.location}`}>{location.name}</a>
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
                                    <Button href={`/admin/view/bookings/${booking.id}`}>View</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}