import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid/Grid';

import LoginPage from '../../component/LoginPage/LoginPage';
import * as actions from '../../store/action/action_auth';

import { Redirect } from 'react-router-dom';

class userBoard extends Component {
    state = {
        email: '',
        password: '',
    }


    // Handlers------------------------
    onFieldChange = (field, value) => {
        switch (field) {
            case 'email':
                this.setState({ [field]: value.trim() });
                break;

            default:
                this.setState({ [field]: value });
        }
    }

    onLoginSubmit = () => {
        this.props.login(this.state.email, this.state.password);
    }

    render() {
        let userPage = null;
        if (this.props.isAuth) {
            userPage = (
                <Redirect to='/' />
            )
        } else {
            userPage = (
                <LoginPage
                    email={this.state.email}
                    password={this.state.password}
                    onFieldChange={this.onFieldChange}
                    onLoginSubmit={this.onLoginSubmit}
                />

            )
        }

        return (
            <Grid container direction='column' justify='center' alignItems='center'>
                {userPage}
            </Grid>
        )
    }
}

// redux setup
const mapStateToProps = state => {
    return {
        token: state.auth.token,
        isAuth: state.auth.isAuth,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(userBoard);