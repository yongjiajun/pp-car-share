import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap';

import '../styles/landingBody.css'

export default class landingBody extends Component {

    render() {
        return (
            <div id="landing-body">
                <Nav id="landing-body-nav" className="justify-content-center" activeKey="/home">
                    <Nav.Item>
                        <Nav.Link className="nav-link">Overview</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="nav-link">Pricing</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="nav-link">Cars and Vans</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="nav-link">FAQs</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        )
    }
}
