import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './components/header';
import LandingPage from './components/landing';
import './App.css';

function App() {
  return (
    <Router>
      <Header/>
      <Route path="/" exact component={LandingPage}/>
    </Router>

  );
}

export default App;
