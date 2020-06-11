import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import BookingServiceApi from '../../api/BookingServiceApi';
import UserServiceApi from '../../api/UserServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';

class BookingConfirmDetailsPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            location: {},
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false
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

    componentDidMount() {
        const { car } = this.props;

        LocationServiceApi.getLocationFromId(car.location)
            .then(res => {
                console.log(res)
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
            <Col sm={4}>
                <div className="cars-div-white">
                    <img src={car.image} alt="car" width="100" />
                    <h2 style={{ marginTop: '1vh' }}>{car.make}</h2>
                    <p>{car.fueltype}, {car.bodytype}, {car.seats} seaters, {car.colour}</p>
                    <h5>${car.costperhour} per hour</h5>
                    <a href={"/locations/" + car.locationId}><strong>Garage Location:</strong> {car.location}</a>
                </div>
            </Col>
            <Button variant="success" onClick={this.handleConfirmButton}>Confirm</Button>
            <Button variant="danger" onClick={this.handleCancelButton}>Cancel</Button>
        </div>);
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_API_KEY
})(BookingConfirmDetailsPopUp)