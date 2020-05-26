import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';

class BookingConfirmDetailsPopUp extends Component {
    constructor(props) {
        super(props);
        this.handleConfirmButton = this.handleConfirmButton.bind(this);
    }

    handleConfirmButton = event => {
        event.preventDefault();
        // confirms booking
    }

    handleCancelButton = event => {
        event.preventDefault();
        // closes pop up and returns to filter car page
    }

    calculateBookingCost() {
        // cost calculation
        const pickupTimeHours = new Date(this.props.pickupTime);
        const returnTimeHours = new Date(this.props.returnTime);
        const timeDeltaHours = new Date(returnTimeHours - pickupTimeHours).getTime() / 3600;
        
        // TODO: make a popup menu that shows the booking details when 1 car is selected: cost and stuff
        // user will be given the option to book or checkout other cars
        // DONT REDIRECT to another page for displaying the above details because availableCars will be lost if customers regret
        // and go back to the previous page to pick other cars
        const cost = parseInt(this.props.car.costperhour) * (timeDeltaHours / 1000);
        return cost;
    }

    render() {
        const { car, pickupTime, returnTime } = this.props;
        const cost = this.calculateBookingCost();

        return (<div>
                Selected car: {car.make}, pickupTime: {pickupTime}, returnTime: {returnTime}, cost: ${cost}, location: {car.location}
                <Button onClick={this.handleConfirmButton}>Confirm</Button>
                <Button onClick={this.handleCancelButton}>Cancel</Button>
        </div>);
    }
}

export default BookingConfirmDetailsPopUp;