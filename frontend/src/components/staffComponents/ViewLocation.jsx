import React, { Component } from 'react'
import { Container, Button, Alert, Table, Col, Row } from 'react-bootstrap'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import LocationServiceApi from '../../api/LocationServiceApi';
import CarServiceApi from '../../api/CarServiceApi';

class ViewLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            errMessage: '',
            cars: [],
            successMessage: '',
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false
        }
    }

    componentDidMount() {
        if (this.props.location.state !== undefined) {
            this.setState({
                successMessage: this.props.location.state.success
            })
        }
        LocationServiceApi.getLocationFromId(this.props.match.params.id).then(res => {
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

            res.data.cars.forEach(carId => {
                CarServiceApi.getCar(carId).then(res => {
                    this.state.cars.push(res.data.car);
                    this.setState({
                        cars: this.state.cars
                    })
                })
            })
        }).catch(err => {
            this.setState({
                errMessage: err.response
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

    render() {
        const { location } = this.state

        return (
            <Container>
                {this.state.successMessage &&
                    <Alert variant="success">
                        <Alert.Heading>Add car succeed!</Alert.Heading>
                        <p>
                            {this.state.successMessage}
                        </p>
                    </Alert>
                }
                <h2>Location details:</h2>
                <Container>
                    {this.state.isLoading && <div style={{ height: '400px' }}>
                            <Map google={this.props.google}
                                initialCenter={{
                                    lat: this.state.location.lat,
                                    lng: this.state.location.lng
                                }}
                                style={{ height: '400px', width: '50%' }}
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
                </Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>address</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{location.id}</td>
                            <td>{location.name}</td>
                            <td>{location.address}</td>
                            <td><Button href={`/admin/modify/location/${location._id}`}>Modify</Button></td>
                        </tr>
                    </tbody>
                </Table>
                <h2>Cars here:</h2>
                <Row>
                    {}
                    {this.state.cars.length !== 0 ? this.state.cars.map(car =>
                        <CarDescriptionComponent car={car} />
                    ) : <Col>Garage empty</Col>}
                </Row>
            </Container>
        )
    }
}

function CarDescriptionComponent(props) {
    const { car } = props
    return (
        <Col sm={4}>
            <div className="cars-div-white" style={{ 'border': 'solid black 2px' }}>
                <img src={car.image} alt="car" width="100" />
                <h2 style={{ marginTop: '1vh' }}>{car.make}</h2>
                <p>{car.fueltype}, {car.bodytype}, {car.seats} seaters, {car.colour}</p>
                <h5>${car.costperhour} per hour</h5>
                <h5>Number Plate: {car.numberplate}</h5>
                <a href={`/admin/view/cars/${car._id}`}><b>Car ID: </b>{car._id}</a>
            </div>
        </Col>
    );
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_API_KEY
})(ViewLocation)