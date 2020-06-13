/* Modify customer details page */
import React, { Component } from 'react';
import { Alert, Button, Form, Col, Row } from 'react-bootstrap';
const { default: UserServiceApi } = require("../../api/UserServiceApi");

export default class ModifyCustomerDetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: {},
            firstname: '',
            lastname: '',
            email: '',
            fetchErrorMessage: '',
            modifyErrorMessage: ''
        };
    }

    componentDidMount() {
        // fetch user by id
        UserServiceApi.getUserFromId(this.props.match.params.id).then(res => {
            this.setState({
                firstname: res.data.user.firstname,
                lastname: res.data.user.lastname,
                email: res.data.user.email,
                id: res.data.user._id,
                customer: res.data.user
            });
        }).catch((error) => {
            this.setState({ fetchErrorMessage: error.response.data.message });
        });
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = (event) => {
        // modify customer details handler
        event.preventDefault();
        let modifiedCustomer = this.state.customer;
        // input validation
        if (this.state.firstname.trim() !== '')
            modifiedCustomer.firstname = this.state.firstname.trim();
        else
            return this.setState({ modifyErrorMessage: "First name shall not be empty" });
        if (this.state.lastname.trim() !== '')
            modifiedCustomer.lastname = this.state.lastname.trim();
        else
            return this.setState({ modifyErrorMessage: "Last name shall not be empty" });
        if (this.state.email.trim() !== '') {
            let checkEmailExistsPayload = {
                email: this.state.email.trim()
            }
            // check if modified email exists
            UserServiceApi.checkEmailExists(checkEmailExistsPayload).then(res => {
                if (!(res.data.exist) || (this.state.email === this.state.customer.email)) {
                    modifiedCustomer.email = this.state.email.trim();
                    // publish modified customer to backend
                    UserServiceApi.updateUser(modifiedCustomer).then(res => {
                        return window.location.href = `/admin/view/customers/${this.state.customer._id}`;
                    }).catch((error) => {
                        return this.setState({ modifyErrorMessage: error.response.data.message });
                    })
                } else {
                    return this.setState({ modifyErrorMessage: "Email already exists! Please revert or try another one." });
                }
            }).catch(() => {
                return this.setState({ modifyErrorMessage: "Error checking if email exists!" });
            })
        }
        else
            return this.setState({ modifyErrorMessage: "Email shall not be empty" });
    }

    render() {
        return (
            <div className="container">
                {this.state.fetchErrorMessage && <Alert variant="danger">
                    <Alert.Heading>Error fetching customer details!</Alert.Heading>
                    <p>
                        {this.state.fetchErrorMessage}
                    </p>
                </Alert>}
                {this.state.modifyErrorMessage && <Alert variant="danger">
                    <Alert.Heading>Error modifying customer details!</Alert.Heading>
                    <p>
                        {this.state.modifyErrorMessage}
                    </p>
                </Alert>}
                <h2>Modify Customer Details</h2>
                <strong>Customer ID:</strong> {this.state.customer._id} <br></br>
                <Form>
                    <Form.Group as={Row} controlId="formHorizontalFirstName">
                        <Form.Label column sm={2}>
                            First Name
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="firstname" type="text" value={this.state.firstname} onChange={this.handleChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalLastName">
                        <Form.Label column sm={2}>
                            Last Name
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="lastname" type="text" value={this.state.lastname} onChange={this.handleChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                        <Form.Label column sm={2}>
                            Email
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="email" type="email" value={this.state.email} onChange={this.handleChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button onClick={this.handleSubmit}>Modify User</Button>
                            <Button variant="danger" href={`/admin/view/customers/${this.state.customer._id}`}>Cancel</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}
