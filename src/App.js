import React, { Component } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import Layout from './hoc/Layout/Layout';
import PostBoard from './container/PostBoard/PostBoard';
import UserBoard from './container/UserBoard/UserBoard';
import SignupPage from './container/SignupPage/SignupPage';
import ProfilePage from './container/ProfilePage/ProfilePage';
import ResetPasswordPage from './container/ResetPasswordPage/ResetPasswordPage';
import ChangePasswordPage from './container/ChangePasswordPage/ChangePasswordPage';

import Spinner from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import * as actions from './store/action/action_auth';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { connect } from 'react-redux';

const styles = theme => ({
    spinner: {
        position: 'fixed',
        top: '50%',
        left: '50%',
    }
})

class App extends Component {
    componentDidMount() {
        this.props.tryAutoLogin();
    }


    render() {
        const { classes } = this.props;

        // Routing guard, only authenticated user can access contents
        let routing = null;

        if (this.props.isAuth) {
            routing = (
                <Switch>
                    <Route path='/profile' component={ProfilePage} />
                    <Route path='/change_password' component={ChangePasswordPage} />
                    <Route path='/' component={PostBoard} />
                </Switch>
            )
        } else {
            routing = (
                <Switch>
                    <Route path='/login' component={UserBoard} />
                    <Route path='/signup' component={SignupPage} />
                    <Route path='/reset_password' component={ResetPasswordPage} />
                    <Route path='/' component={PostBoard} />
                </Switch>
            )
        }

        //  main--------
        return (
            <React.Fragment>
                <CssBaseline />
                <BrowserRouter>
                    {this.props.pending ? <Spinner className={classes.spinner} /> :
                        <Layout>
                            {routing}
                        </Layout>
                    }
                </BrowserRouter>
            </React.Fragment>
        );
    }
}

const stateToProps = state => {
    return {
        isAuth: state.auth.isAuth,
        pending: state.auth.pending,
    }
}

const dispatchToProps = (dispatch) => {
    return {
        tryAutoLogin: () => dispatch(actions.tryAutoLogin()),
    }
}

export default withStyles(styles)(connect(stateToProps, dispatchToProps)(App));
