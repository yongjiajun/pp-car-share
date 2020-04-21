import React, { Component } from 'react';
import UserServiceApi from '../api/UserServiceApi';

class DashboardPage extends Component {

    render() {
        const userDetails = UserServiceApi.getLoggedInUserDetails();

        return(
            <body>
                <h1>Hey {userDetails.firstname}, welcome back to Car Share!</h1>
                <p>First name: {userDetails.firstname}</p>
                <p>Last name: {userDetails.lastname}</p>
                <p>Email: {userDetails.email}</p>
                <p>User ID: {userDetails.id}</p>
                <p>User type: {userDetails.usertype}</p>
                <p>JWT Token: {UserServiceApi.getUserToken()}</p>
            </body>
        )
    }
}

export default DashboardPage;