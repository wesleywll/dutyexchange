import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typo from '@material-ui/core/Typography';
import ExpPanel from '@material-ui/core/ExpansionPanel';
import ExpPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBox from '@material-ui/core/Checkbox';

import TextSelect from '../UI/Button/TextSelect/TextSelect';
import GroupedMultiSelect from '../UI/GroupedMultiSelect/GroupedMultiSelect';

import Airports from '../../data/Airports';
import cnst from '../../utility/PostForm/constant';

const DATE = 'date';
const PortDatabase = new Airports();
const GROUPED_PORT_LIST = PortDatabase.getGroupedPortList();

const OFFER_TYPE_LIST = [cnst.ANY, cnst.SWAP, cnst.PROFFER];
const DUTY_TYPE_LIST = [cnst.ANY, cnst.FLIGHT, cnst.SIM, cnst.RESERVE, cnst.OTHERS, cnst.GDAY];

const styles = theme => ({
    root: {
        maxWidth: 500,
    },

    textField: {
        width: 140,
    },

    inputField: {
        fontSize: 15,
    },

    multiSelectField: {
        maxWidth: 150,
        display: 'flex',
        flexWrap: 'wrap',
    },
})

const searchPanel = (props) => {
    const { classes } = props;
    //-------------------- Input components -----------------
    // generate TextField with handler and validity check
    const _TextField = (field, label = '', type = '', className = '', inputProps = {}) => {
        let fieldValue = props.filter[field];
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
                onChange={(event) => props.onFieldChange(field, event.target.value)}
                error={
                    props.filter[field + '_isTouched'] &&
                    !props.filter[field + '_isValid']
                }
                inputProps={inputProps}
                className={className}
                helperText={props.filter[field + '_error']}
            />
        )
    }

    // TextSelect for listed selection input
    const _TextSelect = (field, list, label = '', className = '') => {
        let fieldValue = props.filter[field];
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
                onChange={(event) => props.onFieldChange(field, event.target.value)}
                error={
                    props.filter[field + '_isTouched'] &&
                    !props.filter[field + '_isValid']
                }
                className={className}
            />
        )
    }

    // Grouped MultiSelect for ports and regions
    // Input must be an object of {x:[1,2,3]}
    const _GroupedMultiSelect = (field, groupedList, singleSelection = false, label = '', className = '') => {
        let fieldValue = props.filter[field];
        return (
            <GroupedMultiSelect
                groupedItemList={groupedList}
                selectedItems={fieldValue}
                onSelectionChanged={(selection) => props.onFieldChange(field, selection)}
                className={className}
                singleSelection={singleSelection}
            />
        )
    }

    // Dynamic roster code input
    const _OfferRosterCodeInput = () => {
        switch (props.filter.offer_dutyType) {
            case cnst.FLIGHT:
                return (
                    <div>
                        {_TextSelect(cnst.OFFER_PLANE_TYPE, OFFER_PLANE_LIST)}
                        {_GroupedMultiSelect(cnst.OFFER_FLIGHT_CODE, GROUPED_PORT_LIST)}
                    </div>
                );

            case cnst.ANY:
                return (_TextSelect(cnst.OFFER_PLANE_TYPE, OFFER_PLANE_LIST));

            case cnst.SIM:
                return (
                    <div>
                        {_TextSelect(cnst.OFFER_PLANE_TYPE, OFFER_PLANE_LIST)}
                        {_TextField(cnst.OFFER_ROSTER_CODE, 'Roster Code')}
                    </div>
                );

            case cnst.OTHERS:
                return (_TextField(cnst.OFFER_ROSTER_CODE, 'Roster Code'));

            case cnst.GDAY:
                return null;

            default:
                return null;
        }
    }

    const _RequestRosterCodeInput = () => {
        switch (props.filter.request_dutyType) {
            case cnst.FLIGHT:
                return (
                    <div>
                        {_TextSelect(cnst.REQUEST_PLANE_TYPE, REQUEST_PLANE_LIST)}
                        {_GroupedMultiSelect(cnst.REQUEST_FLIGHT_CODE, GROUPED_PORT_LIST)}
                    </div>
                );

            case cnst.ANY:
                return (_TextSelect(cnst.REQUEST_PLANE_TYPE, REQUEST_PLANE_LIST))

            case cnst.SIM:
                return (
                    <div>
                        {_TextSelect(cnst.REQUEST_PLANE_TYPE, REQUEST_PLANE_LIST)}
                        {_TextField(cnst.REQUEST_ROSTER_CODE, 'Roster Code')}
                    </div>
                );

            case cnst.OTHERS:
                return (_TextField(cnst.REQUEST_ROSTER_CODE, 'Roster Code'));

            case cnst.GDAY:
                return null;

            default:
                return null;
        }
    }


    //--------------------/ Input components -----------------

    // setting up filter -------------------
    let OFFER_PLANE_LIST = [];
    let REQUEST_PLANE_LIST = [];
    switch (props.fleet) {
        case cnst.FLEET_AIRBUS:
            OFFER_PLANE_LIST = [cnst.AIRBUS, cnst.A330, cnst.A350];
            REQUEST_PLANE_LIST = [cnst.AIRBUS, cnst.A330, cnst.A350];
            break;
        case cnst.FLEET_B777:
            OFFER_PLANE_LIST = [cnst.B777];
            REQUEST_PLANE_LIST = [cnst.B777];
            break;
        case cnst.FLEET_B747:
            OFFER_PLANE_LIST = [cnst.B747];
            REQUEST_PLANE_LIST = [cnst.B747];
            break;
        default:
            console.log('Invalid fleet');
    }
    return (
        <ExpPanel expanded={props.panelExpanded} onChange={props.onFilterToggle}>
            <ExpPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container direction='row' justify='center' alignItems='center'>
                    <Typo variant='title' align='center'>Post Filter</Typo>
                </Grid>
            </ExpPanelSummary>

            <ExpPanelDetails>
                <Grid container direction='column' justify='flex-start' alignItems='center'>

                    {/* main panel */}
                    <Grid container direction='row' justify='space-around' alignItems='flex-start' className={classes.root}>
                        {/* offer */}
                        <Grid item xs={5} container direction='column' justify='flex-start' alignItems='center'>
                            <Typo variant='subheading' align='center'>Offer</Typo>
                            <Grid container diretion='column' justify='flex-start' alignItems='flex-start'>
                                {/* offer filter items */}
                                <Grid container direction='row' justify='flex-start'>
                                    {_TextSelect(cnst.OFFER_OFFER_TYPE, OFFER_TYPE_LIST)}
                                    {_TextSelect(cnst.OFFER_DUTY_TYPE, DUTY_TYPE_LIST)}
                                </Grid>

                                <Grid container direction='column' justify='flex-start' alignItems='flex-start'>
                                    {_OfferRosterCodeInput()}
                                    {_TextField(cnst.OFFER_START_DATE, 'Period Start', DATE)}
                                    {_TextField(cnst.OFFER_END_DATE, 'Period End', DATE)}
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* request */}
                        <Grid item xs={5} container direction='column' justify='flex-start' alignItems='center'>
                            <Typo variant='subheading' align='center'>Request</Typo>
                            <Grid container diretion='column' justify='flex-start' alignItems='flex-start'>
                                {/* request filter items */}
                                <Grid container direction='row' justify='flex-start'>
                                    {_TextSelect(cnst.REQUEST_DUTY_TYPE, DUTY_TYPE_LIST)}
                                </Grid>

                                <Grid container direction='column' justify='flex-start' alignItems='flex-start'>
                                    {_RequestRosterCodeInput()}
                                    {_TextField(cnst.REQUEST_START_DATE, 'Period Start', DATE)}
                                    {_TextField(cnst.REQUEST_END_DATE, 'Period End', DATE)}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid>
                        <FormControlLabel
                            label='POSTED BY ME'
                            control={
                                <CheckBox
                                    checked={props.postedByMe}
                                    onChange={props.onPostedByMeChecked}
                                    color='primary'
                                />
                            }
                        />
                    </Grid>

                    {/* Footer */}
                    <Grid container direction='row' justify='flex-end' alignItems='flex-end'>
                        <Button onClick={props.onFilterReset}>RESET</Button>
                        <Button onClick={props.onFilterToggle}>OK</Button>
                    </Grid>
                </Grid>
            </ExpPanelDetails>
        </ExpPanel>


    )
}

export default withStyles(styles)(searchPanel);