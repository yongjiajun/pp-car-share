import React, { Component } from 'react';

class BookingConfirmDetailsPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickupTime: '',
            returnTime: '',
            car: '',
            location: ''
        }
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
}

