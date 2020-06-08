import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert, Container } from 'react-bootstrap';
import CarServiceApi from '../../api/CarServiceApi';
import BookingServiceApi from '../../api/BookingServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';

class BookingDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickupTime: '',
            returnTime: '',
            errorMessage: '',
            nextBooking: {},
            nextBookingExists: false,
            car: '',
            location: '',
            successMsg: '',
            availablePickup: false,
            avaialbleReturn: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handlePickupButton = this.handlePickupButton.bind(this)
        this.handleReturnButton = this.handleReturnButton.bind(this)
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault();
        // check for available cars and redirect
        let newSearch = {
            pickupTime: this.state.pickupTime,
            returnTime: this.state.returnTime
        }
        CarServiceApi.searchAvailableCars(newSearch).then(res => {
            this.props.updateCars(res.data.availableCars, this.state.pickupTime, this.state.returnTime);
            this.props.history.push('/filter')
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        })
    }

    handlePickupButton() {
        this.state.nextBooking.status = 'Picked up';
        this.state.nextBooking.id = this.state.nextBooking._id;
        BookingServiceApi.modifyBooking(this.state.nextBooking)
            .then(() => {
                this.setState({
                    successMsg: "Car has been picked up! Please return it before your specified return time."
                })
            })
    }

    handleReturnButton() {
        this.state.nextBooking.status = 'Returned';
        this.state.nextBooking.id = this.state.nextBooking._id;
        BookingServiceApi.modifyBooking(this.state.nextBooking)
            .then(() => {
                this.setState({
                    successMsg: "Car has been returned! Thanks for using MZA Car Share!"
                })
            })
    }

    componentDidMount() {
        BookingServiceApi.getNextBooking().then(res => {
            if (Object.keys(res.data).length) {
                let currentTime = new Date();
                currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset())
                this.setState({
                    nextBooking: res.data,
                    nextBookingExists: true,
                    availablePickup: (!(new Date(res.data.pickuptime) > currentTime) && res.data.status == "Confirmed"),
                    avaialbleReturn: res.data.status == "Picked up"
                })
                CarServiceApi.getCar(res.data.car)
                    .then(res => {
                        this.setState({
                            car: res.data.car
                        })
                    })
                LocationServiceApi.getLocationFromId(res.data.location)
                    .then(res => {
                        this.setState({
                            location: res.data
                        })
                    })
            }
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        })
    }

    render() {
        return (
            <Container>
                {this.state.successMsg &&
                    <Alert variant="success">
                        <Alert.Heading>Pick up succeed!</Alert.Heading>
                        <p>
                            {this.state.successMsg}
                        </p>
                    </Alert>
                }
                {this.state.nextBookingExists &&
                    <div className="white-cards-div">
                        <Container>
                            <h2>Your upcoming booking: </h2>
                            <b>Car Make: </b> {this.state.car.make} <br></br>
                            <b>Car Number Plate: </b> {this.state.car.numberplate} <br></br>
                            <b>Car Colour: </b> {this.state.car.colour} <br></br>
                            <b>Car Fuel Type: </b> {this.state.car.fueltype} <br></br>
                            <b>Car Seats: </b> {this.state.car.seats} <br></br>
                            <b>Car Body Type: </b> {this.state.car.bodytype} <br></br>
                            <b>Booking time: </b> {this.state.nextBooking.bookedtime} <br></br>
                            <b>Pickup time: </b> {this.state.nextBooking.pickuptime} <br></br>
                            <b>Return time: </b> {this.state.nextBooking.returntime} <br></br>
                            <b>Cost: </b> ${this.state.nextBooking.cost} <br></br>
                            <b>Location: </b> {this.state.location.name} <br></br>
                            <b>Address: </b> {this.state.location.address} <br></br>
                            <b>Status: </b> {this.state.nextBooking.status} <br></br>
                            <Button onClick={this.handlePickupButton} disabled={!this.state.availablePickup}>Pickup</Button>
                            <Button onClick={this.handleReturnButton} disabled={!this.state.avaialbleReturn}>Return</Button>
                        </Container>
                    </div>
                }
                <h2>Let's find you a car!</h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error checking availability!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <Form onSubmit={this.handleSubmit} id="availability_form" >
                    <Form.Group as={Row} controlId="formHorizontalFirstName">
                        <Form.Label column sm={2}>
                            Pickup Time
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="pickupTime" type="datetime-local" onChange={this.handleChange} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalLastName">
                        <Form.Label column sm={2}>
                            Return Time
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="returnTime" type="datetime-local" onChange={this.handleChange} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit">Check Availability</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}

export default BookingDashboard;