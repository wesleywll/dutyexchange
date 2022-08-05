import act from './actionType';
import * as api from '../../data/DatabaseAPI';
import cnst from '../../utility/PostForm/constant';

import axios from 'axios';
import axios_database from '../../axios-firebase';
import Moment from 'moment';
import { isNull } from 'util';


const END_OF_NEXT_MONTH = Moment().set('month', Moment().get('month') + 1).endOf('month').format('YYYY-MM-DD');


//------------------ action creators ---------------------
const _authStart = () => {
    return {
        type: act.AUTH_START
    };
}

const _authSuccess = (token, userID, userData) => {
    return {
        type: act.AUTH_SUCCESS,
        token: token,
        userID: userID,
        userData: userData,
    }
}

const _authFail = (error) => {
    return {
        type: act.AUTH_FAILED,
        error: error,
    }
}

const _signupSuccess = () => {
    return {
        type: act.SIGNUP_SUCCESS
    }
}

const _logout = () => {
    return {
        type: act.LOGOUT
    }
}

const _updateUserDataInit = () => {
    return {
        type: act.UPDATE_USER_DATA_INIT,
    }
}

const _updateUserData = (userData) => {
    return {
        type: act.UPDATE_USER_DATA,
        userData: userData,
    }
}

const _updateUserDataSuccess = () => {
    return {
        type: act.UPDATE_USER_DATA_SUCCESS,
    }
}

const _updateUserDataFail = (err) => {
    return {
        type: act.UPDATE_USER_DATA_FAIL,
        error: err,
    }
}


const _changePasswordInit = () => {
    return {
        type: act.CHANGE_PASSWORD_INIT,
    }
}

const _changePasswordSuccess = (message) => {
    return {
        type: act.CHANGE_PASSWORD_SUCCESS,
        message: message
    }
}

const _changePasswordFail = (err) => {
    return {
        type: act.CHANGE_PASSWORD_FAIL,
        error: err,
    }
}

const _pending = () => {
    return {
        type: act.PENDING,
    }
}

const _pending_off = () => {
    return {
        type: act.PENDING_OFF,
    }
}

const _changeFleetDisplay = (fleet) => {
    return {
        type: act.CHANGE_FLEET_DISPLAY,
        fleet_display: fleet,
    }
}

const _changeRankDisplay = (rank) => {
    return {
        type: act.CHANGE_RANK_DISPLAY,
        rank_display: rank,
    }
}

const _storePosts = (posts) => {
    return {
        type: act.STORE_POSTS,
        posts: posts,
    }
}

const _storePostsAndProfiles = (posts, profiles) => {
    return {
        type: act.STORE_POSTS_AND_PROFILES,
        posts: posts,
        profiles: profiles,
    }
}

const _setCurrentPage = (page) => {
    return {
        type: act.SET_CURRENT_PAGE,
        page: page,
    }
}

const _setMessage = (message) => {
    return {
        type: act.SET_MESSAGE,
        message: message,
    }
}

//------------------ REST API ------------------
// check if guest is in company
const _checkIsCompany = (isCompanyCheck) => {
    return new Promise((resolve, reject) => {
        axios_database.get('/secret/' + isCompanyCheck + '.json')
            .then(res => {
                const isCompany = res.data;
                if (isCompany) {
                    const result = {
                        isCompany: isCompany,
                    }
                    resolve(result)
                } else {
                    const result = {
                        message: 'Not in company',
                        object: null,
                    }
                    reject(result);
                }
            })
            .catch(err => {
                const result = {
                    message: 'Company check failed',
                    object: err,
                }
                reject(result);
            })
    })
}

// POST signup request, then PATCH user data with the obtained token and userID
const _postSignup = (authData) => {
    return new Promise((resolve, reject) => {
        axios.post(api.URL_SIGNUP, authData)
            .then(res => {
                const result = {
                    userID: res.data.localId,
                    token: res.data.idToken,
                }
                resolve(result);
            })
            .catch(err => {
                const result = {
                    message: 'signup failed: ' + err.response.data.error.message,
                    object: err,
                }
                reject(result);
            })
    })
}

// PATCH user data 
const _patchUserData = (token, userData) => {
    return new Promise((resolve, reject) => {
        // upload private user data
        axios_database.patch('/users.json?auth=' + token, userData)
            .then(res => {
                resolve();
            })
            .catch(err => {
                const result = {
                    message: 'user data upload failed: ' + err.message,
                    object: err,
                }
                reject(result);
            })
    })
}

// PATCH user profile data
const _patchProfileData = (token, profileData) => {
    return new Promise((resolve, reject) => {
        // upload public user profile
        axios_database.patch('/profiles.json?auth=' + token, profileData)
            .then(res => {
                resolve();
            })
            .catch(err => {
                const result = {
                    message: 'profile data upload failed: ' + err.message,
                    object: err,
                }
                reject(result);
            })
    })
}

// send verification email
const _sendVerificationEmail = (token) => {
    return new Promise((resolve, reject) => {
        axios.post(api.URL_SEND_EMAIL_VERIFICATION,
            { requestType: 'VERIFY_EMAIL', idToken: token })
            .then(res => {
                resolve();
            })
            .catch(err => {
                const result = {
                    message: 'verification email failed to send: ' + err.response.data.error.message,
                    object: err,
                }
                reject(result);
            })
    })
}

// POST user delete request
const _postDeleteUser = (token) => {
    return new Promise((resolve, reject) => {
        axios.post(api.URL_DELETE_USER, { 'idToken': token })
            .then(res => {
                resolve();
            })
            .catch(err => {
                const result = {
                    message: 'user failed to delete' + err.response.data.error.message,
                    object: err,
                }
                reject(result);
            })
    })

}

// DELETE user data
const _deleteUserData = (token, userID) => {
    return new Promise((resolve, reject) => {
        axios_database.delete('/users/' + userID + '.json?auth=' + token)
            .then(res => {
                resolve();
            })
            .catch(err => {
                const result = {
                    message: 'user data failed to delete' + err.message,
                    object: err,
                }
                reject(result);
            })
    })
}

// DELETE profile data
const _deleteProfileData = (token, userID) => {
    return new Promise((resolve, reject) => {
        axios_database.delete('/profiles/' + userID + '.json?auth=' + token)
            .then(res => {
                resolve();
            })
            .catch(err => {
                const result = {
                    message: 'profile data failed to delete' + err.message,
                    object: err,
                }
                reject(result);
            })
    })
}

// POST Login request, dispatch token and userID
const _postLogin = (authData) => {
    const url = api.URL_LOGIN;
    return new Promise((resolve, reject) => {
        axios.post(url, authData)
            .then(res => {
                const tokenLife_s = res.data.expiresIn; // token life in millisecond
                const token = res.data.idToken;
                const userID = res.data.localId;

                // collect result to resolve
                const result = {
                    token: token,
                    userID: userID,
                    tokenLife_s: tokenLife_s,
                }

                resolve(result);
            })
            .catch(err => {
                const result = {
                    message: 'Login Failed: ' + err.response.data.error.message,
                    object: err,
                }
                reject(result);
            })
    })
}

// GET user data and dispatch to store
const _getUserData = (token, userID) => {
    return new Promise((resolve, reject) => {
        axios_database.get('/users/' + userID + '.json?auth=' + token)
            .then(res => {
                const result = {
                    userData: { ...res.data },
                }
                resolve(result);
            })
            .catch(err => {
                const result = {
                    message: 'Unable to fetch user data: ' + err.message,
                    object: err,
                }

                reject(result);
            })
    })

}

// check email verification status
const _checkEmailVerified = (token) => {
    return new Promise((resolve, reject) => {
        axios.post(api.URL_GET_USER_ACCOUNT_INFO, { idToken: token })
            .then(res => {
                const emailVerified = res.data.users[0].emailVerified;
                localStorage.setItem('emailVerified', emailVerified)
                resolve({ emailVerified: emailVerified });
            })
            .catch(err => {
                const result = {
                    message: 'Unable to check email verification: ' + err.message,
                    object: err,
                }
                reject(result);
            })

    })
}

// PUT user data for profile updataing
const _putUserData = (token, userID, userData) => {
    return new Promise((resolve, reject) => {
        // PUT (replace) user data 
        axios_database.put('./users/' + userID + '.json?auth=' + token, userData)
            .then(res => {
                resolve();
            })
            .catch(err => {
                console.log('User data update failed', err.response.data.error.message)
                const result = {
                    message: 'User data failed to upload: ' + err.response.data.error.message,
                    object: err,
                }
                reject(result);
            })
    })
}

// PUT profile data for profile updataing
const _putProfileData = (token, userID, profileData) => {
    return new Promise((resolve, reject) => {
        // PUT (replace) profile data 
        axios_database.put('./profiles/' + userID + '.json?auth=' + token, profileData)
            .then(res => {
                resolve();
            })
            .catch(err => {
                console.log('Profile data update failed', err.response.data.error.message)
                const result = {
                    message: 'Profile data failed to upload: ' + err.response.data.error.message,
                    object: err,
                }
                reject(result);
            })
    })
}

// transform server data into array
const _getDataArray = (data_json) => {
    const arrayKey = Object.keys(data_json);
    let dataArray = [];
    let data = {};
    for (let key of arrayKey) {
        data = data_json[key];
        data = { ...data, id: key };
        dataArray = [...dataArray, data]
    }
    return dataArray;
}

// GET all posts from server
const _getPostsData = (fleet, rank) => {
    return new Promise((resolve, reject) => {
        // set start date for server query
        const startDate = Moment().subtract(1, 'months').format('YYYY-MM-DD');
        const endDate = END_OF_NEXT_MONTH;

        const filterKey_start = [fleet, rank, startDate].join('_');
        const filterKey_end = [fleet, rank, endDate].join('_');

        axios_database.get('/posts.json?orderBy="filter_key"&startAt="' + filterKey_start + '"&endAt="' + filterKey_end + '"')
            .then(res => {
                resolve({ posts: _getDataArray(res.data) });
            })
            .catch(err => {
                const result = {
                    message: 'Post data failed to fetched: ' + err.message,
                    object: err,
                }
                reject(result);
            })
    })
}

// GET all public profiles from server
const _getProfilesData = (token) => {
    return new Promise((resolve, reject) => {
        axios_database.get('/profiles.json?auth=' + token)
            .then(res => {
                resolve({ profiles: res.data })
            })
            .catch(err => {
                const result = {
                    message: 'Profile data failed to fetched: ' + err.message,
                    object: err,
                }
                console.log(result.message)
                reject(result);
            })
    })
}

// GET both posts and profiles
const _getPostsAndProfiles = (fleet, rank, token) => {
    let posts = [];
    let profiles = [];
    return new Promise((resolve, reject) => {
        _getPostsData(fleet, rank)
            .then(res => {
                // posts successfully fetched
                posts = res.posts;

                // GET profiles
                return _getProfilesData(token);
            })
            .then(res => {
                // profiles successfully fetched
                profiles = res.profiles;
                console.log(profiles)
                const result = {
                    posts: posts,
                    profiles: profiles,
                }

                resolve(result);
            })
            .catch(err => {
                const result = {
                    message: 'Posts and profiles data failed to fetch: ' + err.message,
                    object: err,
                }
                console.log(result.message)
                reject(result);
            })
    })
}


// ------------------- MISC ----------------------
// set token life according to local time, logout when token expire
// token life unit: seconds
const _setLoginTimeout = (tokenLife_ms) => {

    return (dispatch) => {
        setTimeout(() => {
            localStorage.clear();
            dispatch(_logout());
            console.log('Auto-logout, token expired at', Moment().format('HH:mm'));
        }, tokenLife_ms); // convert to seconds
    }
}




//------------------ Auth Operations ----------------------------
export const authStart = () => {
    return (dispatch) => {
        dispatch(_authStart());
    }
}

// Signup with email and password, redirect to login page
export const signup = (email, password, isCompanyCheck, userData, profileData) => {
    return (dispatch) => {
        // Auth init
        dispatch(_authStart());

        // Auth data for signup
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        // POST signup request with REST API
        let userID = null;
        let token = null;
        let userCreated = false;
        let userDataUploaded = false;
        let profileDataUploaded = false;

        dispatch(_pending());
        _checkIsCompany(isCompanyCheck)
            .then(res => {
                // company check successful
                if (res.isCompany) {
                    return _postSignup(authData);
                }
            })
            .then(res => {
                // POST signup successful
                userCreated = true;
                // Patch user data
                userID = res.userID;
                token = res.token;
                const userData_withID = {
                    [userID]: userData,
                }
                return _patchUserData(token, userData_withID);
            })
            .then(res => {
                // Patch user data successful
                userDataUploaded = true;
                // Patch profile data
                const profileData_withID = {
                    [userID]: profileData,
                }
                return _patchProfileData(token, profileData_withID);
            })
            .then(res => {
                // signup process successful
                profileDataUploaded = true;
                // send verification email
                return _sendVerificationEmail(token);
            })
            .then(res => {
                // verification email sent, signup complete
                dispatch(_signupSuccess())
                dispatch(_pending_off())
            })
            .catch(err => {
                dispatch(_authFail(err.message));
                if (userCreated) { _postDeleteUser(token); }
                if (userDataUploaded) { _deleteUserData(token, userID); }
                if (profileDataUploaded) { _deleteProfileData(token, userID); }
                dispatch(_pending_off())
            })


    }
}

// Login with email and password, dispatch token and user ID
export const login = (email, password) => {
    return (dispatch) => {
        // Auth init
        dispatch(_authStart());

        // Auth data for signup
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        // POST signup request with REST API and GET user data to store
        let token = null;
        let userID = null;
        let userData = {};
        let expireTime = null;
        let fleet = null;
        let rank = null;

        dispatch(_pending());
        _postLogin(authData)
            .then(res => {
                // login successful
                // collect auth data
                token = res.token;
                userID = res.userID;

                // collect expire time
                expireTime = Moment().add(res.tokenLife_s, 's').format('YYYY-MM-DD HH:mm:ss');

                // set timeout, auto logout at expire time
                dispatch(_setLoginTimeout(res.tokenLife_s * 1000)); //time out set at ms

                // GET user data
                return _getUserData(res.token, res.userID);
            })
            .then(res => {
                // collect auth data
                userData = { ...res.userData };
                fleet = userData.fleet;
                rank = userData.rank;

                // user data GET successful, check email verification status if neccessary
                if (!res.userData.emailVerified || typeof (res.userData.emailVerified) === 'undefined') {
                    return _checkEmailVerified(token);
                } else {
                    // no check required, pass result to downstream
                    return { emailVerified: res.userData.emailVerified }
                }
            })
            .then(res => {
                // email verification checked, finalize login result
                if (res.emailVerified) {
                    // save auth data in local storage
                    localStorage.setItem('token', token);
                    localStorage.setItem('userID', userID);
                    localStorage.setItem('expireTime', expireTime);

                    // ------ try to get posts and profiles -------
                    _getPostsAndProfiles(fleet, rank, token)
                        .then(res => {
                            dispatch(_storePostsAndProfiles(res.posts, res.profiles));
                        })
                        .catch(err => {
                            console.log(err.message)
                        })
                        .then(res => {
                            dispatch(_authSuccess(token, userID, userData));
                            dispatch(_pending_off());
                        })

                } else {
                    throw ({ message: 'Email not verified, please check you email inbox' })
                }
            })
            .catch(err => {
                // login unsuccessful, clear local storage and redux state
                localStorage.clear();
                dispatch(_logout());
                dispatch(_authFail(err.message));
                console.log('login failed: ', err.message)
                dispatch(_pending_off());
            })
    }
}


// Logout, remove token and userID from state
export const logout = () => {
    return (dispatch) => {
        localStorage.clear();

        dispatch(_pending());
        dispatch(_logout());
        _getPostsData(cnst.FLEET_AIRBUS, cnst.SO)
            .then(res => {
                dispatch(_storePosts(res.posts));
                dispatch(_pending_off());

            })
            .catch(err => {
                console.log(err.message)
                dispatch(_pending_off());

            })
    }
}

// auto login attempt
export const tryAutoLogin = () => {
    return (dispatch) => {
        const token = localStorage.getItem('token');
        const userID = localStorage.getItem('userID');
        const expireTime = localStorage.getItem('expireTime'); //in seconds

        // get remaining token life in ms
        const tokenLife = Moment(expireTime).diff(Moment());

        // get user data from server
        let userData = {}
        dispatch(_pending());
        if (!isNull(token) && tokenLife > 0) {
            // if token exists and not expired, GET user data
            _getUserData(token, userID)
                .then(res => {
                    console.log('auto login successful')
                    userData = { ...res.userData };

                    const fleet = userData.fleet;
                    const rank = userData.rank;

                    // ------ try to get posts and profiles -------
                    _getPostsAndProfiles(fleet, rank, token)
                        .then(res => {
                            dispatch(_storePostsAndProfiles(res.posts, res.profiles));
                        })
                        .catch(err => {
                            console.log(err.message)
                        })
                        .then(res => {
                            // set timeout, auto logout at expire time
                            dispatch(_setLoginTimeout(tokenLife));
                            dispatch(_authSuccess(token, userID, userData));
                            dispatch(_pending_off());
                        })
                })
                .catch(err => {
                    console.log('auto login user data fetched failed: ', err.message)
                    localStorage.clear();
                    dispatch(_logout());
                    dispatch(_pending_off());

                })

        } else {
            // otherwise, logout to clear local storage
            console.log('auto login failed, no valid token');
            localStorage.clear();
            dispatch(_logout());
            _getPostsData(cnst.FLEET_AIRBUS, cnst.SO)
                .then(res => {
                    dispatch(_storePosts(res.posts));
                })
                .catch(err => {
                    console.log(err.message);
                })
                .then(res => {
                    // do this no matter what
                    dispatch(_pending_off());
                })

        }
    }
}

// get posts and profiles from server, if token is null, get posts only
export const getServerData = (fleet, rank, token = null) => {
    return (dispatch) => {
        dispatch(_pending());
        if (!isNull(token)) {
            _getPostsAndProfiles(fleet, rank, token)
                .then(res => {
                    dispatch(_storePostsAndProfiles(res.posts, res.profiles));
                    dispatch(_pending_off());
                })
                .catch(err => {
                    console.log(err.message)
                    dispatch(_pending_off());
                })
        } else {
            _getPostsData(fleet, rank)
                .then(res => {
                    dispatch(_storePosts(res.posts));
                    dispatch(_pending_off());
                })
                .catch(err => {
                    console.log(err.message)
                    dispatch(_pending_off());
                })
        }
    }
}

export const resetPassword = (email) => {
    return (dispatch) => {
        dispatch(_pending());
        dispatch(_setMessage(''));
        axios.post(api.URL_RESET_PASSWORD, { requestType: 'PASSWORD_RESET', email: email })
            .then(res => {
                dispatch(_pending_off());
                dispatch(_setMessage('Please check your email inbox for password reset link'));
            })
            .catch(err => {
                console.log(err.message)
                dispatch(_pending_off());
                dispatch(_setMessage('Password reset failed, please try again later'));
            })
    }
}

export const changePassword = (email, password_current, password_new) => {
    return (dispatch) => {
        dispatch(_pending());
        dispatch(_changePasswordInit())
        // Auth data for signup
        const authData = {
            email: email,
            password: password_current,
            returnSecureToken: true
        };

        // try login to check current password
        axios.post(api.URL_LOGIN, authData)
            .then(res => {
                const payload = {
                    idToken: res.data.idToken,
                    password: password_new,
                    returnSecureToken: false
                }
                // current password verified, proceed to change password
                return axios.post(api.URL_CHANGE_PASSWORD, payload)
            })
            .then(res => {
                dispatch(_changePasswordSuccess('Password is successfully changed'))
                dispatch(_pending_off());
            })
            .catch(err => {
                dispatch(_changePasswordFail('Incorrect current password'))
                dispatch(_pending_off());
            })
    }
}

//------------------ User Data  -------------
export const updateUserDataInit = () => {
    return (dispatch) => {
        dispatch(_updateUserDataInit())
    }
}

// update user data
export const updateUserData = (token, userID, profileData, userData) => {
    return (dispatch) => {
        dispatch(_pending());
        _putUserData(token, userID, userData)
            .then(res => {
                return _putProfileData(token, userID, profileData);
            })
            .then(res => {

                // ------ try to get posts and profiles -------
                _getPostsAndProfiles(userData.fleet, userData.rank, token)
                    .then(res => {
                        dispatch(_storePostsAndProfiles(res.posts, res.profiles));
                    })
                    .catch(err => {
                        console.log(err.message)
                    })
                    .then(res => {
                        dispatch(_updateUserData(userData))
                        dispatch(_updateUserDataSuccess())
                        dispatch(_pending_off());
                    })
            })
            .catch(err => {
                dispatch(_updateUserDataFail(err.message));
                dispatch(_pending_off());
            })
    }
}

//------------------ Change fleet and rank --------------
export const changeFleetDisplay = (fleet) => {
    return (dispatch) => {
        dispatch(_changeFleetDisplay(fleet))
    }
}

export const changeRankDisplay = (rank) => {
    return (dispatch) => {
        dispatch(_changeRankDisplay(rank))
    }
}


//----------- page change -----------------
export const setCurrentPage = (page) => {
    return (dispatch) => {
        dispatch(_setCurrentPage(page))
    }
}

//---------- On screen message ------
export const setMessage = (message) => {
    return (dispatch) => {
        dispatch(_setMessage(message))
    }
}