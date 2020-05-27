import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './components/header';
import LandingPage from './components/landing';
import SignUpPage from './components/signup'
import LoginPage from './components/login';
import MapContainer from './components/map';
import './App.css';
import UserServiceApi from './api/UserServiceApi';
import AuthenticatedRoute from './AuthenticatedRoute';
import StaffRoute from './StaffRoute.jsx'
import AdminRoute from './AdminRoute.jsx'
import StaffDashboard from './components/staffComponents/staffDashboard';
import LocationShowPage from './components/locationShow';
import Footer from './components/footer';
import FilterCarsPage from './components/bookingComponents/filterCars';
import BookingDashboard from './components/bookingComponents/bookingDashboard';
import MyBookingPage from './components/bookingComponents/myBookings';
import BookingDetailsPage from './components/bookingComponents/bookingDetails';

/* Import admin and staff components */
import Overview from './components/staffComponents/overview';
import AdminSignUpPage from './components/adminComponents/adminSignup';
import CreateCar from './components/staffComponents/createCar';
import CreateLocation from './components/staffComponents/createLocation';

class App extends Component {

  state = {
    availableCars: [],
    pickupTime: "",
    returnTime: ""
  }

  updateCars(availableCars, pickupTime, returnTime) {
    this.setState({
      availableCars: availableCars,
      pickupTime: pickupTime,
      returnTime: returnTime
    })
  }

  componentDidMount() {
    /* add script tag here */
    
    if (UserServiceApi.isUserLoggedIn()) {
      UserServiceApi.setupAxiosInterceptors(UserServiceApi.getUserToken());
    }
  }

  render() {
    const { availableCars, pickupTime, returnTime } = this.state;

    return (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/"  component={LandingPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/locations/:id" component={LocationShowPage} />
          <Route path="/locations" component={MapContainer} />
          <AuthenticatedRoute path="/filter" component={(props) => <FilterCarsPage {...props}
            availableCars={availableCars}
            pickupTime={pickupTime}
            returnTime={returnTime} />} />
          <AuthenticatedRoute path="/dashboard" component={(props) => <BookingDashboard {...props}
            updateCars={this.updateCars.bind(this)} />} />
          <AuthenticatedRoute path="/mybookings/:id" component={BookingDetailsPage}/>
          <AuthenticatedRoute path="/mybookings" component={MyBookingPage}/>
          <StaffRoute path="/staff" component={StaffDashboard} />
          {/* Staff and admin only routes */}
          <StaffRoute path="/staff" component={Overview} />
          <StaffRoute path="/admin/signup" component={AdminSignUpPage} />
          <StaffRoute path="/admin/addcars" component={CreateCar} />
          <StaffRoute path="/admin/addlocation" component={CreateLocation}/>
        </Switch>
        <Footer />
      </Router>
    );
  }
}

export default App;
