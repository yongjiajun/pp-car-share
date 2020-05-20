import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../styles/landing.css'
import LandingBody from './landingBody'
import UserServiceApi from '../api/UserServiceApi';
import SearchComponent from './search';

class LandingPage extends Component {

    render() {
        const isUserLoggedIn = UserServiceApi.isUserLoggedIn();
        return(
            <>
                <Container id="landing-page" fluid>
                    <div id="catchphrase">
                        <h1>COOL Car Share Melbourne</h1>
                        <h4>You don't need to own a car to drive one</h4>

                        {isUserLoggedIn &&
                        <>
                            <SearchComponent {...this.props} updateCars={this.props.updateCars.bind(this)}></SearchComponent>
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