import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import '../styles/landing.css'
import LandingBody from './landingBody'

class LandingPage extends Component {

    render() {
        return(
            <>
            <div id="landing-page">
                <div id="catchphrase">
                    <h1>COOL Car Share Melbourne</h1>
                    <h4 style={{marginBottom: '1.85rem'}}>Why buy a car if you can share it</h4>

                    <Button variant="warning">Sign Up Now</Button>
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