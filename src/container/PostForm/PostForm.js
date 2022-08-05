// Input form for filling in post details
import React, { Component } from 'react';
import Moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

import cnst from '../../utility/PostForm/constant';
import { getFieldValidity, getFormattedValue } from '../../utility/PostForm/utility';
import { immUpdate } from '../../utility/immUpdate';

import TextSelect from '../../component/UI/Button/TextSelect/TextSelect';
import GroupedMultiSelect from '../../component/UI/GroupedMultiSelect/GroupedMultiSelect';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typo from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import Airports from '../../data/Airports';
import getPlaneTypeArray from '../../data/Aircrafts';

import * as firebase from 'firebase';

import { connect } from 'react-redux';

// constants
const inputType = {
    TIME: 'time',
    DATE: 'date',
}

const PortDatabase = new Airports();
const REGION_LIST = PortDatabase.getRegionList();
const GROUPED_PORT_LIST = PortDatabase.getGroupedPortList();
const GROUPED_REGION_LIST = { Region: REGION_LIST };
const CURRENT_DATE = Moment().format('YYYY-MM-DD');
const OFFER_TYPE_LIST = [cnst.SWAP, cnst.PROFFER];
const DUTY_TYPE_LIST = [cnst.FLIGHT, cnst.SIM, cnst.RESERVE, cnst.OTHERS, cnst.GDAY];

const PORT_RANGE_LIST = [cnst.PORTS, cnst.REGIONS];

const DEFAULT_STATE = {
    offer_offerType: cnst.SWAP,
    offer_dutyType: cnst.FLIGHT,
    offer_rosterCode: '',
    offer_flightCode: [],
    offer_startDate: CURRENT_DATE,
    offer_signOnTime: "23:55", // default minute must align with selection step (e.g. 00, 05 for 5 minutes step)
    offer_endDate: CURRENT_DATE,
    offer_planeType: [cnst.A330],
    request_dutyType: cnst.FLIGHT,
    request_rosterCode: '',
    request_flightCode: [cnst.ANY],
    request_regionCode: [cnst.ANY],
    request_startDate: CURRENT_DATE,
    request_endDate: CURRENT_DATE,
    request_portRange: cnst.PORTS,
    request_planeType: [cnst.A330, cnst.A350],

    offer_offerType_isValid: true,
    offer_dutyType_isValid: true,
    offer_rosterCode_isValid: false,
    offer_flightCode_isValid: false,
    offer_startDate_isValid: true,
    offer_signOnTime_isValid: true,
    offer_endDate_isValid: true,
    offer_planeType_isValid: true,
    request_dutyType_isValid: true,
    request_rosterCode_isValid: false,
    request_flightCode_isValid: true,
    request_regionCode_isValid: true,
    request_startDate_isValid: true,
    request_endDate_isValid: true,
    request_portRange_isValid: true,
    request_planeType_isValid: true,

    offer_offerType_isTouched: false,
    offer_dutyType_isTouched: false,
    offer_rosterCode_isTouched: false,
    offer_flightCode_isTouched: false,
    offer_startDate_isTouched: false,
    offer_signOnTime_isTouched: false,
    offer_endDate_isTouched: false,
    offer_planeType_isTouched: false,
    request_dutyType_isTouched: false,
    request_rosterCode_isTouched: false,
    request_flightCode_isTouched: false,
    request_regionCode_isTouched: false,
    request_startDate_isTouched: false,
    request_endDate_isTouched: false,
    request_portRange_isTouched: false,
    request_planeType_isTouched: false,

    offer_offerType_error: '',
    offer_dutyType_error: '',
    offer_rosterCode_error: '',
    offer_flightCode_error: '',
    offer_startDate_error: '',
    offer_signOnTime_error: '',
    offer_endDate_error: '',
    offer_planeType_error: '',
    request_dutyType_error: '',
    request_rosterCode_error: '',
    request_flightCode_error: '',
    request_regionCode_error: '',
    request_startDate_error: '',
    request_endDate_error: '',
    request_portRange_error: '',
    request_planeType_error: '',

    remark: '',

    formValid: false,
    isSubmitErrorOpened: true,
    displayedError: null,
}

const styles = theme => ({
    modal: {
        overflow: 'scroll',
    },

    postForm: {
        zIndex: 110,
        outline: 'none',
    },
    paper: {
        marginTop: 20,
        maxWidth: 350,
        width: '100%',
        padding: 10,
    },
    dateField: {
        width: 140,
        fontSize: 15,
    },
    timeField: {
        width: 100,
        fontSize: 15,
    },
    rosterSingleField: {
        width: 100,
    },
    rosterMultiField: {
        marginTop: 10,
    },
    divider: {
        marginTop: 12,
        marginBottom: 12,
    },
    footer: {
        marginTop: 20,
    },
})
let OFFER_PLANE_LIST = [];
let REQUEST_PLANE_LIST = [];

class postForm extends Component {
    // ============= Initialization ================
    componentWillMount() {
        // initialize fleet specific settings
        switch (this.props.fleet) {
            case cnst.FLEET_AIRBUS:
                OFFER_PLANE_LIST = [cnst.A330, cnst.A350];
                REQUEST_PLANE_LIST = [cnst.AIRBUS, cnst.A330, cnst.A350];
                DEFAULT_STATE.offer_planeType = cnst.A330;
                DEFAULT_STATE.request_planeType = cnst.AIRBUS;
                break;
            case cnst.FLEET_B777:
                OFFER_PLANE_LIST = [cnst.B777];
                REQUEST_PLANE_LIST = [cnst.B777];
                DEFAULT_STATE.offer_planeType = cnst.B777;
                DEFAULT_STATE.request_planeType = cnst.B777;
                break;
            case cnst.FLEET_B747:
                OFFER_PLANE_LIST = [cnst.B747];
                REQUEST_PLANE_LIST = [cnst.B747];
                DEFAULT_STATE.offer_planeType = cnst.B747;
                DEFAULT_STATE.request_planeType = cnst.B747;
                break;
            default:
                console.log('Invalid fleet');
                break;
        }
        this.setState(cloneDeep(DEFAULT_STATE));
    }

    // ------------------ Validation ----------------
    // validate the whole form, input: state object, output: validity
    _getFormValidity = (state) => {
        let formValid = true;

        // ---- extract state validity for form check
        // collect common validities
        let checkState = {
            offer_offerType_isValid: state.offer_offerType_isValid,
            offer_dutyType_isValid: state.offer_dutyType_isValid,
            offer_startDate_isValid: state.offer_startDate_isValid,
            offer_signOnTime_isValid: state.offer_signOnTime_isValid,
            offer_endDate_isValid: state.offer_endDate_isValid,
        }

        // collect conditional validities
        // --- roster code
        let offer_roster_isValid = false;
        switch (state.offer_dutyType) {
            case cnst.FLIGHT:
                offer_roster_isValid = state.offer_flightCode_isValid;
                break;

            case cnst.SIM:
            case cnst.OTHERS:
                offer_roster_isValid = state.offer_rosterCode_isValid;
                break;

            case cnst.GDAY:
            case cnst.RESERVE:
                offer_roster_isValid = true;
                break;

            default:
                console.log('invalid duty type')
                break;
        }

        checkState = {
            ...checkState,
            offer_roster_isValid: offer_roster_isValid,
        }

        // --- plane type and port range
        switch (state.offer_dutyType) {
            case cnst.FLIGHT:
            case cnst.SIM:
                checkState = {
                    ...checkState,
                    offer_planeType_isValid: state.offer_planeType_isValid,
                }
                break;

            case cnst.GDAY:
            case cnst.RESERVE:
            case cnst.OTHERS:
                break;

            default:
                console.log('invalid duty type')
                break;
        }


        // --------------------- REQUEST -----------------
        if (state.offer_offerType === cnst.PROFFER) {
            // if proffer, no request state is checked
        } else {
            // collect common validities
            checkState = {
                ...checkState,
                request_dutyType_isValid: state.request_dutyType_isValid,
                request_startDate_isValid: state.request_startDate_isValid,
                request_endDate_isValid: state.request_endDate_isValid,
            }

            // collect conditional validities
            // --- roster code
            let request_roster_isValid = false;
            switch (state.request_dutyType) {
                case cnst.FLIGHT:
                    switch (state.request_portRange) {
                        case cnst.PORTS:
                            request_roster_isValid = state.request_flightCode_isValid;
                            break;

                        case cnst.REGIONS:
                            request_roster_isValid = state.request_regionCode_isValid;
                            break;

                        default:
                            console.log('invalid port range')
                            break;
                    }
                    break;

                case cnst.SIM:
                case cnst.OTHERS:
                    request_roster_isValid = state.request_rosterCode_isValid;
                    break;

                case cnst.GDAY:
                case cnst.RESERVE:
                    request_roster_isValid = true;
                    break;

                default:
                    console.log('invalid duty type')
                    break;
            }

            checkState = {
                ...checkState,
                request_roster_isValid: request_roster_isValid,
            }

            // --- plane type and port range
            switch (state.request_dutyType) {
                case cnst.FLIGHT:
                    checkState = {
                        ...checkState,
                        request_planeType_isValid: state.request_planeType_isValid,
                        request_portRange_isValid: state.request_portRange_isValid,
                    }
                    break;

                case cnst.SIM:
                    checkState = {
                        ...checkState,
                        request_planeType_isValid: state.request_planeType_isValid,
                    }
                    break;

                case cnst.OTHERS:
                case cnst.GDAY:
                case cnst.RESERVE:
                    break;


                default:
                    console.log('invalid duty type')
                    break;
            }

        }

        // check each validation keys, break loop when false key is found 
        // (form is valid if and only if all fields are valid)
        let fieldIsValid = true;
        for (let key in checkState) {
            if (key.includes('_isValid')) {
                fieldIsValid = checkState[key];
                if (!fieldIsValid) {
                    formValid = false;
                    return formValid;
                }
            }
        }
        return formValid;
    }

    // ------------------- Handler ---------------------------
    onMultiSelectDeleteItem = (field, deleteItem) => {
        const itemList = [...this.state[field]];
        itemList.splice(itemList.indexOf(deleteItem), 1);
        if (itemList.length === 0) {
            // if list is empty, push in ANY
            itemList.push(cnst.ANY)
        }
        this.setState({ [field]: itemList })
    }

    onFieldChange = (field, value) => {
        // get formatted value
        const value_formatted = getFormattedValue(field, value);
        const fieldValidity = getFieldValidity(field, value_formatted);

        // get new state that contain updated field value and validity
        let newState = immUpdate(this.state, {
            [field]: value_formatted,
            [field + '_isValid']: fieldValidity.isValid,
            [field + '_error']: fieldValidity.error,
            [field + '_isTouched']: true,
        })


        // handle state-dependent validities if first check is passed
        if (fieldValidity.isValid) {
            // if first check passed, run addition check, else keep invalid flag
            switch (field) {
                case cnst.OFFER_START_DATE:
                    // check if start and end dates are illogical
                    if (Moment(value_formatted).isAfter(Moment(this.state.offer_endDate), 'day')) {
                        newState.offer_startDate_isValid = false;
                        newState.offer_startDate_error = 'start date must be on or before end date';
                        newState.offer_endDate_isValid = false;
                        newState.offer_endDate_error = 'end date must be after start date';
                    } else {
                        // if logical, recheck date partner
                        const datePartner = getFormattedValue(cnst.OFFER_END_DATE, this.state.offer_endDate);
                        const datePartnerValidity = getFieldValidity(cnst.OFFER_END_DATE, datePartner);
                        newState.offer_endDate_isValid = datePartnerValidity.isValid;
                        newState.offer_endDate_error = datePartnerValidity.error;
                    }

                    // check sign on time if already valid, to account for date change
                    const time = getFormattedValue(cnst.SIGN_ON_TIME, this.state.offer_signOnTime);
                    const timeValidity = getFieldValidity(cnst.SIGN_ON_TIME, time);
                    if (timeValidity.isValid) {
                        newState.offer_signOnTime_isValid = !Moment(newState.offer_startDate + ' ' + newState.offer_signOnTime).isBefore(Moment());
                        newState.offer_signOnTime_error = newState.offer_signOnTime_isValid ? '' : 'time passed';
                    }
                    break;

                case cnst.OFFER_END_DATE:
                    // check if start and end dates are logical
                    if (Moment(value_formatted).isBefore(Moment(newState.offer_startDate), 'day')) {
                        newState.offer_endDate_isValid = false;
                        newState.offer_endDate_error = 'end date must be after start date';
                        newState.offer_startDate_isValid = false;
                        newState.offer_startDate_error = 'start date must be on or before end date';
                    } else {
                        // if logical, recheck date partner
                        const datePartner = getFormattedValue(cnst.OFFER_START_DATE, this.state.offer_startDate);
                        const datePartnerValidity = getFieldValidity(cnst.OFFER_START_DATE, datePartner);
                        newState.offer_startDate_isValid = datePartnerValidity.isValid;
                        newState.offer_startDate_error = datePartnerValidity.error;
                    }
                    break;

                case cnst.OFFER_SIGN_ON_TIME:
                    newState.offer_signOnTime_isValid = !Moment(newState.offer_startDate + ' ' + value_formatted).isBefore(Moment());
                    newState.offer_signOnTime_error = newState.offer_signOnTime_isValid ? '' : 'time passed';
                    break;

                case cnst.REQUEST_START_DATE:
                    // check if start and end dates are logical
                    if (Moment(value_formatted).isAfter(Moment(this.state.request_endDate), 'day')) {
                        newState.request_startDate_isValid = false;
                        newState.request_startDate_error = 'start date must be on or before end date';
                        newState.request_endDate_isValid = false;
                        newState.request_endDate_error = 'end date must be after start date';
                    } else {
                        // if logical, recheck date partner
                        const datePartner = getFormattedValue(cnst.REQUEST_END_DATE, this.state.request_endDate);
                        const datePartnerValidity = getFieldValidity(cnst.REQUEST_END_DATE, datePartner);
                        newState.request_endDate_isValid = datePartnerValidity.isValid;
                        newState.request_endDate_error = datePartnerValidity.error;
                    }
                    break;

                case cnst.REQUEST_END_DATE:
                    // check if start and end dates are logical
                    if (Moment(value_formatted).isBefore(Moment(this.state.request_startDate), 'day')) {
                        newState.request_endDate_isValid = false;
                        newState.request_endDate_error = 'end date must be after start date';
                        newState.request_startDate_isValid = false;
                        newState.request_startDate_error = 'start date must be on or before end date';
                    } else {
                        // if logical, recheck date partner
                        const datePartner = getFormattedValue(cnst.REQUEST_START_DATE, this.state.request_startDate);
                        const datePartnerValidity = getFieldValidity(cnst.REQUEST_START_DATE, datePartner);
                        newState.request_startDate_isValid = datePartnerValidity.isValid;
                        newState.request_startDate_error = datePartnerValidity.error;
                    }
                    break;

                default:
                    break;
            }
        }

        // after all validation, get form validity
        newState.formValid = this._getFormValidity(newState);

        // update state
        this.setState(newState)
    }

    // reset current state to default
    onResetClicked = () => {
        console.log('reset');
        this.setState(DEFAULT_STATE);
    }

    // submittion command recieved
    onConfirmed = () => {
        console.log('submittion recieved')
        if (this.state.formValid) {
            // get placeholder for firebase timestamp
            const timestamp = firebase.database.ServerValue.TIMESTAMP;

            // ====================== offer =======================
            // collect common data
            let offer = {
                [cnst.OFFER_TYPE]: this.state.offer_offerType,
                [cnst.DUTY_TYPE]: this.state.offer_dutyType,
                [cnst.START_DATE]: this.state.offer_startDate,
                [cnst.END_DATE]: this.state.offer_endDate,
            }

            // collect conditional data
            switch (this.state.offer_dutyType) {
                case cnst.FLIGHT:
                    offer = {
                        ...offer,
                        [cnst.FLIGHT_CODE]: this.state.offer_flightCode,
                        [cnst.SIGN_ON_TIME]: this.state.offer_signOnTime,
                        [cnst.PLANE_TYPE]: getPlaneTypeArray(this.state.offer_planeType),
                    };
                    break;

                case cnst.SIM:
                    offer = {
                        ...offer,
                        [cnst.ROSTER_CODE]: this.state.offer_rosterCode,
                        [cnst.SIGN_ON_TIME]: this.state.offer_signOnTime,
                        [cnst.PLANE_TYPE]: getPlaneTypeArray(this.state.offer_planeType),
                    };
                    break;

                case cnst.OTHERS:
                    offer = {
                        ...offer,
                        [cnst.ROSTER_CODE]: this.state.offer_rosterCode,
                        [cnst.SIGN_ON_TIME]: this.state.offer_signOnTime,
                    };
                    break;

                case cnst.GDAY:
                    break;

                default:
                    break;
            }

            // ====================== request =======================
            let request = {};
            if (this.state.offer_offerType === cnst.PROFFER) {
                // request default to GDays
                request = {
                    [cnst.DUTY_TYPE]: cnst.GDAY,
                    [cnst.START_DATE]: this.state.offer_startDate,
                    [cnst.END_DATE]: this.state.offer_endDate,
                }
            } else {
                // collect common data
                request = {
                    [cnst.DUTY_TYPE]: this.state.request_dutyType,
                    [cnst.START_DATE]: this.state.request_startDate,
                    [cnst.END_DATE]: this.state.request_endDate,

                }

                // collect conditional data
                switch (this.state.request_dutyType) {
                    case cnst.FLIGHT:
                        switch (this.state.request_portRange) {
                            case cnst.PORTS:
                                request = {
                                    ...request,
                                    [cnst.FLIGHT_CODE]: this.state.request_flightCode,
                                    [cnst.PORT_RANGE]: this.state.request_portRange,
                                    [cnst.PLANE_TYPE]: getPlaneTypeArray(this.state.request_planeType),
                                };
                                break;

                            case cnst.REGIONS:
                                // if region is ANY, then it is the same as ANY flight
                                if (this.state.request_regionCode.includes(cnst.ANY)) {
                                    request = {
                                        ...request,
                                        [cnst.PORT_RANGE]: cnst.PORTS,
                                        [cnst.FLIGHT_CODE]: [cnst.ANY],
                                        [cnst.PLANE_TYPE]: getPlaneTypeArray(this.state.request_planeType),
                                    }

                                } else {
                                    // if port range is region, add flight codes by selected regions
                                    let flightCode = [];
                                    for (let region of this.state.request_regionCode) {
                                        flightCode = flightCode.concat(PortDatabase.getPortListByRegion(region));
                                    }

                                    request = {
                                        ...request,
                                        [cnst.PORT_RANGE]: this.state.request_portRange,
                                        [cnst.REGION_CODE]: this.state.request_regionCode,
                                        [cnst.FLIGHT_CODE]: flightCode,
                                        [cnst.PLANE_TYPE]: getPlaneTypeArray(this.state.request_planeType),
                                    }
                                }
                                break;

                            default:
                                console.log('invalid port range');
                                break;
                        }
                        break;

                    case cnst.SIM:
                        request = {
                            ...request,
                            [cnst.ROSTER_CODE]: this.state.request_rosterCode,
                            [cnst.PLANE_TYPE]: getPlaneTypeArray(this.state.request_planeType),
                        }
                        break;

                    case cnst.OTHERS:
                        request = {
                            ...request,
                            [cnst.ROSTER_CODE]: this.state.request_rosterCode,
                        };
                        break;

                    case cnst.GDAY:
                        // override start and end dates to offer's
                        request ={
                            ...request,
                            [cnst.START_DATE]: this.state.offer_startDate,
                            [cnst.END_DATE]: this.state.offer_endDate,
                        }
                        break;

                    case cnst.RESERVE:
                        break;

                    default:
                        console.log('invalid duty type');
                        break;
                }
            }
            //----------------------------------------------------

            const data = {
                offer: offer,
                request: request,
                remark: this.state.remark,
                pub_date: timestamp,
                userID: this.props.userID,
                rank: this.props.rank,
                filter_key: [this.props.fleet, this.props.rank, this.state.offer_startDate].join('_'), // combined for sorting
            }

            // push data and trigger onConfirmHandler from parent
            this.props.onConfirmed_pushData(data)
            console.log(data)

        } else {
            console.log('form invalid')
        }
    }
    // --------------------/Handler -----------------------

    render() {
        // MUI classes
        const { classes } = this.props;
        //-------------------- Input components -----------------
        // generate TextField with handler and validity check
        const _TextField = (field, label = '', type = '', className = '', inputProps = {}) => {
            let fieldValue = this.state[field];
            // convert array to string for display
            switch (typeof (fieldValue)) {
                case 'object':
                    if (fieldValue.length > 1) {
                        fieldValue = fieldValue.join('/');
                    } else {
                        fieldValue = fieldValue.toString();
                    }
                    break;

                default:
                    break;
            }

            return (
                <TextField
                    label={label}
                    type={type}
                    value={fieldValue}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event) => this.onFieldChange(field, event.target.value)}
                    error={
                        this.state[field + '_isTouched'] &&
                        !this.state[field + '_isValid']
                    }
                    inputProps={inputProps}
                    className={className}
                    helperText={this.state[field + '_error']}
                />
            )
        }

        // TextSelect for listed selection input
        const _TextSelect = (field, list, label = '', className = '') => {
            let fieldValue = this.state[field];
            // convert array to string for display
            switch (typeof (fieldValue)) {
                case 'object':
                    if (fieldValue.length > 1) {
                        fieldValue = fieldValue.join('/');
                    } else {
                        fieldValue = fieldValue.toString();
                    }
                    break;

                default:
                    break;
            }
            return (
                <TextSelect
                    label={label}
                    value={fieldValue}
                    items={list}
                    onChange={(event) => this.onFieldChange(field, event.target.value)}
                    error={
                        this.state[field + '_isTouched'] &&
                        !this.state[field + '_isValid']
                    }
                    className={className}
                />
            )
        }

        // Grouped MultiSelect for ports and regions
        // Input must be an object of {x:[1,2,3]}
        const _GroupedMultiSelect = (field, groupedList, singleSelection = false, ) => {
            let fieldValue = this.state[field];
            return (
                <GroupedMultiSelect
                    groupedItemList={groupedList}
                    selectedItems={fieldValue}
                    onSelectionChanged={(selection) => this.onFieldChange(field, selection)}
                    singleSelection={singleSelection}
                />
            )
        }

        // Dynamic roster code input
        const _OfferRosterCodeInput = () => {
            switch (this.state.offer_dutyType) {
                case cnst.FLIGHT:
                    return (_GroupedMultiSelect(cnst.OFFER_FLIGHT_CODE, GROUPED_PORT_LIST, true));

                case cnst.SIM:
                case cnst.OTHERS:
                    return (_TextField(cnst.OFFER_ROSTER_CODE, 'Roster Code'));

                case cnst.GDAY:
                case cnst.RESERVE:
                    return null;

                default:
                    return null;
            }
        }

        const _RequestRosterCodeInput = () => {
            switch (this.state.request_dutyType) {
                case cnst.FLIGHT:
                    switch (this.state.request_portRange) {
                        case cnst.PORTS:
                            return (
                                <Grid container direction='row' justify='flex-start' alignItems='flex-end'>
                                    {_TextSelect(cnst.REQUEST_PORT_RANGE, PORT_RANGE_LIST)}
                                    {_GroupedMultiSelect(cnst.REQUEST_FLIGHT_CODE, GROUPED_PORT_LIST, false)}
                                </Grid>
                            );

                        case cnst.REGIONS:
                            return (
                                <Grid container direction='row' justify='flex-start' alignItems='flex-end'>
                                    {_TextSelect(cnst.REQUEST_PORT_RANGE, PORT_RANGE_LIST)}
                                    {_GroupedMultiSelect(cnst.REQUEST_REGION_CODE, GROUPED_REGION_LIST, false)}
                                </Grid>
                            );

                        default:
                            console.log('invalid port range');
                            break;

                    }
                    break;

                case cnst.SIM:
                case cnst.OTHERS:
                    return (_TextField(cnst.REQUEST_ROSTER_CODE, 'Roster Code'));

                case cnst.RESERVE:
                case cnst.GDAY:
                    return null;

                default:
                    return null;
            }
        }

        //-------------------- /Input components -----------------

        return (
            <Modal
                open={this.props.show}
                className={classes.modal}
                onClose={this.props.onCancelled}
            >
                <Grid container direction='column' justify='flex-start' alignItems='center' className={classes.postForm}>
                    <Paper className={classes.paper}>
                        <Typo variant='title' align='center'>New Post</Typo>

                        {/* ----------------------- OFFER ----------------------- */}
                        <Grid item xs={10} container direction='column' alignItems='flex-start'>
                            <Typo variant='subheading' align='center'>Offer</Typo>
                            {/* line 1 */}
                            <Grid container direction='row' justify='flex-start' alignItems='baseline'>
                                {_TextSelect(cnst.OFFER_OFFER_TYPE, OFFER_TYPE_LIST)}
                                {_TextSelect(cnst.OFFER_DUTY_TYPE, DUTY_TYPE_LIST)}
                                {(this.state.offer_dutyType === cnst.FLIGHT || this.state.offer_dutyType === cnst.SIM) ?
                                    _TextSelect(cnst.OFFER_PLANE_TYPE, OFFER_PLANE_LIST) : null}
                            </Grid>

                            {/* line 2 */}
                            <Grid container direction='row' justify='flex-start' alignItems='baseline'>
                                {_OfferRosterCodeInput()}
                            </Grid>

                            {/* line 3 */}
                            <Grid container direction='row' justify='flex-start' alignItems='baseline'>
                                {_TextField(cnst.OFFER_START_DATE, 'From', inputType.DATE, classes.dateField)}
                                {this.state.offer_dutyType === cnst.GDAY || this.state.offer_dutyType === cnst.RESERVE ? null :
                                    _TextField(cnst.OFFER_SIGN_ON_TIME, 'Sign On', inputType.TIME, classes.timeField, { step: 300 })
                                }
                                {/*Note: step 300 = 5 mins */}
                            </Grid>

                            {/* line 4 */}
                            <Grid container direction='row' justify='flex-start' alignItems='baseline'>
                                {_TextField(cnst.OFFER_END_DATE, 'To', inputType.DATE, classes.dateField)}
                            </Grid>

                        </Grid>

                        {/* ----------------------- REQUEST ----------------------- */}
                        {this.state.offer_offerType === cnst.PROFFER ? null :
                            // if proffer, no request form
                            <div>
                                <Divider variant='middle' className={classes.divider} />

                                {/* Request */}
                                <Grid item xs={10} container direction='column' alignItems='flex-start'>
                                    <Typo variant='subheading' align='center'>Request</Typo>
                                    {/* line 1 */}
                                    <Grid container direction='row' justify='flex-start' alignItems='baseline'>
                                        {_TextSelect(cnst.REQUEST_DUTY_TYPE, DUTY_TYPE_LIST)}
                                        {(this.state.request_dutyType === cnst.FLIGHT || this.state.request_dutyType === cnst.SIM) ?
                                            _TextSelect(cnst.REQUEST_PLANE_TYPE, REQUEST_PLANE_LIST) : null}
                                    </Grid>

                                    {/* line 2 */}
                                    <Grid container direction='row' justify='flex-start' alignItems='baseline'>
                                        {_RequestRosterCodeInput()}
                                    </Grid>

                                    {this.state.request_dutyType === cnst.GDAY ? null :
                                        <div>
                                            {/* line 3 */}
                                            <Grid container direction='row' justify='flex-start' alignItems='baseline'>
                                                {_TextField(cnst.REQUEST_START_DATE, 'From', inputType.DATE, classes.dateField)}
                                            </Grid>
                                            {/* line 4 */}
                                            <Grid container direction='row' justify='flex-start' alignItems='baseline'>
                                                {_TextField(cnst.REQUEST_END_DATE, 'To', inputType.DATE, classes.dateField)}
                                            </Grid>
                                        </div>
                                    }
                                </Grid>
                            </div>}

                        {/* --------------------- REMARK ---------------- */}
                        <Divider variant='middle' className={classes.divider} />

                        {/* Remark */}
                        <Grid item xs={10} container direction='column' alignItems='flex-start'>
                            {_TextField(cnst.REMARK, 'Free Text')}
                        </Grid>

                        {/* Buttons */}
                        <Grid container direction='row' justify='flex-end' className={classes.footer}>
                            <Button onClick={this.onResetClicked}>Reset</Button>
                            <Button onClick={this.props.onCancelled}>Cancel</Button>
                            <Button
                                onClick={this.onConfirmed}
                                disabled={!this.state.formValid}>Ok</Button>
                        </Grid>
                    </Paper>
                </Grid>
            </Modal >
        )
    }

}

const stateToProps = (state) => {
    return {
        userID: state.auth.userID,
        rank: state.auth.rank,
        fleet: state.auth.fleet,

        email: state.auth.email,
        rosterName: state.auth.rosterName,
        fbUserName: state.auth.fbUserName,
        mobile: state.auth.mobile,
    }
}

export default withStyles(styles)(connect(stateToProps, null)(postForm));