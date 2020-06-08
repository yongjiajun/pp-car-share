import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../styles/landing.css'
import LandingBody from './landingBody'
import UserServiceApi from '../api/UserServiceApi';

class LandingPage extends Component {

    render() {
        const isUserLoggedIn = UserServiceApi.isUserLoggedIn();
        const isUserStaff = UserServiceApi.isUserStaff();
        return(
            <>
                <Container id="landing-page" fluid>
                    <div id="catchphrase">
                        <h1>MZA Car Share Melbourne</h1>
                        <h4>You don't need to own a car to drive one</h4>

                        {(isUserLoggedIn && !isUserStaff) &&
                        <>
                            <Link to="/dashboard">
                                <Button variant="warning" style={{fontSize: '2vh'}}>Book Now</Button>
                            </Link>
                        </>
                        }
                        {(isUserLoggedIn && isUserStaff) &&
                        <>
                            <Link to="/staff">
                                <Button variant="warning" style={{fontSize: '2vh'}}>Manage System</Button>
                            </Link>
                        </>
                        }
                        {!isUserLoggedIn &&
                        <>
                            <Link to="/signup">
                                <Button variant="warning" style={{fontSize: '2vh'}}>Sign Up Now</Button>
                            </Link>
                        </>
                        }
                    </div>
                </Container>
                <Container id="landing-main" fluid>
                    <LandingBody/>
                </Container>
            </>
        )
    }
}

export default LandingPage;