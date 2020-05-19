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
import DashboardPage from './components/dashboard';
import StaffDashboard from './components/staffComponents/staffDashboard';
import LocationShowPage from './components/locationShow';
import Footer from './components/footer';

class App extends Component {
  componentDidMount() {
    if (UserServiceApi.isUserLoggedIn()) {
      UserServiceApi.setupAxiosInterceptors(sessionStorage.getItem(UserServiceApi.TOKEN_SESSION_ATTRIBUTE_NAME));
    }
  }

  render() {
    return (
      <Router>
        <Header />
        <Switch>
          <Route path="/signup" component={SignUpPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/locations/:id" component={LocationShowPage} />
          <Route path="/locations" component= {MapContainer} />
          <AuthenticatedRoute path="/dashboard" component={DashboardPage} />
          <StaffRoute path="/staff" component={StaffDashboard} isAdmin={UserServiceApi.isUserAdmin} />
          <Route path="/"  component={LandingPage} />
        </Switch>
        <Footer />
      </Router>
    );
  }
}

export default App;
