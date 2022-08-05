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

class changePasswordPage extends Component {
    state = {
        password_current: '',
        password_current_isValid: false,
        password_current_error: '',
        password_current_isTouched: false,

        password_new: '',
        password_new_isValid: false,
        password_new_error: '',
        password_new_isTouched: false,

        password_confirm: '',
        password_confirm_isValid: false,
        password_confirm_error: '',
        password_confirm_isTouched: false,

        form_isValid: false,
        isSubmitted: false,
        message: '',
    }

    onFieldChange = (field, value) => {
        // get formatted value
        const value_formatted = getFormattedValue(cnst.PASSWORD, value)
        const fieldValidity = getFieldValidity(cnst.PASSWORD, value_formatted)

        // get new state that contain updated field value and validity
        let newState = immUpdate(this.state, {
            [field]: value_formatted,
            [field + '_isValid']: fieldValidity.isValid,
            [field + '_error']: fieldValidity.error,
            [field + '_isTouched']: true,
        })

        // handle additional validitiy conditions
        switch (field) {
            case 'password_confirm':
                if (value_formatted !== newState.password_new) {
                    newState[field + '_isValid'] = false;
                    newState[field + '_error'] = 'must be identical to new password';
                }
                break;

            default:
                break;
        }

        newState.form_isValid =
            newState.password_current_isValid &&
            newState.password_new_isValid &&
            newState.password_confirm_isValid

        // update state
        this.setState(newState)
    }

    onSubmit = () => {
        if (this.state.form_isValid) {
            this.props.changePassword(this.props.email, this.state.password_current, this.state.password_new)
            this.setState({
                isSubmitted: true,
            })
        }
    }

    render() {
        const { classes } = this.props;

        // main--------------
        return (
            <Grid container direction='column' justify='center' alignItems='center' className={classes.root}>
                <Grid container direction='column' justify='center' alignItems='center'>
                    <Typo variant='body1' color='error'>{this.props.changePasswordError}</Typo>
                    <Typo variant='body1'>{this.props.changePasswordMessage}</Typo>
                </Grid>

                <Grid item xs={10} container direction='column' alignItems='center' className={classes.main}>
                    <TextField
                        label='Current Password'
                        type={cnst.PASSWORD}
                        value={this.state.password_current}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => this.onFieldChange('password_current', event.target.value)}
                        className={classes.textField}
                    />

                    <TextField
                        label='New Password'
                        type={cnst.PASSWORD}
                        value={this.state.password_new}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => this.onFieldChange('password_new', event.target.value)}
                        error={!this.state.password_new_isValid && this.state.password_new_isTouched}
                        helperText={this.state.password_new_error}
                        className={classes.textField}
                    />

                    <TextField
                        label='Confirm Password'
                        type={cnst.PASSWORD}
                        value={this.state.password_confirm}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => this.onFieldChange('password_confirm', event.target.value)}
                        error={!this.state.password_confirm_isValid && this.state.password_confirm_isTouched}
                        helperText={this.state.password_confirm_error}
                        className={classes.textField}
                    />

                    <Grid container justify='flex-end'>
                        <Button
                            onClick={this.onSubmit}
                            disabled={!this.state.form_isValid}
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
        changePasswordError: state.auth.changePasswordError,
        changePasswordMessage: state.auth.changePasswordMessage,
        email: state.auth.email,
    }
}

const dispatchToProps = (dispatch) => {
    return {
        changePassword: (email, password_current, password_new) => dispatch(actions.changePassword(email, password_current, password_new)),
    }
}

export default withStyles(styles)(connect(stateToProps, dispatchToProps)(changePasswordPage));