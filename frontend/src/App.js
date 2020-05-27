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
import DashboardPage from './components/dashboard';
import LocationShowPage from './components/locationShow';
import Footer from './components/footer';

/* Import admin and staff components */
import Overview from './components/staffComponents/overview';
import AdminSignUpPage from './components/adminComponents/adminSignup';
import CreateCar from './components/staffComponents/createCar';
import CreateLocation from './components/staffComponents/createLocation';
import StaffRoute from './StaffRoute.jsx';
import AdminRoute from './AdminRoute.jsx';

class App extends Component {

  componentDidMount() {
    /* add script tag here */
    
    if (UserServiceApi.isUserLoggedIn()) {
      UserServiceApi.setupAxiosInterceptors(UserServiceApi.getUserToken());
    }
  }

  render() {
    return (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/"  component={LandingPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/locations/:id" component={LocationShowPage} />
          <Route path="/locations" component= {MapContainer} />
          <AuthenticatedRoute path="/dashboard" component={DashboardPage} />
          
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
