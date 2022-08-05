import React, { Component } from 'react';
import Moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Post from '../../component/Post/Post';
import SearchPanel from '../../component/SearchPanel/SearchPanel';
import PostForm from '../PostForm/PostForm';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';

import cnst from '../../utility/PostFilter/constant';
import Airports from '../../data/Airports';
import { getFieldValidity, getFormattedValue } from '../../utility/PostFilter/utility';
import { immUpdate } from '../../utility/immUpdate';
import { arrayPartlyMatched } from '../../utility/arrayTools';

import * as actions from '../../store/action/action_auth';

import axios from '../../axios-firebase';

// constants
const CURRENT_DATE = Moment().format('YYYY-MM-DD');
const DEFUALT_END_DATE = Moment().set('month', Moment().get('month') + 2).endOf('month').format('YYYY-MM-DD');
const PortDatabase = new Airports();

const DEFAULT_STATE = {
    currentFleet: null,
    currentRank: null,

    // ------------ filter variables---------
    offer_offerType: cnst.ANY,
    offer_dutyType: cnst.ANY,
    offer_rosterCode: '',
    offer_flightCode: [cnst.ANY],
    offer_startDate: CURRENT_DATE,
    offer_endDate: DEFUALT_END_DATE,
    offer_planeType: cnst.AIRBUS,
    request_dutyType: cnst.ANY,
    request_rosterCode: '',
    request_flightCode: [cnst.ANY],
    request_startDate: CURRENT_DATE,
    request_endDate: DEFUALT_END_DATE,
    request_planeType: cnst.AIRBUS,

    filter_postedByMe: false,

    offer_offerType_isValid: true,
    offer_dutyType_isValid: true,
    offer_rosterCode_isValid: false,
    offer_flightCode_isValid: false,
    offer_signOnTime_isValid: true,
    offer_endDate_isValid: true,
    offer_planeType_isValid: true,
    request_dutyType_isValid: true,
    request_rosterCode_isValid: false,
    request_flightCode_isValid: true,
    request_startDate_isValid: true,
    request_endDate_isValid: true,
    request_planeType_isValid: true,

    offer_offerType_isTouched: false,
    offer_dutyType_isTouched: false,
    offer_rosterCode_isTouched: false,
    offer_flightCode_isTouched: false,
    offer_signOnTime_isTouched: false,
    offer_endDate_isTouched: false,
    offer_planeType_isTouched: false,
    request_dutyType_isTouched: false,
    request_rosterCode_isTouched: false,
    request_flightCode_isTouched: false,
    request_startDate_isTouched: false,
    request_endDate_isTouched: false,
    request_planeType_isTouched: false,

    offer_offerType_error: '',
    offer_dutyType_error: '',
    offer_rosterCode_error: '',
    offer_flightCode_error: '',
    offer_signOnTime_error: '',
    offer_endDate_error: '',
    offer_planeType_error: '',
    request_dutyType_error: '',
    request_rosterCode_error: '',
    request_flightCode_error: '',
    request_startDate_error: '',
    request_endDate_error: '',
    request_planeType_error: '',
    // --------------------------

    show_addbtn: true,
    show_postForm: false,
    searchPanelExpanded: false,

    deletePostDialogOpen: false,
    deletePostID: '',
}

const style = (theme) => ({
    root_modal_open: {
        overflow: 'hidden',
    },

    root_modal_close: {
        overflow: 'scroll',
    },

    postGrid: {
        marginTop: 8,
        marginBottom: 8,
    },

    floatButton: {
        position: 'fixed',
        bottom: 20,
        right: 20,
    },
})

class PostBoard extends Component {
    componentWillMount() {
        // initialize filter state        
        this._resetDefault()
    }

    componentDidMount() {
        // retrieve data from firebase
    }

    componentDidUpdate() {
        // // when update, check if the following state is changed
        // // if changed, reset default filter state and update server data
        // if (
        //     this.state.currentFleet !== this.props.fleet_display ||
        //     this.state.currentRank !== this.props.rank_display ||
        //     this.state.authState !== this.props.isAuth
        // ) {
        //     this.props.getServerData(this.props.fleet_display, this.props.rank_display, this.props.token);
        //     this._resetDefault()
        // }

        window.scrollTo(0, 0);
    }

    // reset to default state
    _resetDefault = () => {
        switch (this.props.fleet_display) {
            case cnst.FLEET_AIRBUS:
                DEFAULT_STATE.offer_planeType = cnst.AIRBUS;
                DEFAULT_STATE.request_planeType = cnst.AIRBUS;
                break;
            case cnst.FLEET_B777:
                DEFAULT_STATE.offer_planeType = cnst.B777;
                DEFAULT_STATE.request_planeType = cnst.B777;
                break;
            case cnst.FLEET_B747:
                DEFAULT_STATE.offer_planeType = cnst.B747;
                DEFAULT_STATE.request_planeType = cnst.B747;
                break;
            default:
                console.log('Invalid fleet');
        }

        DEFAULT_STATE.currentFleet = this.props.fleet_display;
        DEFAULT_STATE.currentRank = this.props.rank_display;
        DEFAULT_STATE.authState=this.props.isAuth;

        this.setState(cloneDeep(DEFAULT_STATE));
    }

    // extract filter values from given state
    _getFilter = (state) => {
        let filter = {};
        for (let key in state) {
            // collect all the keys with offer/request prefix
            if (key.startsWith(cnst.OFFER) || key.startsWith(cnst.REQUEST) || key.startsWith(cnst.FILTER)) {
                filter = {
                    ...filter,
                    [key]: state[key],
                }
            }
        }
        return filter
    }

    // register user action count to trigger reload
    _userActionDone = () => {
        const actionCount = this.state.userAction + 1;
        this.setState({ userAction: actionCount })
    }

    // delete post with post ID
    _deletePost = (postKey) => {
        const url = './posts/' + postKey + '.json?auth=' + this.props.token;

        axios.delete(url)
            .then(
                response => {
                    // refresh page
                    this.props.getServerData(this.props.fleet_display, this.props.rank_display, this.props.token);
                }
            )
            .catch(
                error => {
                    console.log(error);
                }
            )
    }

    //--------------Handler---------------------
    addBtnClickedHandler = () => {
        this.setState(
            { show_postForm: true }
        )
    }

    addPostConfirmedHandler = (data) => {
        // new post confirmed, POST data to server
        if (data !== null) {
            axios.post('/posts.json?auth=' + this.props.token, data)
                // wait until POST is completed
                .then(
                    request => {
                        // refresh page
                        this.props.getServerData(this.props.fleet_display, this.props.rank_display, this.props.token);
                    }
                )
                .catch(
                    error => {
                        console.log(error)
                    }
                )
        }

        // hide post form
        this.setState(
            { show_postForm: false }
        )
    }

    addPostCancelledHandler = () => {
        // new post cancelled, hide post form
        this.setState(
            { show_postForm: false }
        )
    }

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
                    newState.offer_startDate_isValid = !Moment(value_formatted).isAfter(Moment(this.state.offer_endDate), 'day');
                    newState.offer_startDate_error = newState.offer_startDate_isValid ? '' : 'start date must be on or before end date';
                    // change date partner
                    newState.offer_endDate_isValid = newState.offer_startDate_isValid;
                    newState.offer_endDate_error = newState.offer_endDate_isValid ? '' : 'end date must be after start date';
                    break;

                case cnst.OFFER_END_DATE:
                    newState.offer_endDate_isValid = !Moment(value_formatted).isBefore(Moment(newState.offer_startDate), 'day');
                    newState.offer_endDate_error = newState.offer_endDate_isValid ? '' : 'end date must be after start date';
                    // change date partner
                    newState.offer_startDate_isValid = newState.offer_endDate_isValid
                    newState.offer_startDate_error = newState.offer_startDate_isValid ? '' : 'start date must be on or before end date';
                    break;

                case cnst.REQUEST_START_DATE:
                    newState.request_startDate_isValid = !Moment(value_formatted).isAfter(Moment(this.state.request_endDate), 'day');
                    newState.request_startDate_error = newState.request_startDate_isValid ? '' : 'start date must be on or before end date';
                    // change date partner
                    newState.request_endDate_isValid = newState.request_startDate_isValid;
                    newState.request_endDate_error = newState.request_endDate_isValid ? '' : 'end date must be after start date';
                    break;

                case cnst.REQUEST_END_DATE:
                    newState.request_endDate_isValid = !Moment(value_formatted).isBefore(Moment(newState.request_startDate), 'day');
                    newState.request_endDate_error = newState.request_endDate_isValid ? '' : 'end date must be after start date';
                    // change date partner
                    newState.request_startDate_isValid = newState.request_endDate_isValid
                    newState.request_startDate_error = newState.request_startDate_isValid ? '' : 'start date must be on or before end date';
                    break;

                default:
                    break;
            }
        }

        // update state
        this.setState(newState)
    }

    onFilterReset = () => {
        // get default filter values
        const defaultFilter = this._getFilter(DEFAULT_STATE);

        // reset filter value in state
        this.setState(defaultFilter)
    }

    onFilterToggle = () => {
        this.setState({ searchPanelExpanded: !this.state.searchPanelExpanded })
    }

    onPostedByMeChecked = () => {
        this.setState({ filter_postedByMe: !this.state.filter_postedByMe })
    }

    onDeletePostClicked = (postID) => {
        this.setState({
            deletePostDialogOpen: true,
            deletePostID: postID,
        })
    }

    onDeletePostConfirmed = () => {
        this._deletePost(this.state.deletePostID);
        this.setState({
            deletePostDialogOpen: false,
            deletePostID: '',
        })
    }

    // ==== Search Panel ==============

    // check if post matches filter's description, falsify if one condition mismatch
    filterMatched(post) {
        // posted by me check, if "posted by me" is checked but user ID mismatch, return false
        if (this.state.filter_postedByMe && post.userID !== this.props.userID) {
            return false
        }

        // --------------------- input field check -----------------------
        for (let groupKey of [cnst.OFFER, cnst.REQUEST]) {
            // ---Collect relevant post values for checking
            // common values
            let postCheck = {
                dutyType: post[groupKey].dutyType,
                startDate: post[groupKey].startDate,
                endDate: post[groupKey].endDate,
            }

            // group key values
            switch (groupKey) {
                case cnst.OFFER:
                    postCheck = {
                        ...postCheck,
                        offerType: post[groupKey].offerType,
                    }
                    break;

                default:
                    break;
            }

            // conditional values
            switch (post[groupKey].dutyType) {
                case cnst.FLIGHT:
                    switch (groupKey) {
                        case cnst.OFFER:
                            postCheck = {
                                ...postCheck,
                                planeType: post[groupKey].planeType,
                                flightCode: post[groupKey].flightCode,
                            }
                            break;
                        case cnst.REQUEST:
                            switch (post[groupKey].portRange) {
                                case cnst.PORTS:
                                    postCheck = {
                                        ...postCheck,
                                        planeType: post[groupKey].planeType,
                                        flightCode: post[groupKey].flightCode,
                                    }
                                    break;

                                case cnst.REGIONS:
                                    postCheck = {
                                        ...postCheck,
                                        planeType: post[groupKey].planeType,
                                        flightCode: PortDatabase.getPortListByRegionList(post[groupKey].regionCode),
                                    }
                                    break;

                                default:
                                    break;
                            }
                            break;

                        default:
                            break;
                    }
                    break;

                case cnst.OTHERS:
                    postCheck = {
                        ...postCheck,
                        rosterCode: post[groupKey].rosterCode,
                    }
                    break;

                case cnst.ANY:
                    postCheck = {
                        ...postCheck,
                        planeType: post[groupKey].planeType,
                    }
                    break;

                case cnst.SIM:
                    postCheck = {
                        ...postCheck,
                        planeType: post[groupKey].planeType,
                        rosterCode: post[groupKey].rosterCode,
                    }
                    break;

                default:
                    break;
            }

            // Filter checking, compare post values with filter, falsify if unmatched
            for (let key in postCheck) {
                // get filter and post values
                let filterValue = this.state[groupKey + '_' + key];
                let postValue = postCheck[key];
                if (filterValue === cnst.ANY || filterValue.includes(cnst.ANY) || postValue.includes(cnst.ANY)) {
                    // if field contains 'Any', no filter is checked
                    continue;
                } else {
                    // individual checks
                    switch (key) {
                        case cnst.OFFER_TYPE:
                        case cnst.DUTY_TYPE:
                            if (postValue !== filterValue) {
                                // if value mismatch, exit function and return false
                                return false;
                            }
                            break;

                        case cnst.PLANE_TYPE:
                            // convert plane filter into array of planes
                            let planeArray = (filterValue === cnst.AIRBUS) ? [cnst.A330, cnst.A350] : [filterValue];
                            if (!arrayPartlyMatched(planeArray, postValue)) {
                                return false
                            }
                            break;

                        case cnst.FLIGHT_CODE:
                            if (!arrayPartlyMatched(filterValue, postValue)) {
                                return false
                            }
                            break;

                        case cnst.ROSTER_CODE:
                            if (!postValue.includes(filterValue)) {
                                return false
                            }
                            break;

                        default:
                            break;
                    }
                }
            }

            // date check
            if (
                Moment(postCheck.startDate).isAfter(this.state[groupKey + '_' + cnst.END_DATE]) ||
                Moment(postCheck.startDate).isBefore(this.state[groupKey + '_' + cnst.START_DATE]) ||
                Moment(postCheck.endDate).isAfter(this.state[groupKey + '_' + cnst.END_DATE]) ||
                Moment(postCheck.endDate).isBefore(this.state[groupKey + '_' + cnst.START_DATE])
            ) {
                return false
            }
        }
        // --------------------- /input field check -----------------------

        // if not falsify, return true
        return true;
    }

    // =============================


    //------------------------------------------
    render() {
        // material-ui
        const { classes } = this.props;

        // display post list
        let posts = null;
        if (this.props.posts.length !== 0) {
            // sort posts
            const post_sorted = [].concat(this.props.posts).sort(
                // newest comes first
                (a, b) => Moment(b.pub_date).diff(Moment(a.pub_date))
            )

            posts = (
                <Grid container direction='column' justify='center' alignItems='flex-start'>
                    {post_sorted.map(p => {
                        if (this.filterMatched(p)) {
                            // get user profile for author of this post
                            const user = this.props.profiles[p.userID]
                            return (
                                <Grid container direction='column' key={p.id} className={classes.postGrid}>
                                    <Post
                                        key={p.id}
                                        pub_date={Moment(p.pub_date).format('YYYY-MM-DD HH:mm').toString()}
                                        isAuth={this.props.isAuth}

                                        offer={p.offer}
                                        request={p.request}
                                        remark={p.remark}
                                        userID={p.userID}

                                        onDelete={() => this.onDeletePostClicked(p.id)}

                                        // user details that only authorized user can access
                                        email={!this.props.isAuth ? null : user.contactEmail}
                                        username={!this.props.isAuth ? null : user.firstName + ' ' + user.lastName}
                                        rosterName={!this.props.isAuth ? null : user.rosterName}
                                        fbUserName={!this.props.isAuth ? null : user.fbUserName}
                                        mobile={!this.props.isAuth ? null : user.mobile}
                                        postedByMe={!this.props.isAuth ? null : (p.userID === this.props.userID)} // check if post-userID is the same as login-userID
                                    />
                                </Grid>
                            )
                        } else {
                            return null
                        }

                    })}
                </Grid>
            );
        }


        return (
            <div>
                {/* Delete post confirmation */}
                <Dialog
                    open={this.state.deletePostDialogOpen}
                    onClose={() => { this.setState({ deletePostDialogOpen: false }) }}
                >
                    <DialogTitle>
                        Confirm delete selected post?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            This cannot be undone
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.setState({ deletePostDialogOpen: false }) }}>Cancel</Button>
                        <Button onClick={this.onDeletePostConfirmed}>Yes</Button>
                    </DialogActions>

                </Dialog>

                {/* Main body */}
                <SearchPanel
                    filter={this._getFilter(this.state)}
                    fleet={this.props.fleet_display}
                    panelExpanded={this.state.searchPanelExpanded}
                    onFieldChange={this.onFieldChange}
                    onFilterReset={this.onFilterReset}
                    onFilterToggle={this.onFilterToggle}
                    onMultiSelectItemDelete={this.onMultiSelectDeleteItem}
                    postedByMe={this.filter_postedByMe}
                    onPostedByMeChecked={this.onPostedByMeChecked}
                />

                {this.props.pending ? null : posts}

                {/* Floating button */}
                {!this.props.isAuth ? null :
                    <div>
                        <Fab
                            variant='round'
                            onClick={() => { this.setState({ show_postForm: true }) }}
                            className={classes.floatButton}
                            color='primary'
                        >
                            <Icon>add_icon</Icon>
                        </Fab>

                        {/* Overlay form */}
                        <PostForm
                            show={this.state.show_postForm}
                            onConfirmed_pushData={this.addPostConfirmedHandler}
                            onCancelled={this.addPostCancelledHandler}
                        />
                    </div>
                }

            </div>
        )
    }
}

const stateToProps = (state) => {
    return (state, {
        isAuth: state.auth.isAuth,
        token: state.auth.token,
        userID: state.auth.userID,
        fleet: state.auth.fleet,
        rank: state.auth.rank,

        posts: state.auth.posts,
        profiles: state.auth.profiles,

        fleet_display: state.auth.fleet_display,
        rank_display: state.auth.rank_display,

        pending: state.auth.pending,
    })
}

const dispatchToProps = (dispatch) => {
    return {
        // get server data
        getServerData: (fleet, rank, token)=>dispatch(actions.getServerData(fleet, rank, token)),

        logout: () => dispatch(actions.logout()),
    }
}
export default withStyles(style)(connect(stateToProps, dispatchToProps)(PostBoard));