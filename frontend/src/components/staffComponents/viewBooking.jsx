import React , { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
const { default: LocationServiceApi } = require("../../api/LocationServiceApi")
const { default: CarServiceApi } = require("../../api/CarServiceApi")

export default class ViewBookingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            booking: {},
            car: {},
            location: {},
            errorMessage: ''
        }
        this.handleCancelButton = this.handleCancelButton.bind(this);
    }

    getBookingDetails() {
        BookingServiceApi.getBooking(this.props.match.params.id)
            .then(res => {
                this.setState({
                    booking: res.data.booking
                })
                CarServiceApi.getCar(this.state.booking.car)
                    .then(res => {
                        this.setState({
                            car: res.data.car
                        })
                    })
                LocationServiceApi.getLocationFromId(this.state.booking.location)
                    .then(res => {
                        this.setState({
                            location: res.data
                        })
                    })
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            })
    }

    componentDidMount() {
        this.getBookingDetails()
    }

    handleCancelButton() {
        this.state.booking.status = 'Cancelled';
        this.state.booking.id = this.state.booking._id;
        BookingServiceApi.modifyBooking(this.state.booking)
            .then(() => {
                this.getBookingDetails()
            })
    }

    checkBookingPast(pickupTime) {
        let currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset())
        return new Date(pickupTime) > currentTime;
    }

    render() {
        return (
            <div className="container">
                <h2>Booking details for ID {this.state.booking._id}</h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error obtaining booking!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                {!this.state.errorMessage &&
                    <>
                        <b>Car ID: </b> {this.state.car._id} <br></br>
                        <b>Car Make: </b> {this.state.car.make} <br></br>
                        <b>Car Number Plate: </b> {this.state.car.numberplate} <br></br>
                        <b>Car Colour: </b> {this.state.car.colour} <br></br>
                        <b>Car Fuel Type: </b> {this.state.car.fueltype} <br></br>
                        <b>Car Seats: </b> {this.state.car.seats} <br></br>
                        <b>Car Body Type: </b> {this.state.car.bodytype} <br></br>
                        <b>Booking time: </b> {this.state.booking.bookedtime} <br></br>
                        <b>Pickup time: </b> {this.state.booking.pickuptime} <br></br>
                        <b>Return time: </b> {this.state.booking.returntime} <br></br>
                        <b>Cost: </b> ${this.state.booking.cost} <br></br>
                        <b>Location: </b> {this.state.location.name} <br></br>
                        <b>Address: </b> {this.state.location.address} <br></br>
                        <b>Status: </b> {this.state.booking.status} <br></br>
                        {(this.state.booking.status === "Confirmed" && this.checkBookingPast(this.state.booking.pickuptime)) &&
                            <Button variant="danger" onClick={this.handleCancelButton}>Cancel</Button>
                        }
                    </>
                }
            </div>
        )
    }
}