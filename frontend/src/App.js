import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import LandingPage from './components/landing';
import './App.css';

function App() {
  return (
    <Router>
      <Route path="/" exact component={LandingPage}/>
    </Router>

  );
}

export default App;
