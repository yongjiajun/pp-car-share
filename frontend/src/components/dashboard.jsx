import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';

class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickupTime: '',
            returnTime: '',
            errorMessage: ''

        }
        // this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    /* Set react state for each input when user inputs something on signup form */
    handleChange = event => {
        this.setState({[event.target.name] : event.target.value})
    }

    handleSubmit = event => {
        event.preventDefault();
        // check for available cars and redirect
    }

    render() {
        return(
            <div className="container">
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
                            <Form.Control name="pickupTime" type="datetime-local" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalLastName">
                        <Form.Label column sm={2}>
                            Return Time
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="returnTime" type="datetime-local" onChange={this.handleChange}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit">Check Availability</Button>
                        </Col>
                    </Form.Group>
                </Form>
                <div>
                    Our cars:
                    # a list of cars
                </div>
            </div>
        )
    }
}

export default DashboardPage;