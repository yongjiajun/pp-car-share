import React, { Component } from 'react';
import { Navbar, Nav, Form } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi';

class Header extends Component {
    render() {
        const isUserLoggedIn = UserServiceApi.isUserLoggedIn();

        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">Car Share</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav>
                    {!isUserLoggedIn &&
                        <Form inline>
                            <Nav.Link href="/signup">Sign Up</Nav.Link>
                            <Nav.Link href="/login">Log in</Nav.Link>
                        </Form>
                    }
                    {isUserLoggedIn &&
                        <Form inline>
                            <Nav.Link href="/">Dashboard</Nav.Link>
                            <Nav.Link href="/logout" onClick={UserServiceApi.logout}>Logout</Nav.Link>
                        </Form>
                    }
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Header;