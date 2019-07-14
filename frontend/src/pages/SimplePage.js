import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class SimplePage extends Component {
  constructor() {
    super();
    // Initialize the state, in which fetched data will be saved
    this.state = {
      items: []
    }
  }

  componentDidMount() {
      // Retrieve JWT Token from Local Storage
      var jwtToken = localStorage.getItem('jwt-token');
      // Printing JWT Token to console
      console.log(jwtToken);
      // Concat the JWT Token to use it in the Authorization header
      const AuthStr = 'Token '.concat(jwtToken);
      // Axios get request
      axios.get('http://localhost:4000/api/assets/socket',
      // Authentication header with JWT Token
      { headers: { Authorization: AuthStr } })
      .then(response => {
        // Save the response in the items array
        this.setState({
          items: response.data
        });
        // Print fetched data to console
        console.log(this.state.items);
      })
      .catch(error => {
        console.log(error);
      });
    }

    render() {
        return (
            // Display fetched data in the html page.
            <h1>Logged.</h1>
        );
    }
}

export default SimplePage;
