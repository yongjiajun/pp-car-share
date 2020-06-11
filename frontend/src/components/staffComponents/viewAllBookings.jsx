import React , { Component } from 'react';
import { Alert, Button, Table, Container } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
const { default: LocationServiceApi } = require("../../api/LocationServiceApi")
const { default: CarServiceApi } = require("../../api/CarServiceApi")

export default class ViewAllBookingsPage extends Component {
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
        BookingServiceApi.getAllBookings().then(res => {
            this.setState({
                bookings: res.data.bookings.reverse()
            })
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        })
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

    render() {
        return (
            <Container>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error fetching all bookings!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <h2>View All Bookings</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Booked Time</th>
                            <th>Pickup Time</th>
                            <th>Return Time</th>
                            <th>Car ID</th>
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
                                <td>{booking.user}</td>
                                <td>{booking.bookedtime}</td>
                                <td>{booking.pickuptime}</td>
                                <td>{booking.returntime}</td>
                                <td>{booking.car}</td>
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
                                    <Button href={`/admin/view/bookings/${booking.id}`}>View</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
        )
    }
}