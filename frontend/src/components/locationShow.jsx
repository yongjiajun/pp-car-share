import React, { Component } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap'
import LocationServiceApi from '../api/LocationServiceApi.js';
import MapContainer from './map';
import CarServiceApi from '../api/CarServiceApi.js';

class LocationShowPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {},
            cars: []
        }
    }

    componentDidMount() {
        let url = this.props.match.url
        let location_id = url.split("/")[2]
        // Get location from id
        LocationServiceApi.getLocationFromId(location_id).then(res => {
            this.setState({
                location: res.data,
            })
            res.data.cars.map(carId => {
                CarServiceApi.getCar(carId).then(res => {
                    this.state.cars.push(res.data.car);
                    this.setState({
                        cars: this.state.cars
                    })
                })
            })
        })
      }

    render() {
        return (
            <>
                <Jumbotron>
                    <h2>Welcome to one of our locations</h2>
                    <Button href="/locations" variant="primary">Back to the map</Button>
                </Jumbotron>
                <h3>{this.state.location.name}</h3>
                <h3>Address: </h3>{this.state.location.address}
                <h3>Cars at this location:</h3>
                <Container fluid>
                    <Row>
                        {this.state.cars.map(car => 
                            <CarDescriptionComponent car={car}/>
                        )}
                    </Row>
                </Container>

            </>
        )
    }
}

function CarDescriptionComponent(props) {
    const { car } = props
    return (
        <Col sm={4}>
            <div className="cars-div-white">
                <h2 style={{marginTop: '3vh'}}>{car.make}</h2>
                <p>{car.fueltype}, {car.bodytype}, {car.seats} seaters, {car.colour}</p>
                <h5>${car.costperhour} per hour</h5>
                {/* <img src={imgSrc} alt="car" /> */}
            </div>
        </Col>
    );
}

export default LocationShowPage;