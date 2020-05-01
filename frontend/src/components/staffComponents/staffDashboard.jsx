import React, { Component } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import UserServiceApi from '../../api/UserServiceApi.js'

import '../../styles/staffDashboard.css'

export default class staffDashboard extends Component {

    componentDidMount(){
        console.log(this.props.isAdmin)
    }
    render() {
        const isAdmin = UserServiceApi.isUserAdmin
        return (
            <Container style={{margin: "0", padding: "0", maxWidth: "100%"}}>
                <Row>
                    <Col className="sidenav" md={2}>
                        <h3>{isAdmin ? "Admin" : "Staff" } Functions</h3>
                        { isAdmin && <a href="#">Create Staff</a> }
                        <a href="#">Create Car</a>
                        <a href="#">Settle Payments</a>
                        <a href="#">License Verification</a>
                    </Col>

                    <Col className="main" md={10}>
                        
                    </Col>
                </Row>
            </Container>
        )
    }
}
