/* App router */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from './components/header';
import LandingPage from './components/landing';
import SignUpPage from './components/signup';
import LoginPage from './components/login';
import MapContainer from './components/map';
import UserServiceApi from './api/UserServiceApi';
import AuthenticatedRoute from './AuthenticatedRoute';
import StaffRoute from './StaffRoute.jsx'
import LocationShowPage from './components/locationShow';
import Footer from './components/footer';
import FilterCarsPage from './components/bookingComponents/filterCars';
import BookingDashboard from './components/bookingComponents/bookingDashboard';
import MyBookingPage from './components/bookingComponents/myBookings';
import BookingDetailsPage from './components/bookingComponents/bookingDetails';
import MyProfilePage from './components/myProfile';

/* Import admin and staff components */
import Overview from './components/staffComponents/overview';
import AdminSignUpPage from './components/adminComponents/adminSignup';
import CreateCar from './components/staffComponents/createCar';
import CreateLocation from './components/staffComponents/createLocation';
import ViewAllCustomersPage from './components/staffComponents/viewAllCustomers';
import ViewCustomerPage from './components/staffComponents/viewCustomer';
import ModifyCustomerDetailsPage from './components/staffComponents/modifyCustomerDetails';
import ViewAllBookingsPage from './components/staffComponents/viewAllBookings';
import ViewBookingPage from './components/staffComponents/viewBooking';
import ViewCustomerBookingsPage from './components/staffComponents/viewCustomerBookings';
import ViewAllCarsPage from './components/staffComponents/viewAllCars';
import ModifyCarDetailsPage from './components/staffComponents/modifyCarDetails';
import ViewAllLocations from './components/staffComponents/viewAllLocations';
import ViewLocation from './components/staffComponents/ViewLocation';
import ModifyLocationPage from './components/staffComponents/modifyLocationPage';

import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

class App extends Component {
  state = {
    availableCars: [],
    pickupTime: "",
    returnTime: ""
  };

  updateCars(availableCars, pickupTime, returnTime) {
    this.setState({
      availableCars: availableCars,
      pickupTime: pickupTime,
      returnTime: returnTime
    });
  }

  componentDidMount() {
    if (UserServiceApi.isUserLoggedIn()) {
      UserServiceApi.setupAxiosInterceptors(UserServiceApi.getUserToken());
    }
  }

  render() {
    const { availableCars, pickupTime, returnTime } = this.state;
    const isUserStaff = UserServiceApi.isUserStaff();
    return (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/locations/:id" component={LocationShowPage} />
          <Route path="/locations" component={MapContainer} />
          {/* Customers only routes */}
          {!isUserStaff && <AuthenticatedRoute path="/filter" component={(props) => <FilterCarsPage {...props}
            availableCars={availableCars}
            pickupTime={pickupTime}
            returnTime={returnTime} />} />}
          {!isUserStaff && <AuthenticatedRoute path="/dashboard" component={(props) => <BookingDashboard {...props}
            updateCars={this.updateCars.bind(this)} />} />}
          {!isUserStaff && <AuthenticatedRoute path="/mybookings/:id" component={BookingDetailsPage} />}
          {!isUserStaff && <AuthenticatedRoute path="/mybookings" component={MyBookingPage} />}
          {!isUserStaff && <AuthenticatedRoute path="/myprofile" component={MyProfilePage} />}
          {/* Staff and admin only routes */}
          <StaffRoute path="/staff" component={Overview} />
          <StaffRoute path="/admin/signup" component={AdminSignUpPage} />
          <StaffRoute path="/admin/addcars" component={CreateCar} />
          <StaffRoute path="/admin/addlocation" component={CreateLocation} />
          <StaffRoute path="/admin/view/customers/:id/bookings" component={ViewCustomerBookingsPage} />
          <StaffRoute path="/admin/view/customers/:id" component={ViewCustomerPage} />
          <StaffRoute path="/admin/view/customers" component={ViewAllCustomersPage} />
          <StaffRoute path="/admin/view/bookings/:id" component={ViewBookingPage} />
          <StaffRoute path="/admin/view/bookings" component={ViewAllBookingsPage} />
          <StaffRoute path="/admin/modify/customers/:id" component={ModifyCustomerDetailsPage} />
          <StaffRoute path="/admin/view/cars/:id" component={ModifyCarDetailsPage} />
          <StaffRoute path="/admin/view/cars" component={ViewAllCarsPage} />
          <StaffRoute path="/admin/modify/location/:id" component={ModifyLocationPage} />
          <StaffRoute path="/admin/view/location/:id" component={ViewLocation} />
          <StaffRoute path="/admin/view/location" component={ViewAllLocations} />
        </Switch>
        <Footer />
      </Router>
    );
  }
}

export default App;
