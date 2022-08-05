import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import Grid from '@material-ui/core/Grid/Grid';
import Typo from '@material-ui/core/Typography/Typography';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';

import TextSelect from '../../component/UI/Button/TextSelect/TextSelect';

import cnst from '../../utility/UserDataForm/constant';
import { getFormattedValue, getFieldValidity } from '../../utility/UserDataForm/utility';

import * as actions from '../../store/action/action_auth';

import { isNull } from 'util';
import { immUpdate } from '../../utility/immUpdate';

const styles = theme => ({
    root: {
        minHeight: '80vh',
    },
    main: {
        maxWidth: 400,
        padding: 15,
    },
    divider: {
        marginTop: 20,
        marginBottom: 15,
        width: '100%',
    },
    email_textField: {
        width: 250,
    }
})
const RANK_LIST = [cnst.SO, cnst.FO, cnst.CN];
const FLEET_LIST = [cnst.AIRBUS, cnst.B777, cnst.B747]

class profilePage extends Component {
    state = {
        firstName: this.props.firstName,
        lastName: this.props.lastName,
        rank: this.props.rank,
        fleet: this.props.fleet,
        rosterName: this.props.rosterName,
        fbUserName: this.props.fbUserName,
        contactEmail: this.props.contactEmail,
        mobile: this.props.mobile,
        contactByFb: this.props.fbUserName === '' ? false : true,
        contactByEmail: this.props.contactEmail === '' ? false : true,
        contactByMobile: this.props.mobile === '' ? false : true,

        firstName_isValid: true,
        lastName_isValid: true,
        rank_isValid: true,
        fleet_isValid: true,
        rosterName_isValid: true,
        fbUserName_isValid: true,
        contactEmail_isValid: true,
        mobile_isValid: true,
        contactByFb_isValid: true,
        contactByEmail_isValid: true,
        contactByMobile_isValid: true,

        firstName_isTouched: false,
        lastName_isTouched: false,
        rank_isTouched: false,
        fleet_isTouched: false,
        rosterName_isTouched: false,
        fbUserName_isTouched: false,
        contactEmail_isTouched: false,
        mobile_isTouched: false,
        contactByFb_isTouched: false,
        contactByEmail_isTouched: false,
        contactByMobile_isTouched: false,

        mail_error: '',
        password_error: '',
        confirmPassword_error: '',
        firstName_error: '',
        lastName_error: '',
        rank_error: '',
        fleet_error: '',
        rosterName_error: '',
        isCompanyCheck_error: '',
        fbUserName_error: '',
        contactEmail_error: '',
        mobile_error: '',
        contactByFb_error: '',
        contactByEmail_error: '',
        contactByMobile_error: '',

        formValid: false,
        isSubmitErrorOpened: true,
        displayedError: null,
    }

    componentWillUnmount() {
        this.props.updateUserDataInit();
    }

    // ------------------ Validation --------
    // validate the whole form, input: state object, output: validity
    _getFormValidity = (state) => {
        let formValid = true;

        // If no contact method, return false
        // (at least one must be true to validate)
        if (!(state.contactByFb || state.contactByEmail || state.contactByMobile)) {
            formValid = false;
            return formValid;
        }

        // check each validation keys, break loop when false key is found 
        // (form is valid if and only if all fields are valid)
        let fieldIsValid = true;
        for (let key in state) {
            if (key.includes('_isValid')) {
                fieldIsValid = state[key];
                if (!fieldIsValid) {
                    formValid = false;
                    return formValid;
                }
            }
        }
        return formValid;
    }

    // ----------------------------------------------

    //------------- Handler -----
    // post signup data
    onSubmitHandler = (event) => {
        event.preventDefault();

        // public user profile
        const profileData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            rank: this.state.rank,
            fleet: this.state.fleet,
            rosterName: this.state.rosterName,

            fbUserName: this.state.contactByFb ? this.state.fbUserName : '',
            contactEmail: this.state.contactByEmail ? this.state.contactEmail : '',
            mobile: this.state.contactByMobile ? this.state.mobile : '',
        }

        // private user data
        const userData = {
            ...profileData,
            email: this.props.email,
            emailVerified: this.props.emailVerified,
        }

        // update user data
        this.props.updateUserData(this.props.token, this.props.userID, profileData, userData);
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

        // handle contact method change, if method unchecked then adjust corresponding field attributes
        switch (field) {
            case cnst.CONTACT_BY_FB:
                if (value_formatted === false) {
                    newState.fbUserName = '';
                    newState.fbUserName_isValid = true;
                } else {
                    newState.fbUserName_isValid = false;
                }
                break;

            case cnst.CONTACT_BY_EMAIL:
                if (value_formatted === false) {
                    newState.contactEmail = '';
                    newState.contactEmail_isValid = true;
                } else {
                    // copy login email as default
                    newState.contactEmail = this.props.email;
                    newState.contactEmail_isValid = true;
                }
                break;

            case cnst.CONTACT_BY_MOBILE:
                if (value_formatted === false) {
                    newState.mobile = '';
                    newState.mobile_isValid = true;
                } else {
                    newState.mobile_isValid = false;
                }
                break;

            default:
                break;
        }

        // get form validity
        newState.formValid = this._getFormValidity(newState);

        // update state
        this.setState(newState)
    }
    // -----------------------------------------------

    render() {
        const { classes } = this.props;

        // --------- Dynamic component ---------
        // generate TextField with handler and validity check
        const _TextField = (label, field, type = '', style = '') => {
            return (
                <TextField
                    label={label}
                    type={type}
                    value={this.state[field]}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event) => this.onFieldChange(field, event.target.value)}
                    error={
                        this.state[field + '_isTouched'] &&
                        !this.state[field + '_isValid']
                    }
                    helperText={this.state[field + '_error']}
                    className={style}
                />
            )
        }

        // TextSelect for listed selection input
        const _TextSelect = (label, list, field) => {
            return (
                <TextSelect
                    label={label}
                    value={this.state[field]}
                    items={list}
                    onChange={(event) => this.onFieldChange(field, event.target.value)}
                    error={
                        this.state[field + '_isTouched'] &&
                        !this.state[field + '_isValid']
                    }
                />
            )
        }
        // ----------------------------------------------------
        let redirect = null;
        if (this.props.userDataUpdated) {
            redirect = <Redirect to='/' />
        }

        return (
            <Grid container direction='column' justify='center' alignItems='center' className={classes.root}>
                {redirect}
                <Grid container direction='column' alignItems='flex-start' className={classes.main}>
                    {/* error message */}
                    <Grid container justify='center'>
                        <Typo variant='body1' color='error'>{this.props.userDataUpdateError}</Typo>
                        {/* if error is not null AND is not displayed, open error dialog */}
                        <Dialog
                            open={!isNull(this.props.userDataUpdateError) && this.state.displayedError !== this.props.userDataUpdateError}
                            onClose={() => { this.setState({ displayedError: this.props.userDataUpdateError }) }}
                        >
                            <DialogContent>{this.props.userDataUpdateError}</DialogContent>
                            <DialogActions><Button onClick={() => { this.setState({ displayedError: this.props.userDataUpdateError }) }}>OK</Button></DialogActions>
                        </Dialog>
                    </Grid>

                    {/* Login details */}
                    <Typo variant='body2'>Login Detail:</Typo>
                    <Typo variant='caption'>{this.props.email}</Typo>
                    <Link to='/change_password'>
                        <Typo variant='caption'>Change password</Typo>
                    </Link>
                    <Divider variant='middle' className={classes.divider} />

                    {/* main entry */}
                    {_TextField('First Name', cnst.FIRST_NAME)}
                    {_TextField('Last Name', cnst.LAST_NAME)}
                    <Grid container direction='row'>
                        {_TextSelect('Rank', RANK_LIST, cnst.RANK)}
                        {_TextSelect('Fleet', FLEET_LIST, cnst.FLEET)}
                    </Grid>
                    {_TextField('Roster Name', cnst.ROSTER_NAME)}

                    {/* contact methods  */}
                    <Divider variant='middle' className={classes.divider} />
                    <Typo variant='body2'>Contact method (choose at least one):</Typo>
                    <FormControlLabel
                        label='Facebook'
                        control={
                            <CheckBox
                                checked={this.state.contactByFb}
                                onChange={(event) => this.onFieldChange(cnst.CONTACT_BY_FB, event.target.checked)}
                                color='primary'
                            />
                        }
                    />
                    {this.state.contactByFb ?
                        <div>
                            {_TextField('Facebook User Name', cnst.FB_USERNAME)}
                            <Typo variant='caption'>Steps to obtain your Facebook user name: </Typo>
                            <Typo variant='caption'>1) Go to Facebook</Typo>
                            <Typo variant='caption'>2) Click on your name (top right)</Typo>
                            <Typo variant='caption'>3) The address is now www.facebook.com/xxxx, where xxxx is your user name</Typo>
                        </div>
                        : null}

                    <FormControlLabel
                        label='Email'
                        control={
                            <CheckBox
                                checked={this.state.contactByEmail}
                                onChange={(event) => this.onFieldChange(cnst.CONTACT_BY_EMAIL, event.target.checked)}
                                color='primary'
                            />
                        }
                    />
                    {this.state.contactByEmail ?
                        <div>
                            {_TextField('Contact Email', cnst.CONTACT_EMAIL, '', classes.email_textField)}
                            <Typo variant='caption'>Contact email can be different from login email</Typo>
                        </div>
                        : null}

                    <FormControlLabel
                        label='Whatsapp'
                        control={
                            <CheckBox
                                checked={this.state.contactByMobile}
                                onChange={(event) => this.onFieldChange(cnst.CONTACT_BY_MOBILE, event.target.checked)}
                                color='primary'
                            />
                        }
                    />
                    {this.state.contactByMobile ?
                        <div>
                            {_TextField('Whatsapp', cnst.MOBILE)}
                            <Typo variant='caption'>Whatsapp's mobile number should include country code</Typo>
                            <Typo variant='caption'>e.g. HKG number (+852 9876 5432) should be entered as 85298765432</Typo>
                        </div>
                        : null}

                    <Grid container justify='flex-end'>
                        <Link to='/' style={{ textDecoration: 'none' }}>
                            <Button>Cancel</Button>
                        </Link>
                        <Button onClick={(event) => this.onSubmitHandler(event)} disabled={!this.state.formValid}>Save changes</Button>
                    </Grid>
                </Grid>


            </Grid>
        )

    }

}

const stateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth,
        token: state.auth.token,
        userID: state.auth.userID,
        userDataUpdated: state.auth.userDataUpdated,
        userDataUpdateError: state.auth.userDataUpdateError,

        email: state.auth.email,
        firstName: state.auth.firstName,
        lastName: state.auth.lastName,
        rank: state.auth.rank,
        fleet: state.auth.fleet,
        rosterName: state.auth.rosterName,
        fbUserName: state.auth.fbUserName,
        contactEmail: state.auth.contactEmail,
        mobile: state.auth.mobile,

        emailVerified: state.auth.emailVerified,
    }
}

const dispatchToProps = (dispatch) => {
    return {
        //** update user data
        updateUserData: (token, userID, profileData, userData) => dispatch(actions.updateUserData(token, userID, profileData, userData)),
        updateUserDataInit: () => dispatch(actions.updateUserDataInit()),
    }
}

export default withStyles(styles)(connect(stateToProps, dispatchToProps)(profilePage));