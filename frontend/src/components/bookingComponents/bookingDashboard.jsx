import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert, Container } from 'react-bootstrap';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
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
            avaialbleReturn: false,
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false
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
                    successMsg: "Car has been picked up! Please return it before your specified return time.",
                    availablePickup: false,
                    avaialbleReturn: true
                })
            })
    }

    onMarkerClick = (props, marker) =>
    this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true,
    })

onMapClick = () =>
    this.setState({
        showingInfoWindow: false,
        selectedPlace: {},
        activeMarker: {}
    })

    handleReturnButton() {
        this.state.nextBooking.status = 'Returned';
        this.state.nextBooking.id = this.state.nextBooking._id;
        BookingServiceApi.modifyBooking(this.state.nextBooking)
            .then(() => {
                this.setState({
                    successMsg: "Car has been returned! Thanks for using MZA Car Share!",
                    avaialbleReturn: false
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
                    availablePickup: (!(new Date(res.data.pickuptime) > currentTime) && res.data.status === "Confirmed"),
                    avaialbleReturn: res.data.status === "Picked up"
                })
                CarServiceApi.getCar(res.data.car)
                    .then(res => {
                        this.setState({
                            car: res.data.car
                        })
                    })
                LocationServiceApi.getLocationFromId(res.data.location)
                    .then(res => {
                        LocationServiceApi.getGeocodeFromAddress(res.data.address)
                            .then(newRes => {
                                // Create object with address, latitude and longitude
                                let locationObject = {
                                    id: res.data._id,
                                    address: res.data.address,
                                    name: res.data.name,
                                    lat: newRes.data.results[0].geometry.location.lat,
                                    lng: newRes.data.results[0].geometry.location.lng,
                                    cars: res.data.cars
                                }
                                // set new location object to react state array
                                this.setState({
                                    location: locationObject,
                                    isLoading: true
                                })
                            });
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
                        {this.state.isLoading && <div id="garage-map" style={{ height: '400px' }}>
                            <Map google={this.props.google}
                                initialCenter={{
                                    lat: this.state.location.lat,
                                    lng: this.state.location.lng
                                }}
                                style={{ height: '400px', width: '400px' }}
                                zoom={14}
                                onClick={this.onMapClick}>

                                <Marker
                                    id={this.state.location.id}
                                    name={this.state.location.name}
                                    address={this.state.location.address}
                                    onClick={this.onMarkerClick}
                                    position={{ lat: this.state.location.lat, lng: this.state.location.lng }}
                                />

                                <InfoWindow
                                    onClose={this.onInfoWindowClose}
                                    marker={this.state.activeMarker}
                                    visible={this.state.showingInfoWindow}>
                                    <div id="info-window">
                                        <h2>{this.state.selectedPlace.name}</h2>
                                        <p>{this.state.selectedPlace.address}</p>
                                        <a href={"/locations/" + this.state.selectedPlace.id}>Check out this location</a>
                                    </div>
                                </InfoWindow>
                            </Map>
                        </div>}
                            <b>Booking ID: </b> {this.state.nextBooking._id} <br></br>
                            <b>Booking time: </b> {this.state.nextBooking.bookedtime} <br></br>
                            <b>Pickup time: </b> {this.state.nextBooking.pickuptime} <br></br>
                            <b>Return time: </b> {this.state.nextBooking.returntime} <br></br>
                            <b>Cost: </b> ${this.state.nextBooking.cost} <br></br>
                            <b>Location: </b> {this.state.location.name} <br></br>
                            <b>Address: </b> {this.state.location.address} <br></br>
                            <b>Status: </b> {this.state.nextBooking.status} <br></br>
                            <Button variant="success" onClick={this.handlePickupButton} disabled={!this.state.availablePickup}>Pickup</Button>
                            <Button variant="danger" onClick={this.handleReturnButton} disabled={!this.state.avaialbleReturn}>Return</Button>
                            <Button href={`/mybookings/${this.state.nextBooking._id}`}>View Booking</Button>
                            <Col sm={4}>
                                <div className="cars-div-white" style={{ 'border': 'solid black 2px' }}>
                                    <img src={this.state.car.image} alt="car" width="100" />
                                    <h2 style={{ marginTop: '1vh' }}>{this.state.car.make}</h2>
                                    <p>{this.state.car.fueltype}, {this.state.car.bodytype}, {this.state.car.seats} seaters, {this.state.car.colour}</p>
                                    <h5>Number Plate: {this.state.car.numberplate}</h5>
                                    <p><b>Car ID: </b>{this.state.car._id}</p>
                                </div>
                        </Col>
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

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_API_KEY
})(BookingDashboard)