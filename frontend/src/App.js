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
import Footer from './components/footer'

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
          <Route path="/" exact component={LandingPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/map" component={MapContainer} />
          <AuthenticatedRoute path="/dashboard" component={DashboardPage} />
        </Switch>
        <Footer />
      </Router>
    );
  }
}

export default App;
