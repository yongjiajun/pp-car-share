import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './components/header';
import LandingPage from './components/landing';
import SignUpPage from './components/signup'
import './App.css';

function App() {
  return (
    <Router>
      <Header/>
      <Route path="/" exact component={LandingPage}/>
      <Route path="/signup" exact component={SignUpPage}/>
    </Router>

  );
}

export default App;
