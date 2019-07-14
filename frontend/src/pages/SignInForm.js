import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// Import useful for redirect
import { withRouter } from 'react-router-dom';

class SignInForm extends Component {
    constructor() {
        super();
        // Initialize the state with variables that store the user informations
        this.state = {
            email: '',
            password: ''
        };
        // Enable the state change after form changes and form submit
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Handle changes of the state
    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
          [name]: value
        });
    }

    // Handle the form submit
    handleSubmit(e) {
        // Prevent the default behavior on submit
        e.preventDefault();

        // Print the state to the console, that consists of user data
        console.log('The form was submitted with the following data:');
        console.log(this.state);

        // Save user inserted data
        const user = {
           email: this.state.email,
           password: this.state.password
        };

        // Post user data to the Express API with axios
        axios.post('http://localhost:4000/api/users/login/', { user })
        .then(res => {
          var data = res.data;
          // Print JWT Token to console
          console.log(data.user.token);
          // Save the token to the local storage
          localStorage.setItem('jwt-token', data.user.token);
        })
        // Redirect to another page after the submit
    		this.props.history.push('/sensor-page');
    }

    render() {
        return (
          <div className="container">
            <div className="row">
              <div className="col-sm-6 mb-3 mb-md-0">
                <div className="card">
                  <div className="card-body">
                    <h1 className="card-title">Sign In</h1>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                      <div className="form-group">
                      <label for="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" name="email" value={this.state.email} onChange={this.handleChange} />
                      </div>
                      <div className="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} />
                      </div>
                      <div className="form-group">
                          <button type="submit" className="btn btn-primary">Sign In</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default SignInForm;
