import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid/Grid';
import Typo from '@material-ui/core/Typography/Typography';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import { withStyles } from '@material-ui/core/styles';

import { getFormattedValue, getFieldValidity } from '../../utility/UserDataForm/utility';
import { immUpdate } from '../../utility/immUpdate';
import cnst from '../../utility/UserDataForm/constant';
import * as actions from '../../store/action/action_auth';

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
    },
})

class resetPasswordPage extends Component {
    state = {
        email: '',
        email_isValid: false,
        email_error: '',
        email_isTouched: false,

        isSubmitted: false,
        message: '',
    }

    onFieldChange = (field, value) => {
        // get formatted value
        const value_formatted = getFormattedValue(field, value)
        const fieldValidity = getFieldValidity(field, value_formatted)

        // get new state that contain updated field value and validity
        let newState = immUpdate(this.state, {
            [field]: value_formatted,
            [field + '_isValid']: fieldValidity.isValid,
            [field + '_error']: fieldValidity.error,
            [field + '_isTouched']: true,
        })

        // update state
        this.setState(newState)
    }

    onResetSubmit = () => {
        if (this.state.email_isValid) {
            this.props.resetPassword(this.state.email)
            this.setState({
                message: 'Reset email has been sent to ' + this.state.email,
                isSubmitted: true,
            })
        }
    }

    render() {
        const { classes } = this.props;

        // main--------------
        return (
            <Grid container direction='column' justify='center' alignItems='center' className={classes.root}>
                <Grid container justify='center'>
                    <Typo variant='body1'>{this.props.message}</Typo>
                    <Typo variant='body1' className={classes.textField}>{this.state.message}</Typo>
                </Grid>

                <Grid item xs={10} container direction='column' alignItems='center' className={classes.main}>
                    <Typo variant='subheading' style={{marginBottom: 20}}>Password Reset</Typo>
                    <TextField
                        label='Login Email'
                        value={this.state.email}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => this.onFieldChange(cnst.EMAIL, event.target.value)}
                        error={!this.state.email_isValid && this.state.email_isTouched}
                        helperText={this.state.email_error}
                        className={classes.textField}
                    />

                    <Grid container justify='flex-end'>
                        <Button
                            onClick={this.onResetSubmit}
                            disabled={!this.state.email_isValid || this.state.isSubmitted}
                        >
                            OK
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

const stateToProps = (state) => {
    return {
        message: state.auth.message,
    }
}

const dispatchToProps = (dispatch) => {
    return {
        resetPassword: (email) => dispatch(actions.resetPassword(email)),
    }
}

export default withStyles(styles)(connect(stateToProps, dispatchToProps)(resetPasswordPage));