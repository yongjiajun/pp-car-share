/* Staff overview page */
import React, { Component } from 'react';
const { default: UserServiceApi } = require("../../api/UserServiceApi");

export default class overview extends Component {
    render() {
        const userData = UserServiceApi.getLoggedInUserDetails();
        return (
            <div className="container">
                <h2>My Profile</h2>
                <strong>First name: </strong>{userData.firstname} <br></br>
                <strong>Last name: </strong>{userData.lastname} <br></br>
                <strong>Email: </strong>{userData.email} <br></br>
                <strong>Staff ID: </strong>{userData.id} <br></br>
                <strong>Staff type: </strong>{userData.usertype} <br></br>
            </div>
        )
    }
}
