import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import UserServiceApi from './api/UserServiceApi'

import StaffDashboard from './components/staffComponents/staffDashboard'


const StaffRoute = ({component: Component, ...rest}) => {
    //This class authenticates and verifies the user, otherwise redirects the web to the login page.
    if (UserServiceApi.isUserLoggedIn() && (UserServiceApi.isUserStaff() || UserServiceApi.isUserAdmin())) {
        return(
            <Route {...rest} render={matchProps => (
                <StaffDashboard>
                    <Component {...matchProps}/>
                </StaffDashboard>
            )} />
        );
    } else {
        return <Redirect to="/" />
    }
}

export default StaffRoute