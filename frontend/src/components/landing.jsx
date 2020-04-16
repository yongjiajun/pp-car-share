import React, { Component } from 'react';
import '../styles/landing.css'

class LandingPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id="landing-page">
                <h1>Welcome to Car Share</h1>
            </div>
        )
    }
}

export default LandingPage;