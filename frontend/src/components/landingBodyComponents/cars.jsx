import React, { Component } from 'react'
import CarServiceApi from '../../api/CarServiceApi.js';
import LocationServiceApi from '../../api/LocationServiceApi.js'

import { Container, Row, Col, Button } from 'react-bootstrap'

import '../../styles/carsAndVans.css'

export default class CarsAndVans extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cars: []
        }
    }

    componentDidMount() {
        CarServiceApi.getAllCars().then(res => {
            res.data.cars.map(car => {
                LocationServiceApi.getLocationFromId(car.location).then(res => {
                    car.location = res.data.name
                    car.locationId = res.data._id
                    this.state.cars.push(car);
                    this.setState({
                        cars: this.state.cars
                    });
                });
            });
        })
    }

    render() {
        return (
            <section className="section-item">
                <div>
                    <h2>Our cars</h2>
                    <Container fluid>
                        <Row>
                            {
                                this.state.cars.map(car =>
                                    <CarDescriptionComponent car={car} />)
                            }
                        </Row>
                    </Container>
                </div>
                <div className="find-nearest-car-div">
                    <h2>Find your nearest MZA Car Share Garage</h2>
                    <p>Our cars are spread all over Melbourne. There's probably one near you</p>
                    <div>
                        <Button href="/locations">Check out our locations</Button>
                    </div>
                </div>
            </section>
        );
    }
}

function CarDescriptionComponent(props) {
    const { car } = props
    return (
        <Col sm={4}>
            <div className="cars-div-white">
                <img src={car.image} alt="car" width="100" />
                <h2 style={{ marginTop: '1vh' }}>{car.make}</h2>
                <p>{car.fueltype}, {car.bodytype}, {car.seats} seaters, {car.colour}</p>
                <h5>${car.costperhour} per hour</h5>
                <a href={"/locations/" + car.locationId}><strong>Garage Location:</strong> {car.location}</a>
            </div>
        </Col>
    );
}