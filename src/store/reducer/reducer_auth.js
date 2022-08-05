import act from '../action/actionType';
import { immUpdate } from '../../utility/immUpdate';
import cnst from '../../utility/PostForm/constant';
import page from '../../utility/pageName';

const initState = {
    isAuth: false,
    isSignup: false,
    userDataUpdated: false,
    userDataUpdateError: null,

    changePasswordError: null,
    changePasswordMessage: null,

    token: null,
    userID: null,
    error: null,

    posts: [],
    profiles: [],

    email: null,
    firstName: null,
    lastName: null,
    rosterName: null,
    fbUserName: null,
    contactEmail: null,
    mobile: null,
    fleet: null,
    rank: null,
    emailVerified: false,

    // default for public user to view
    rank_display: cnst.SO,
    fleet_display: cnst.FLEET_AIRBUS,

    pending: false,
    message: '',
}

// reducer functions ---------------
const _authStart = (state) => {
    return immUpdate(state, { error: null });
};

const _authSuccess = (state, token, userID, userData) => {
    return immUpdate(state, {
        isAuth: true,
        token: token,
        userID: userID,
        ...userData,
        fleet_display: userData.fleet,
        rank_display: userData.rank,
        currentPage: page.HOME,
    });
};

const _authFail = (state, error) => {
    return immUpdate(state, {
        isAuth: false,
        error: error.replace(/_/g, ' '),
    });
};

const _logout = (state) => {
    return immUpdate(state, initState);
}

const _signupSuccess = (state) => {
    return immUpdate(state, {
        isSignup: true,
    });
}

const _updateUserDataInit = (state) => {
    return immUpdate(state, {
        userDataUpdated: false,
        userDataUpdateError: null,
    });
}

const _updateUserData = (state, userData) => {
    return immUpdate(state,
        {
            ...userData,
            fleet_display: userData.fleet,
            rank_display: userData.rank,
        });
}

const _updateUserDataSuccess = (state) => {
    return immUpdate(state, {
        userDataUpdated: true,
    });
}

const _updateUserDataFail = (state, error) => {
    return immUpdate(state, {
        userDataUpdated: false,
        userDataUpdateError: error,
    });
}

const _storePosts = (state, posts) => {
    return immUpdate(state, {
        posts: posts,
    })
}

const _storePostsAndProfiles = (state, posts, profiles) => {
    return immUpdate(state, {
        posts: posts,
        profiles: profiles,
    })
}

const _setCurrentPage = (state, page) => {
    return immUpdate(state, {
        currentPage: page,
    })
}

// reducer switch case ----------------
const reducer_auth = (state = initState, action) => {
    switch (action.type) {
        case act.AUTH_START: return _authStart(state);
        case act.AUTH_SUCCESS: return _authSuccess(state, action.token, action.userID, action.userData);
        case act.AUTH_FAILED: return _authFail(state, action.error);
        case act.LOGOUT: return _logout(state);
        case act.SIGNUP_SUCCESS: return _signupSuccess(state);

        case act.UPDATE_USER_DATA_INIT: return _updateUserDataInit(state);
        case act.UPDATE_USER_DATA: return _updateUserData(state, action.userData);
        case act.UPDATE_USER_DATA_SUCCESS: return _updateUserDataSuccess(state);
        case act.UPDATE_USER_DATA_FAIL: return _updateUserDataFail(state, action.error);

        case act.AUTHORIZED: return immUpdate(state, { isAuth: true });
        case act.UNAUTHORIZED: return immUpdate(state, { isAuth: false });

        case act.CHANGE_PASSWORD_INIT: return immUpdate(state, { changePasswordError: null });
        case act.CHANGE_PASSWORD_SUCCESS: return immUpdate(state, { changePasswordMessage: action.message });
        case act.CHANGE_PASSWORD_FAIL: return immUpdate(state, { changePasswordError: action.error });

        case act.PENDING: return immUpdate(state, { pending: true });
        case act.PENDING_OFF: return immUpdate(state, { pending: false });

        case act.CHANGE_FLEET_DISPLAY: return immUpdate(state, { fleet_display: action.fleet_display });
        case act.CHANGE_RANK_DISPLAY: return immUpdate(state, { rank_display: action.rank_display });

        case act.STORE_POSTS: return _storePosts(state, action.posts);
        case act.STORE_POSTS_AND_PROFILES: return _storePostsAndProfiles(state, action.posts, action.profiles);

        case act.SET_CURRENT_PAGE: return _setCurrentPage(state, action.page);

        case act.SET_MESSAGE: return immUpdate(state, {message: action.message})

        default:
            console.log('reducer_auth: Undefined action type:', action.type);
            return state;
    }
}

export default reducer_auth;