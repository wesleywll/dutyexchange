import React from 'react';
import inDevMode from '../../../utility/dev';

import { Link } from 'react-router-dom';

import css from './Navbar.css';

import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import Typo from '@material-ui/core/Typography/Typography';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import * as actions from '../../../store/action/action_auth';


const styles = theme => ({
    navButton: {
        color: 'white',
    },
    navText: {
        color: 'white',
    },
})

const navbar = (props) => {
    const { classes } = props;

    const homeButton = (
        <Link
            to='/'
            style={{ textDecoration: 'none' }}>
            <Button className={classes.navButton}>Home</Button>
        </Link>
    )

    const loginButton = (
        <Link
            to='/login'
            style={{ textDecoration: 'none' }}>
            <Button className={classes.navButton}>Login</Button>
        </Link>
    )

    const logoutButton = (
        <Button className={classes.navButton} onClick={props.onLogoutButtonClicked}>Logout</Button>
    )

    const profileButton = (
        <Link
            to='/profile'
            style={{ textDecoration: 'none' }}>
            <Button className={classes.navButton}>Profile</Button>
        </Link>
    )

    const profileTextButton = (
        <div style={{ marginLeft: 10 }} onClick={props.onFleetRankMenuClicked}>
            <Typo className={classes.navText} variant='body1'>{props.fleet_display}</Typo>
            <Typo className={classes.navText} variant='body1'>{props.rank_display}</Typo>
        </div>
    )

    return (
        <div className={css.Navbar}>
            <Grid container direction='row' justify='space-between' alignItems='center'>
                <Grid>
                    {profileTextButton}
                </Grid>
                <Typo color='error' variant='subheading'>{inDevMode ? 'DEV MODE' : null}</Typo>
                <Grid>
                    {homeButton}
                    {props.isAuth ? profileButton : null}
                    {props.isAuth ? logoutButton : loginButton}
                </Grid>
            </Grid>
        </div>
    )
}

const stateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth,
        fleet_display: state.auth.fleet_display,
        rank_display: state.auth.rank_display,
    }
}

const dispatchToProps = (dispatch) => {
    return {
    }
}

export default withStyles(styles)(connect(stateToProps, dispatchToProps)(navbar));