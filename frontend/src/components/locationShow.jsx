import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Jumbotron, Button } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap'
import LocationServiceApi from '../api/LocationServiceApi.js';
import "../styles/map.css"
import MapContainer from './map';
import CarServiceApi from '../api/CarServiceApi.js';

class LocationShowPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {},
            cars: [],
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false
        }
    }

    componentDidMount() {
        let url = this.props.match.url
        let location_id = url.split("/")[2]
        // Get location from id
        LocationServiceApi.getLocationFromId(location_id).then(res => {
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
            res.data.cars.map(carId => {
                CarServiceApi.getCar(carId).then(res => {
                    this.state.cars.push(res.data.car);
                    this.setState({
                        cars: this.state.cars
                    })
                })
            })
        });
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

    render() {
        return (
            <Container style={{'padding': '1vh'}}>
                <Jumbotron>
                    <h2>Welcome to one of our locations</h2>
                    <Button href="/locations" variant="primary">Back to the map</Button>
                </Jumbotron>
                {this.state.isLoading && <div id="garage-map" style={{height: '400px'}}>
                    <Map google={this.props.google}
                        initialCenter={{
                            lat: this.state.location.lat,
                            lng: this.state.location.lng
                        }}
                        style={{height: '400px', width: '400px'}}
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
                <h3>{this.state.location.name}</h3>
                <strong>Address: </strong>
                <p>{this.state.location.address}</p>
                <strong>Number of cars: </strong>
                <p>{this.state.cars.length}</p>
                <strong>Cars at this location:</strong>
                <Container fluid id="car-show">
                    <Row>
                        {this.state.cars.map(car =>
                            <CarDescriptionComponent car={car} />
                        )}
                    </Row>
                </Container>
            </Container>
        )
    }
}

function CarDescriptionComponent(props) {
    const { car } = props
    return (
        <Col sm={4}>
            <div className="cars-div-white" style={{'border': 'solid black 2px'}}>
                <img src={car.image} alt="car" width="100"/>
                <h2 style={{marginTop: '1vh'}}>{car.make}</h2>
                <p>{car.fueltype}, {car.bodytype}, {car.seats} seaters, {car.colour}</p>
                <h5>${car.costperhour} per hour</h5>
            </div>
        </Col>
    );
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_API_KEY
})(LocationShowPage)