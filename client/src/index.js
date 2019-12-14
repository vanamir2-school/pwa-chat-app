import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Login from './loginForm.js';
import * as aChat from './aChat.js';
import axios from 'axios';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            isLogin: true,
            name: null,
            email: '',
        };
        this.switchLoginSignup = this.switchLoginSignup.bind(this);
        this.logout = this.logout.bind(this);
        this.refreshLoginState = this.refreshLoginState.bind(this);
    }

    switchLoginSignup() {
        this.setState({
            isLogin: !this.state.isLogin,
        });
    }

    logout() {
        //console.log('logout');
        axios.get('/user/logout').then(response => {
            if (response.error) {
                console.log(response.error.toJSON());
                return;
            }
            if (this.state.loggedIn === true) {
                this.setState({
                    loggedIn: false,
                    name: null,
                });
            }
        });
    }

    refreshLoginState() {
        //console.log('Refreshing login state via server session');
        axios.get('/user/status')
            .then(response => {
                let result = false;
                if (response.error) {
                    console.log(response.error.toJSON());
                    if (this.state.loggedIn !== result) {
                        this.setState({
                            loggedIn: result,
                        });
                    }
                    return;
                }
                result = true;
                if (this.state.loggedIn !== result && this.state.loggedIn !== response.data) {
                    this.setState({
                        loggedIn: result,
                        name: response.data.name,
                        email: response.data.email,
                    });
                }
            });
        //console.log('Logged in: ' + this.state.loggedIn);
        //console.log('Username: ' + this.state.name);
        //console.log('Email: ' + this.state.email);
    }

    render() {
        this.refreshLoginState();
        // LOGGED IN - CHAT PAGE
        if (this.state.loggedIn) {
            //console.log('STATE IN RENDER' + this.state.email);
            return (
                <aChat.aChat
                    logout={this.logout}
                    name={this.state.name}
                    email={this.state.email}
                />
            );
        }
        // LOG IN PAGE
        if (this.state.isLogin) {
            return (
                <div className="login-form">
                    <Login.LoginForm
                        refreshLoginState={() => this.refreshLoginState()}
                    />
                    <Login.ActionButton
                        onClick={this.switchLoginSignup}
                        text={'Sign up'}
                    />
                </div>
            );
        } else { //SIGN UP PAGE
            return (
                <div className="login-form">
                    <Login.SignupForm
                        onClick={this.switchLoginSignup}
                    />
                    <Login.ActionButton
                        onClick={this.switchLoginSignup}
                        text={'Back to login'}
                    />
                </div>
            );
        }
    }
}

ReactDOM.render(
    <Chat/>,
    document.getElementById('root')
);