import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
import UserServiceApi from '../../api/UserServiceApi';

class BookingConfirmDetailsPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: ''
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
        const { car, pickupTime, returnTime } = this.props;
        const cost = this.calculateBookingCost();

        return (<div className="container">
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Booking failed!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                Selected car: {car.make}, pickupTime: {pickupTime}, returnTime: {returnTime}, cost: ${cost}, location: {car.location}
                <Button onClick={this.handleConfirmButton}>Confirm</Button>
                <Button onClick={this.handleCancelButton}>Cancel</Button>
        </div>);
    }
}

export default BookingConfirmDetailsPopUp;