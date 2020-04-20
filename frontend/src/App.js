import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './components/header';
import LandingPage from './components/landing';
import SignUpPage from './components/signup'
import LoginPage from './components/login'
import LogoutComponent from './components/logout'
import './App.css';
import UserServiceApi from './api/UserServiceApi';

class App extends Component {
  componentDidMount() {
    if (UserServiceApi.isUserLoggedIn()) {
      UserServiceApi.setupAxiosInterceptors(UserServiceApi.createJWTToken(sessionStorage.getItem(UserServiceApi.TOKEN_SESSION_ATTRIBUTE_NAME)));
    }
  }

  render() {
    return (
      <Router>
        <Header />
        <Route path="/" exact component={LandingPage} />
        <Route path="/signup" exact component={SignUpPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/logout" exact component={LogoutComponent} />
      </Router>
    );
  }
}

export default App;
