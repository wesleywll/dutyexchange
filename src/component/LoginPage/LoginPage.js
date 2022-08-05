import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid/Grid';
import Typo from '@material-ui/core/Typography/Typography';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        minHeight: '80vh',
    },

    main: {
        padding: 20,
        maxWidth: 400,
    },

    textField: {
        width: 200,
    }
})

const loginPage = (props) => {
    const { classes } = props;

    // main--------------
    return (
        <Grid container direction='column' justify='center' alignItems='center' className={classes.root}>
            <Grid container justify='center'>
                <Typo variant='title' style={{ marginBottom: 20 }}>Duty Exchange</Typo>
            </Grid>

            <Grid container justify='center'>
                <Typo variant='body1' color='error'>{props.error}</Typo>
            </Grid>

            <Grid item xs={10} container direction='column' alignItems='center' className={classes.main}>
                <TextField
                    label='Email'
                    value={props.email}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event) => props.onFieldChange('email', event.target.value)}
                    className={classes.textField}
                />

                <TextField
                    label='Password'
                    type='password'
                    value={props.password}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event) => props.onFieldChange('password', event.target.value)}
                    className={classes.textField}
                />
                <Link to='/reset_password'>
                    <Typo variant='caption'>forgot my password</Typo>
                </Link>

                <Grid container justify='flex-end'>
                    <Button onClick={props.onLoginSubmit}>OK</Button>
                </Grid>

                <Grid container direction='row' justify='center'>
                    {/* show signup link if not already signup */}
                    {props.isSignup ? null :
                        <Link to='/signup'>
                            <Typo variant='caption'>SIGN UP</Typo>
                        </Link>
                    }
                </Grid>
            </Grid>



        </Grid>
    )

}

const stateToProps = (state) => {
    return {
        isSignup: state.auth.isSignup,
        error: state.auth.error,
    }
}

export default withStyles(styles)(connect(stateToProps, null)(loginPage));