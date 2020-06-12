import React, { Component } from 'react'
import { Container, Button, Alert, Table, Form, Col, Row} from 'react-bootstrap'
import CarServiceApi from '../../api/CarServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import { CAR_COLOURS, CAR_BODY_TYPES, CAR_FUEL_TYPES, CAR_SEATS } from '../../Constants.js';

export default class ModifyCarDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            car: '',
            locationList: [],
            make: '',
            seats: '',
            bodytype: '',
            numberplate: '',
            colour: '',
            costperhour: '',
            fueltype: '',
            location: '',
            b64photo: '',
            errMsg: '',
            successMsg: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFile = this.handleFile.bind(this)
    }

    handleFile = (event) => {
        let files = event.target.files
        if(files !== null) {
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
    
            reader.onload = (event) => {
                this.setState({
                    b64photo: event.target.result
                })
            }
        }
    }

    inputValidation = () => {
        const { make, seats, bodytype, numberplate, 
            colour, costperhour, fueltype, location} = this.state

        if(make === '' || seats === '' || bodytype === '' || numberplate === ''
            || colour === '' || costperhour === '' || fueltype === '' || location === '') {
                this.setState({
                    errMsg: "Please fill in everything"
                })

                return false;
            }
        else {
            this.setState({
                errMsg: ""
            })
            
            return true;
        }
    }

    handleSubmit(event) {
        event.preventDefault()
        if (!this.inputValidation()) {
            return
        }

        const { car } = this.state
        this.setState({
            disableSubmit: true,
        })
        let carDetails = {
            _id: car._id,
            make: this.state.make,
            seats: this.state.seats,
            bodytype: this.state.bodytype,
            numberplate: this.state.numberplate,
            colour: this.state.colour,
            costperhour: this.state.costperhour,
            fueltype: this.state.fueltype,
            location: this.state.location,
            image: this.state.b64photo
        }
        CarServiceApi.updateCar(carDetails).then(res => {
            this.setState({
                successMsg: "Car is successfully updated",
                disableSubmit: false,
                errMsg: ""
            })
            this.getCar()
            this.scrollTop()
        }).catch(err => {
            this.setState({
                errMsg: err.response.data.message,
                disableSubmit: false,
                successMsg: ""
            })
        })
    }

    handleChange = (event) => {
        this.setState({[event.target.name] : event.target.value});
    }

    scrollTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    getCar() {
        CarServiceApi.getCar(this.props.match.params.id).then(res => {
            const car = res.data.car;
            LocationServiceApi.getLocationFromId(car.location).then(res => {
                car.location = res.data.address
                car.locationId = res.data._id
                this.setState({
                    car: car,
                    make: car.make,
                    numberplate: car.numberplate,
                    costperhour: car.costperhour,
                    seats: car.seats,
                    colour: car.colour,
                    bodytype: car.bodytype,
                    location: car.locationId,
                    fueltype: car.fueltype,
                    b64photo: car.image
                });
            });
        }).catch(err => {
            this.setState({
                errMsg: err.response
            })
        })
    }

    componentDidMount() {
        this.getCar()        

        LocationServiceApi.getAllLocations().then((res) => {
            res.data.map(location => this.setState({locationList: this.state.locationList.concat(location)}))
        }, (err) => {
            this.setState({
                errMsg: err.response
            })
        })
    }

    render() {
        const { car } = this.state;

        return (
            <Container>
                <h2>Car details:</h2>
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
                        <tr key={car._id}>
                            <td>{car._id}</td>
                            <td>{car.make}</td>
                            <td>{car.seats}</td>
                            <td>{car.bodytype}</td>
                            <td>{car.numberplate}</td>
                            <td>{car.colour}</td>
                            <td>{car.costperhour}</td>
                            <td>{car.fueltype}</td>
                            <td>{car.location}</td>
                            <td><img alt="car" src={car.image} width={50}/></td>
                            <td>{(car.currentbooking === null) ? "No booking" : car.currentbooking}</td>
                        </tr>
                    </tbody>
                </Table>

                <h2>Modify details</h2>
                {this.state.errMsg && 
                    <Alert variant="danger">
                        <Alert.Heading>Add car failed!</Alert.Heading>
                        <p>
                            {this.state.errMsg}
                        </p>
                    </Alert>
                }

                {this.state.successMsg && 
                    <Alert variant="success">
                        <Alert.Heading>Add car succeed!</Alert.Heading>
                        <p>
                            {this.state.successMsg}
                        </p>
                    </Alert>
                }
                <Form>
                    <Form.Group as={Row} controlId="formHorizontalMake">
                        <Form.Label column sm={2}>
                            Make
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="make" type="make" value={this.state.make} onChange={this.handleChange} required/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalSeats">
                        <Form.Label column sm={2}>
                            Seats
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="seats" type="seats" onChange={this.handleChange} required>
                                {
                                    CAR_SEATS.map((option, index) => {
                                        const bool = option === car.seats
                                        return(
                                            (bool) ? <option key={index} value={option} selected>{option}</option> :
                                            <option key={index} value={option}>{option}</option>
                                        )
                                })
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalBodyType">
                        <Form.Label column sm={2}>
                            Body type
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="bodytype" type="bodytype" onChange={this.handleChange} required>
                                {
                                    CAR_BODY_TYPES.map((option, index) =>{
                                        const bool = option === car.bodytype
                                        return(
                                            (bool) ? <option key={index} value={option} selected>{option}</option> :
                                            <option key={index} value={option}>{option}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalNumberPlate">
                        <Form.Label column sm={2}>
                            Number Plate
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="numberplate" type="numberplate" value={this.state.numberplate} onChange={this.handleChange} required/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalColour">
                        <Form.Label column sm={2}>
                            Colour
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="colour" type="colour" onChange={this.handleChange} required>
                                <option disabled selected>Select colour</option>
                                {
                                    CAR_COLOURS.map((option, index) => {
                                        const bool = option === car.colour
                                        return(
                                            (bool) ? <option key={index} value={option} selected>{option}</option> :
                                            <option key={index} value={option}>{option}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalCostPerHour">
                        <Form.Label column sm={2}>
                            Cost per hour
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="costperhour" type="number" value={this.state.costperhour} onChange={this.handleChange} required/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalFuelType">
                        <Form.Label column sm={2}>
                            Fuel type
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="fueltype" type="fueltype" onChange={this.handleChange} required>
                                <option disabled selected>Select fuel type</option>
                                {
                                    CAR_FUEL_TYPES.map((option, index) => {
                                        const bool = option === car.fueltype
                                        return(
                                            (bool) ? <option key={index} value={option} selected>{option}</option> :
                                            <option key={index} value={option}>{option}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalLocation">
                        <Form.Label column sm={2}>
                            Location
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="location" type="location" onChange={this.handleChange} required>
                                <option disabled selected>Select location</option>l
                                {
                                    this.state.locationList.map((option, index) => {
                                        const bool = option.address === car.location
                                        return(
                                            (bool) ? <option key={index} value={option._id} selected>{option.address}</option> :
                                            <option key={index} value={option._id}>{option.address}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalLocation">
                        <Form.Label column sm={2}>
                        </Form.Label>
                        <Col sm={10}>
                            <Form.File 
                                id="custom-file"
                                label="Car picture"
                                name="b64photo"
                                onChange={this.handleFile}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button onClick={this.handleSubmit} disabled={this.state.disableSubmit}>Update Car</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}
