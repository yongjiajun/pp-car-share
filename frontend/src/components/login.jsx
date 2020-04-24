import React, { Component } from 'react';
import { Form, Col, Button, Row } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi.js'

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''

        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    /* Set react state for each input when user inputs something on login form */
    handleChange = event => {
        this.setState({[event.target.name] : event.target.value})
    }

    handleSubmit() {
        let creds = {
            email: this.state.email,
            password: this.state.password
        }
        UserServiceApi.loginUser(creds).then(res => {
            UserServiceApi.registerSuccessfulLoginForJwt(res.data.token)
            window.location.href = `/dashboard`;
        }).catch(res => {
            console.log(res)
        }, err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div className="container">
                <Form>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                        <Form.Label column sm={2}>
                            Email
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="email" type="email" placeholder="Email" onChange={this.handleChange}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalPassword">
                        <Form.Label column sm={2}>
                            Password
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="password" type="password" placeholder="Password" onChange={this.handleChange}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button onClick={this.handleSubmit}>Login</Button>
                        </Col>
                    </Form.Group>
                </Form>

            </div>
        )
    }
}

export default LoginPage;