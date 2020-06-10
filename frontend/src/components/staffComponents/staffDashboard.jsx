import React, { Component } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import UserServiceApi from '../../api/UserServiceApi'
import CreateCar from './createCar'
import Overview from './overview'
import AdminSignup from '../adminComponents/adminSignup'

import '../../styles/staffDashboard.css'

const FunctionSelectedStyle = {
    borderBottom: "4px solid #009bde",
    color: "white"
}

const FunctionNotSelectedStyle = {
    color: "white"
}

export default class StaffDashboard extends Component {

    constructor(props){
        super(props);

        this.state = {
            
        }
    }
    
    componentDidMount() {
        
    }

    render() {
        const currentLocation = window.location.pathname
        const isAdmin = UserServiceApi.isUserAdmin
        return (
            <Container style={{margin: "0", padding: "0", maxWidth: "100%"}}>
                <Row style={{margin: "0"}}>
                    <Col className="sidenav" md={2}>
                        <h3>{isAdmin ? "Admin" : "Staff" } Functions</h3>
                        <p><a href="/staff" style={(currentLocation === "/staff") ? FunctionSelectedStyle : FunctionNotSelectedStyle }>Overview</a></p>
                        { 
                            isAdmin && 
                            <>
                                <p><a href="/admin/signup" style={(currentLocation === "/admin/signup") ? FunctionSelectedStyle : FunctionNotSelectedStyle }>Create Account</a></p>
                                <p><a href="/admin/addcars" style={(currentLocation === "/admin/addcars") ? FunctionSelectedStyle : FunctionNotSelectedStyle }>Create Car</a></p>
                                <p><a href="/admin/addlocation" style={(currentLocation === "/admin/addlocation") ? FunctionSelectedStyle : FunctionNotSelectedStyle }>Add Location</a></p>
                                <p><a href="/admin/view/customers" style={(currentLocation === "/admin/customers") ? FunctionSelectedStyle : FunctionNotSelectedStyle }>View All Customers</a></p>
                            </> 
                        }
                    </Col>

                    <Col className="main" md={10} style={{paddingTop: '5vh'}}>
                        {this.props.children}
                    </Col>
                </Row>
            </Container>
        )
    }
}

