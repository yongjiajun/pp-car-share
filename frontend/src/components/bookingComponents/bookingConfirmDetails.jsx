import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
import UserServiceApi from '../../api/UserServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';

class BookingConfirmDetailsPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            location: {}
        }
        this.handleConfirmButton = this.handleConfirmButton.bind(this);
        this.handleCancelButton = this.handleCancelButton.bind(this);
    }

    handleConfirmButton = event => {
        event.preventDefault();
        let newBooking = {
            pickupTime: this.props.pickupTime,
            returnTime: this.props.returnTime,
            user: UserServiceApi.getLoggedInUserID(),
            car: this.props.car._id,
            location: this.props.car.location,
        }
        BookingServiceApi.createBooking(newBooking)
            .then(res => {
                window.location.href = `/mybookings/${res.data.response.booking._id}`;
            })
            .catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            })
    }

    handleCancelButton = event => {
        event.preventDefault();
        this.props.togglePopUp();
    }

    calculateBookingCost() {
        // cost calculation
        const pickupTimeHours = new Date(this.props.pickupTime);
        const returnTimeHours = new Date(this.props.returnTime);
        const timeDeltaHours = new Date(returnTimeHours - pickupTimeHours).getTime() / 3600;

        const cost = parseInt(this.props.car.costperhour) * (timeDeltaHours / 1000);
        return cost.toFixed(2);
    }

    render() {
        const { locations, car, pickupTime, returnTime } = this.props;
        const cost = this.calculateBookingCost();

        return (<div className="container">
            {this.state.errorMessage && <Alert variant="danger">
                <Alert.Heading>Booking failed!</Alert.Heading>
                <p>
                    {this.state.errorMessage}
                </p>
            </Alert>}
            <h2>Confirm Booking?</h2>
            <b>Car ID: </b> {car._id} <br></br>
            <b>Car Make: </b> {car.make} <br></br>
            <b>Car Number Plate: </b> {car.numberplate} <br></br>
            <b>Car Colour: </b> {car.colour} <br></br>
            <b>Car Fuel Type: </b> {car.fueltype} <br></br>
            <b>Car Seats: </b> {car.seats} <br></br>
            <b>Car Body Type: </b> {car.bodytype} <br></br>
            <b>Pickup time: </b> {pickupTime} <br></br>
            <b>Return time: </b> {returnTime} <br></br>
            <b>Cost: </b> ${cost} <br></br>
            <b>Location: </b> {locations.map(location =>
                <>
                    {location.id === car.location &&
                        <>
                            {location.name}
                        </>
                    }
                </>
            )} <br></br>
            <b>Address: </b> {locations.map(location =>
                <>
                    {location.id === car.location &&
                        <>
                            {location.address}
                        </>
                    }
                </>
            )} <br></br>
            <Button onClick={this.handleConfirmButton}>Confirm</Button>
            <Button variant="danger" onClick={this.handleCancelButton}>Cancel</Button>
        </div>);
    }
}

export default BookingConfirmDetailsPopUp;