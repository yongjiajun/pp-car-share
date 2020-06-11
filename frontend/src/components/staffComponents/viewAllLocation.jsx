import React, { Component } from 'react'
import { Container, Table, Alert, Button} from 'react-bootstrap'
import LocationServiceApi from '../../api/LocationServiceApi';

export default class viewAllLocation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            errorMessage: ''
        }
    }

    componentDidMount() {
        LocationServiceApi.getAllLocations().then(res => {
            this.setState({
                locations: res.data
            })
        }).catch(error => {
            this.setState({
                errorMessage: error.response 
            })
        })
    }

    render() {
        return (
            <Container>
                <h2>All locations, click to view details</h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error Getting all cars!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>address</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.locations.map(location => 
                                <tr style={{'cursor': 'pointer'}} key={location._id}>
                                    <td>{location._id}</td>
                                    <td>{location.name}</td>
                                    <td>{location.address}</td>
                                    <td><Button href={`/admin/modify/location/${location._id}`}>Modify</Button></td>
                                    <td><Button href={`/admin/view/location/${location._id}`}>View</Button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </Container>
        )
    }
}
