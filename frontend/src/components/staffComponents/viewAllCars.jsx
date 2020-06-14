/* View all cars page */
import React, { Component } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import CarServiceApi from '../../api/CarServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import { withRouter } from 'react-router-dom';

class ViewAllCars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cars: [],
            errorMessage: ''
        };
        this.viewCarDetails = this.viewCarDetails.bind(this);
    }

    viewCarDetails(id) {
        this.props.history.push(`/admin/view/cars/${id}`);
    }

    componentDidMount() {
        // fetch all cars
        CarServiceApi.getAllCars().then(res => {
            res.data.cars.forEach(car => {
                // fetch location details for each car
                LocationServiceApi.getLocationFromId(car.location).then(res => {
                    car.location = res.data.name;
                    car.locationId = res.data._id;
                    this.state.cars.push(car);
                    this.setState({
                        cars: this.state.cars
                    });
                });
            });
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
    }

    render() {
        return (
            <Container>
                <h2>All cars, click row to view/modify.</h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error Getting all cars!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>make</th>
                            <th>seats</th>
                            <th>body type</th>
                            <th>number plate</th>
                            <th>colour</th>
                            <th>cost per hour</th>
                            <th>fuel type</th>
                            <th>location</th>
                            <th>image</th>
                            <th>current booking</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.cars.map(car =>
                                <tr style={{ 'cursor': 'pointer' }} key={car.id} onClick={() => this.viewCarDetails(car.id)}>
                                    <td>{car.id}</td>
                                    <td>{car.make}</td>
                                    <td>{car.seats}</td>
                                    <td>{car.bodytype}</td>
                                    <td>{car.numberplate}</td>
                                    <td>{car.colour}</td>
                                    <td>{car.costperhour}</td>
                                    <td>{car.fueltype}</td>
                                    <td>{car.location}</td>
                                    <td><img alt="car" src={car.image} width={50} /></td>
                                    <td>{(car.currentbooking === null) ? "No booking" : car.currentbooking}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </Container>
        )
    }
}

export default withRouter(ViewAllCars);
