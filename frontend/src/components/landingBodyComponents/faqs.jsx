/* FAQs component in landing page */
import React, { Component } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';

export default class Faqs extends Component {
    render() {
        return (
            <section className="section-item">
                <div>
                    <h2>FAQs</h2>
                    <Accordion style={{ marginTop: '7vh' }}>
                        <AccordionCustom eventKey="1" question="How do I book a vehicle?" answer="Signup for an account if you haven't already, login and click on Dashboard to get started!" />
                        <AccordionCustom eventKey="2" question="How do I unlock a vehicle when it's time?" answer="Head over to Dashboard and select the Pickup button, it's that easy!" />
                        <AccordionCustom eventKey="3" question="How do I return when I'm done?" answer="Head over to Dashboard and select the Return button and you're good to go!" />
                        <AccordionCustom eventKey="4" question="Can I cancel my bookings prior pickup time?" answer="Yes most definitely! You can do it through My Bookings dashboard." />
                        <AccordionCustom eventKey="5" question="Can I smoke in your cars?" answer="Smoking is prohibited and will incur a $300 penalty if found guilty." />
                    </Accordion>
                </div>
            </section>
        );
    }
}

function AccordionCustom(props) {
    // FAQ render element
    const { eventKey, question, answer } = props
    return (
        <Card style={{ marginBottom: '3vh' }}>
            <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey={eventKey}>
                    {question}
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={eventKey}>
                <Card.Body>{answer}</Card.Body>
            </Accordion.Collapse>
        </Card>
    );
}
