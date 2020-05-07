import React, { Component } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import UserServiceApi from '../../api/UserServiceApi'
import CreateStaff from './createStaff'
import CreateCar from './createCar'
import Overview from './overview'

import '../../styles/staffDashboard.css'

const FunctionSelectedStyle = {
    borderBottom: "4px solid #009bde"
}

export default class staffDashboard extends Component {

    constructor(props){
        super(props);

        this.state = {
            component: 'Overview'
        }
    }

    handleClick(event) {
        this.setState({
            component: event.target.innerHTML
        })
    }

    render() {
        const { component } = this.state
        const isAdmin = UserServiceApi.isUserAdmin
        return (
            <Container style={{margin: "0", padding: "0", maxWidth: "100%"}}>
                <Row style={{margin: "0"}}>
                    <Col className="sidenav" md={2}>
                        <h3>{isAdmin ? "Admin" : "Staff" } Functions</h3>
                        <p href="#" onClick={this.handleClick.bind(this)} style={(component === "Overview") ? FunctionSelectedStyle : {} }>Overview</p>
                        { isAdmin && <p href="#" onClick={this.handleClick.bind(this)} style={(component === "Create Staff") ? FunctionSelectedStyle : {} }>Create Staff</p> }
                        <p href="#" onClick={this.handleClick.bind(this)} style={(component === "Create Car") ? FunctionSelectedStyle : {} }>Create Car</p>
                    </Col>

                    <Col className="main" md={10}>
                        <NavigateDashboard component={this.state.component} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

/* Navigate dashboard */


function NavigateDashboard(props) {
    const { component } = props
    switch(component) {
        case "Create Staff":
            return(<CreateStaff />);
        case "Create Car":
            return(<CreateCar />);
        default:
            return(<Overview />);
    }
}
