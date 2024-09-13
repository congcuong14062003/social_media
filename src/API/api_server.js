const API_HOST = 'http://localhost:1406';

// User account API endpoints
const API_SIGNUP_POST = API_HOST + '/users/signup';

const API_LOGIN_POST = API_HOST + '/users/login';
const API_GET_ALL_USERS = API_HOST + '/users/all-user';

const API_LOGOUT = API_HOST + '/users/logout';



const API_SIGNUP_SOCIALNETWORK_POST = API_HOST + '/users/social-network/signup';

const API_GET_USER_BY_ID = (id) => `${API_HOST}/users/info/${id}`;
const API_UPDATE_USER = (id) => `${API_HOST}/users/update/${id}`;
const API_UPDATE_USER_PASSWORD = `${API_HOST}/users/reset-password`;
const API_DELETE_USER = (id) => `${API_HOST}/users/delete/${id}`;
const API_CHECK_EXIST_USER = (id) => `${API_HOST}/users/is-existed/${id}`;
const API_ADD_FRIEND = (id) => `${API_HOST}/users/add-friend/${id}`;
const API_ACCEPT_INVITE = (id) => `${API_HOST}/users/accept-add-friend/${id}`;


const API_LIST_FRIEND_INVITE = API_HOST + '/users/list-friend-invite'
// User infomanation API endpoint
const API_GET_INFO_USER_PROFILE_BY_ID = (id) => `${API_HOST}/users/info-profile/${id}`;
const API_GET_INFO_OWNER_PROFILE_BY_ID = `${API_HOST}/users/info-profile/`;


//Token
// const API_LOGOUT = API_HOST + '/token/delete';
const API_ROTATION_TOKEN = API_HOST + '/token/create';
const API_DECODE_TOKEN = API_HOST + '/token/decode-refresh-token';

// OTP API endpoints
const API_CREATE_OTP = API_HOST + '/otp/create';
const API_CREATE_LINK_OTP = API_HOST + '/otp/link/create';
const API_CREATE_OTP_SIGNUP = API_HOST + '/otp/signup/create';
const API_VERIFY_OTP = API_HOST + '/otp/verify';

export {
    API_SIGNUP_POST,
    API_LOGIN_POST,
    API_LOGOUT,
    API_GET_ALL_USERS,
    API_GET_USER_BY_ID,
    API_GET_INFO_USER_PROFILE_BY_ID,
    API_GET_INFO_OWNER_PROFILE_BY_ID,
    API_UPDATE_USER,
    API_UPDATE_USER_PASSWORD,
    API_DELETE_USER,
    API_CHECK_EXIST_USER,
    API_ADD_FRIEND,
    API_ACCEPT_INVITE,
    API_SIGNUP_SOCIALNETWORK_POST,
    API_DECODE_TOKEN,
    API_ROTATION_TOKEN,
    API_CREATE_OTP,
    API_CREATE_LINK_OTP,
    API_CREATE_OTP_SIGNUP,
    API_VERIFY_OTP,
    API_LIST_FRIEND_INVITE
};
