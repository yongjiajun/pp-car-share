import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import UserServiceApi from './api/UserServiceApi'


class StaffRoute extends Component {
    //This class authenticates and verifies the user, otherwise redirects the web to the login page.
    render() {
        if (UserServiceApi.isUserLoggedIn() && UserServiceApi.isUserStaff()) {
            return <Route {...this.props} />
        } else {
            return <Redirect to="/" />
        }

    }
}

export default StaffRoute