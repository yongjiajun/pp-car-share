import React, {Component} from 'react'

import '../../styles/faqs.css'

import { Accordion, Card, Button } from 'react-bootstrap'

export default class Faqs extends Component {
    render() {
        return (
            <section className="section-item">
                <div>
                    <h2>FAQs</h2>
                    <Accordion style={{marginTop: '7vh'}}>
                        <AccordionCustom eventKey="1" question="How do I book a vehicle?" answer="Signup for an account if you haven't already, login and click on Book Now to get started!"/>
                        <AccordionCustom eventKey="2" question="Can I cancel my bookings prior pickup time?" answer="Yes most definitely! You can do it through My Bookings dashboard."/>
                        <AccordionCustom eventKey="3" question="Can I smoke in your cars?" answer="Smoking is prohibited and will incur a $300 penalty if found guilty."/>
                    </Accordion>
                </div>
            </section>
        );   
    }
}

function AccordionCustom(props) {
    const { eventKey, question, answer} = props
    return (
        <Card style={{marginBottom: '3vh'}}>
            <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={eventKey}>
            {question}
            </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={eventKey  }>
            <Card.Body>{answer}</Card.Body>
            </Accordion.Collapse>
        </Card>
    );
}