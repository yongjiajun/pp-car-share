import React from 'react'

import '../../styles/faqs.css'

import { Accordion, Card, Button } from 'react-bootstrap'

function Faqs() {
    return (
        <section className="section-item">
            <div>
                <h2>FAQs</h2>
                <Accordion style={{marginTop: '7vh'}}>
                    <AccordionCustom eventKey="1" question="Question" answer="Answer"/>
                    <AccordionCustom eventKey="2" question="Question" answer="Answer"/>
                    <AccordionCustom eventKey="3" question="Question" answer="Answer"/>
                </Accordion>
            </div>
        </section>
    );
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

export default Faqs;