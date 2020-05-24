import React, {Component} from 'react'

import { Table } from 'react-bootstrap'

import '../../styles/pricing.css'

export default class Pricing extends Component {
    render() {
        return (
            <section className="section-item">
                <h2>Daily and hourly COOL Car Share rates</h2>
                <div className="table-div-white">
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Car</th>
                                <th>Vehicle Category</th>
                                <th>Hourly Rate</th>
                                <th>Daily Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Nissan Innova (example)</td>
                                <td>Sports Car</td>
                                <td>$0.01</td>
                                <td>$11111</td>
                            </tr>
                            <tr>
                                <td>Nissan Innova (example)</td>
                                <td>Sports Car</td>
                                <td>$0.01</td>
                                <td>$11111</td>
                            </tr>
                            <tr>
                                <td>Nissan Innova (example)</td>
                                <td>Sports Car</td>
                                <td>$0.01</td>
                                <td>$11111</td>
                            </tr>
                            <tr>
                                <td>Nissan Innova (example)</td>
                                <td>Sports Car</td>
                                <td>$0.01</td>
                                <td>$11111</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
    
                <h2>Additional Charges</h2>
                <div className="table-div-white">
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Smoking in the vehicle</td>
                                <td>$5000</td>
                            </tr>
                            <tr>
                                <td>Eating in the vehicle</td>
                                <td>$5000</td>
                            </tr>
                            <tr>
                                <td>Vehicle left unlocked</td>
                                <td>$5000</td>
                            </tr>
                            <tr>
                                <td>Vehicle left dirty</td>
                                <td>$5000</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </section>
        );
    }
}