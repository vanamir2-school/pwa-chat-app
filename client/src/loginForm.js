import React from "react";
import axios from "axios";

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            refreshLoginState: props.refreshLoginState,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // univerzalni vyhodnoceni toho jakou property vzit
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    // make POST action ... action="user/add" method="POST"
    handleSubmit(event) {
        event.preventDefault();
        //console.log('User signup action starting...'.concat(JSON.stringify(this.state)));
        axios.post('/user/login', this.state)
            .then((response) => {
                this.state.refreshLoginState();
                console.log(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data);
                    console.log(error.response.data);
                }
            });
    }

    render() {
        return (
            <div className="login-form">
                <h1>aChat</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="email" value={this.state.email} onChange={this.handleChange} name="email"
                           placeholder="E-mail" required/>
                    <input type="password" value={this.state.password} autoComplete="on" onChange={this.handleChange}
                           name="password"
                           placeholder="Password" required/>
                    <input type="submit" value="Log in"/>
                </form>
            </div>
        );
    }
}

export class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            passwordConfirm: "",
            name: "",
            action: props.onClick,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // univerzalni vyhodnoceni toho jakou property vzit
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    // make POST action ... action="user/add" method="POST"
    handleSubmit(event) {
        // bullshit obezlička jak pustit action pro návrat na login page
        let actionGoToLogin = this.state.action;
        event.preventDefault();
        //console.log('User signup action starting...'.concat(this.state));
        if (this.state.password !== this.state.passwordConfirm) {
            alert('Passwords do not match.');
            return;
        }
        axios.post('/user/signup', this.state)
            .then(function (response) {
                actionGoToLogin();
                alert(response.data);
                console.log(response.data);
                return;
            })
            .catch(function (error) {
                if (error.response) {
                    alert(error.response.data);
                    console.log(error.response.data);
                }
            });
    }

    render() {
        return (
            <div className="login-form">
                <h1>aChat</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="email" value={this.state.email} onChange={this.handleChange} name="email"
                           placeholder="E-mail" required/>
                    <input type="password" value={this.state.password} onChange={this.handleChange} name="password"
                           placeholder="Password" required/>
                    <input type="password" value={this.state.passwordConfirm} onChange={this.handleChange}
                           name="passwordConfirm" placeholder="Password confirmation" required/>
                    <input type="text" value={this.state.name} onChange={this.handleChange} name="name"
                           placeholder="Name" required/>
                    <input type="submit" value="Sign up"/>
                </form>
            </div>
        );
    }
}

// při založení zlačítka se mu předá property onClick, které bude zajišťovat reakci na stisk
export function ActionButton(props) {
    return (
        // u Function komponent uz nemusi but lambda notace " () => "
        <div className="signUp">
            <a href="/#">
                <h1 onClick={props.onClick}>
                    {props.text}
                </h1>
            </a>
        </div>
    );
}