/* View all customers page */
import React, { Component } from 'react';
import { Alert, Button, Table, Container } from 'react-bootstrap';
const { default: UserServiceApi } = require("../../api/UserServiceApi");

export default class ViewAllCustomersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            errorMessage: ''
        };
    }

    componentDidMount() {
        // fetch all customers
        UserServiceApi.getAllCustomers().then(res => {
            this.setState({
                customers: res.data.customers.reverse()
            });
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
    }

    render() {
        return (
            <Container>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error obtaining customers!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <h2>View All Customers</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.customers.map(customer =>
                            <tr>
                                <td>{customer.id}</td>
                                <td>{customer.firstname}</td>
                                <td>{customer.lastname}</td>
                                <td>{customer.email}</td>
                                <td><Button href={`/admin/view/customers/${customer.id}`}>View</Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
        )
    }
}
