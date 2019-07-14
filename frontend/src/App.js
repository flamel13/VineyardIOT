import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import SignInForm from './pages/SignInForm';
import SimplePage from './pages/SimplePage';
import MapPage from './pages/MapPage';
import SensorPage from './pages/SensorPage';

import 'bootstrap/dist/css/bootstrap.css';
import logo from './images/grapefruit.png'; // Tell Webpack this JS file uses this image


class App extends Component {
  render() {
    return (
      <Router basename="/blockchain-food/">
      <title>IoT Project</title>
        <nav className="navbar navbar-expand-lg navbar navbar-dark bg-dark">
          <a className="navbar-brand" href="#"><img src={logo} width="64" height="64" alt="Logo" /><b>IoT Vineyard</b></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/sign-in">Sign In</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sensor-page">Sensors</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/map-page">Location</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Route exact path="/" component={SignUpForm}>
        </Route>
        <Route path="/sign-in" component={SignInForm}>
        </Route>
        <Route exact path="/simple-page" component={SimplePage}>
        </Route>
        <Route exact path="/map-page" component={MapPage}>
        </Route>
        <Route exact path="/sensor-page" component={SensorPage}>
        </Route>
      </Router>

    );
  }
}

export default App;
