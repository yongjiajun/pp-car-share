/* Bookings details page */
import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Alert, Button, Col } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
import CarServiceApi from '../../api/CarServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';

class BookingDetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {},
            booking: {},
            car: {},
            errorMessage: '',
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false
        };
        this.handleCancelButton = this.handleCancelButton.bind(this);
        this.getBookingDetails = this.getBookingDetails.bind(this);
        this.checkBookingPast = this.checkBookingPast.bind(this);
    }

    getBookingDetails() {
        // obtain a user's booking by booking id and also car and location associated
        BookingServiceApi.getUserBooking(this.props.match.params.id)
            .then(res => {
                this.setState({
                    booking: res.data.booking
                });
                CarServiceApi.getCar(this.state.booking.car)
                    .then(res => {
                        this.setState({
                            car: res.data.car
                        })
                    });
                LocationServiceApi.getLocationFromId(this.state.booking.location)
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
                                };
                                // set new location object to react state array
                                this.setState({
                                    location: locationObject,
                                    isLoading: true
                                });
                            });
                    });
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            })
    }

    mapOnMarkerClick = (props, marker) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
        });

    mapOnMapClick = () =>
        this.setState({
            showingInfoWindow: false,
            selectedPlace: {},
            activeMarker: {}
        });

    componentDidMount() {
        this.getBookingDetails();
    }

    handleCancelButton() {
        // modify booking status to cancelled
        let booking = this.state.booking;
        booking.status = 'Cancelled';
        booking.id = booking._id;
        this.setState({
            booking: booking
        });
        BookingServiceApi.modifyBooking(this.state.booking)
            .then(() => {
                this.getBookingDetails()
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
    }

    checkBookingPast(pickupTime) {
        // check if booking pickup time has past current time
        let currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
        return new Date(pickupTime) > currentTime;
    }

    render() {
        return (
            <div className="container">
                <h2>Booking details</h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error obtaining booking!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                {!this.state.errorMessage &&
                    <>
                        {this.state.isLoading && <div id="garage-map" style={{ height: '400px' }}>
                            <Map google={this.props.google}
                                initialCenter={{
                                    lat: this.state.location.lat,
                                    lng: this.state.location.lng
                                }}
                                style={{ height: '400px', width: '400px' }}
                                zoom={14}
                                onClick={this.mapOnMapClick}>

                                <Marker
                                    id={this.state.location.id}
                                    name={this.state.location.name}
                                    address={this.state.location.address}
                                    onClick={this.mapOnMarkerClick}
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
                        <b>Booking ID: </b> {this.state.booking._id} <br></br>
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
                        <Col sm={4}>
                            <div className="cars-div-white" style={{ 'border': 'solid black 2px' }}>
                                <img src={this.state.car.image} alt="car" width="100" />
                                <h2 style={{ marginTop: '1vh' }}>{this.state.car.make}</h2>
                                <p>{this.state.car.fueltype}, {this.state.car.bodytype}, {this.state.car.seats} seaters, {this.state.car.colour}</p>
                                <h5>Number Plate: {this.state.car.numberplate}</h5>
                                <p><b>Car ID: </b>{this.state.car._id}</p>
                            </div>
                        </Col>
                    </>
                }
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_API_KEY
})(BookingDetailsPage);
