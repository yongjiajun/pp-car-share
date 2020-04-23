import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../styles/landing.css'
import LandingBody from './landingBody'

class LandingPage extends Component {

    render() {
        return(
            <>
            <div id="landing-page">
                <div id="catchphrase">
                    <h1>COOL Car Share Melbourne</h1>
                    <h4 style={{marginBottom: '1.85rem'}}>You don't need to own a car to drive one</h4>

                    <Link to="/signup">
                        <Button variant="warning">Sign Up Now</Button>
                    </Link>
                </div>
            </div>
            <div id="landing-main">
                <LandingBody/>
            </div>
            </>
        )
    }
}

export default LandingPage;