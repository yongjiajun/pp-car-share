import React , { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';
const { default: UserServiceApi } = require("../../api/UserServiceApi")

export default class ViewCustomerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: {},
            errorMessage: ''
        }
    }

    componentDidMount() {
        UserServiceApi.getUserFromId(this.props.match.params.id).then(res => {
            this.setState({
                customer: res.data.user
            })
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        })
    }

    render() {
        return (
            <div className="container">
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error obtaining customer!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <h2>Customer Details</h2>
                <strong>Customer ID:</strong> {this.state.customer._id} <br></br>
                <strong>First name:</strong> {this.state.customer.firstname} <br></br>
                <strong>Last name:</strong> {this.state.customer.lastname} <br></br>
                <strong>Email:</strong> {this.state.customer.email} <br></br>
                <Button>View Customer's Bookings</Button> <br></br>
                <Button>Modify Customer Details</Button> <br></br>
            </div>
        )
    }
}