import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi.js'

class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            errorMessage: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    /* Set react state for each input when user inputs something on signup form */
    handleChange = event => {
        this.setState({[event.target.name] : event.target.value})
    }

    handleSubmit = event => {
        event.preventDefault();
        /* May need to change / edit this */
        let newUser = {
            firstname: this.state.firstname.trim(),
            lastname: this.state.lastname.trim(),
            email: this.state.email,
            password: this.state.password,
            usertype: "customer"
        }
        if (this.state.firstname === '') {
            return this.setState({ errorMessage: "First name can't be empty!" });
        }
        if (this.state.lastname === '') {
            return this.setState({ errorMessage: "Last name can't be empty!" });
        }
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(String(this.state.email).toLowerCase())) {
            return this.setState({ errorMessage: "Please enter a valid email!" });
        }
        UserServiceApi.createNewUser(newUser).then(() => { 
            UserServiceApi.loginUser({ email: this.state.email, password: this.state.password }).then(res => {
                UserServiceApi.registerSuccessfulLoginForJwt(res.data.token)
                window.location.href = `/`;
            })
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        })
    }

    render() {
        return (
            <div className="container">
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Sign up failed!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <Form onSubmit={this.handleSubmit} id="signup_form" >
                    <Form.Group as={Row} controlId="formHorizontalFirstName">
                        <Form.Label column sm={2}>
                            First Name
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="firstname" type="firstname" placeholder="First Name" onChange={this.handleChange} required/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalLastName">
                        <Form.Label column sm={2}>
                            Last Name
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="lastname" type="lastname" placeholder="Last Name" onChange={this.handleChange} required/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalEmail">
                        <Form.Label column sm={2}>
                            Email
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="email" type="email" placeholder="Email" onChange={this.handleChange} required/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalPassword">
                        <Form.Label column sm={2}>
                            Password
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control name="password" type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain: at least one number, one uppercase, lowercase letter, and at least 8 or more characters" placeholder="Password" onChange={this.handleChange} required/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit">Create Account</Button>
                        </Col>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <a href="/login">Have an account?</a>
                        </Col>
                    </Form.Group>
                </Form>

            </div>
        )
    }
}

export default SignUpPage;