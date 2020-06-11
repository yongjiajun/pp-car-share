import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
const { default: UserServiceApi } = require("../api/UserServiceApi")

class MyProfilePage extends Component {
    
    render() {
        const userData = UserServiceApi.getLoggedInUserDetails();
        return (
            <div>
                <h2>My Profile</h2>
                <strong>First name: </strong>{userData.firstname} <br></br>
                <strong>Last name: </strong>{userData.lastname} <br></br>
                <strong>Email: </strong>{userData.email} <br></br>
                <strong>Customer ID: </strong>{userData.id} <br></br>
                <Button href='/mybookings'>My Bookings</Button>
            </div>
        )
    }
}

export default MyProfilePage;