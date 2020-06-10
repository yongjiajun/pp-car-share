import React , { Component } from 'react';
import { Alert } from 'react-bootstrap';
const { default: UserServiceApi } = require("../../api/UserServiceApi")

export default class ViewAllCustomersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            errorMessage: ''
        }
    }

    componentDidMount() {
        UserServiceApi.getAllCustomers().then(res => {
            this.setState({
                customers: res.data.customers.reverse()
            })
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        })
    }

    render() {
        return (
            <div className="container">
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error obtaining customers!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <h2>View All Customers</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.customers.map(customer =>
                            <tr>
                                <td>{customer.id}</td>
                                <td>{customer.firstname}</td>
                                <td>{customer.lastname}</td>
                                <td>{customer.email}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}