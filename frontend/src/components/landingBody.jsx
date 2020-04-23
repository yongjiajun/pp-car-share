import React, { Component } from 'react'
import { Nav } from 'react-bootstrap';

import '../styles/landingBody.css'
import Overview from './landingBodyComponents/overview'
import Pricing from './landingBodyComponents/pricing'
import CarsAndVans from './landingBodyComponents/carsAndVans'
import Faqs from './landingBodyComponents/faqs'

const navWhenSelectedStyle = {
    borderBottom: "4px solid #009bde"
}

export default class landingBody extends Component {

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
        const { component } = this.state;

        return (
            <div id="landing-body">
                <Nav id="landing-body-nav" className="justify-content-center" activeKey="/home">
                    <Nav.Item onClick={this.handleClick.bind(this)} style={(component === "Overview") ? navWhenSelectedStyle : {} }>
                        <Nav.Link className="nav-link">Overview</Nav.Link>
                    </Nav.Item>
                    <Nav.Item onClick={this.handleClick.bind(this)} style={(component === "Pricing") ? navWhenSelectedStyle : {}}>
                        <Nav.Link className="nav-link">Pricing</Nav.Link>
                    </Nav.Item>
                    <Nav.Item onClick={this.handleClick.bind(this)} style={(component === "Cars and Vans") ? navWhenSelectedStyle : {}}>
                        <Nav.Link className="nav-link">Cars and Vans</Nav.Link>
                    </Nav.Item>
                    <Nav.Item onClick={this.handleClick.bind(this)} style={(component === "FAQs") ? navWhenSelectedStyle : {}}>
                        <Nav.Link className="nav-link">FAQs</Nav.Link>
                    </Nav.Item>
                </Nav>
                <RenderCorrectComponents component={this.state.component} />
            </div>
        )
    }
}

/* Function components */

function RenderCorrectComponents(props) {
    const { component } = props
    switch(component) {
        case "Overview":
            return(<Overview />);
        case "Pricing":
            return(<Pricing />);
        case "Cars and Vans":
            return(<CarsAndVans />);
        case "FAQs":
            return(<Faqs />);
        default:
            return(<Overview />);
    }
}