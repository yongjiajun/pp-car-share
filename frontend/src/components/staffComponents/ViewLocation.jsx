import React, { Component } from 'react'
import { Container, Button, Alert, Table, Form, Col, Row} from 'react-bootstrap'
import LocationServiceApi from '../../api/LocationServiceApi';
import CarServiceApi from '../../api/CarServiceApi';

export default class ViewLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            errMessage: '',
            cars: [],
            successMessage: ''
        }
    }

    componentDidMount() {
        if (this.props.location.state !== undefined) {
            this.setState({
                successMessage: this.props.location.state.success
            })
        }
        LocationServiceApi.getLocationFromId(this.props.match.params.id).then(res => {
            this.setState({
                location: res.data
            })

            res.data.cars.map(carId => {
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
                            <td>{location._id}</td>
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
                    ): <Col>Garage empty</Col>}
                </Row>
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
