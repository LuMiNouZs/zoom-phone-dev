
// Login Page
export const APP_SAVE_FORCE_UPDATE = "APP_SAVE_FORCE_UPDATE";

// Login Page
export const HTTP_LOGIN_FETCHING = "HTTP_LOGIN_FETCHING";
export const HTTP_LOGIN_SUCCESS = "HTTP_LOGIN_SUCCESS";
export const HTTP_LOGIN_FAILED = "HTTP_LOGIN_FAILED";

// Error Code
export const E_PICKER_CANCELLED = 'E_PICKER_CANCELLED'
export const E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR = 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR'
export const E_PERMISSION_MISSING = 'E_PERMISSION_MISSING'
export const E_PICKER_NO_CAMERA_PERMISSION = 'E_PICKER_NO_CAMERA_PERMISSION'
export const E_USER_CANCELLED = 'E_USER_CANCELLED'
export const E_UNKNOWN = 'E_UNKNOWN'
export const E_DEVELOPER_ERROR = 'E_DEVELOPER_ERROR'
export const TIMEOUT_NETWORK = 'ECONNABORTED' // request service timeout
export const NOT_CONNECT_NETWORK = 'NOT_CONNECT_NETWORK' 

//////////////// Localization Begin ////////////////
export const NETWORK_CONNECTION_MESSAGE = 'Cannot connect to server, Please try again.' 
export const NETWORK_TIMEOUT_MESSAGE = 'A network timeout has occurred, Please try again.'  
export const UPLOAD_PHOTO_FAIL_MESSAGE = 'An error has occurred. The photo was unable to upload.' 


//192.168.20.241:8081
//export const apiUrl =  "https://192.168.20.241:8443/zoom-phone/api/v1";
//export const apiUrl =  "http://backend-api.1-to-all.co.th:8443/zoom-phone/api/v1";
//export const apiUrl =  "http://backend-api.1-to-all.co.th:8081/zoom-phone/api/v1";
export const apiUrl = "https://sandbox.1-to-all.com:8443/zoom-phone/api/v1"
// export const imageUrl = "http://backend-api.1-to-all.co.th:8081";

export const server = {    
    LOGIN_URL : `login`,  
    OAUTH_URL : `oauthToken`, 
    REFRESH_TOKEN_URL : `refreshOauthToken`, 
    PHONETRANSFER_URL : `zoomPhone`,
    ZOOMEXCHANGE_URL :`zoomExchange`,
    PEERING_NUMBER_URL:`zoomExchange/peering/number`,
    TOKEN_KEY : `token`,
    ACCESS_TOKEN : `access_token`,
    REFRESH_TOKEN : `refresh_token`,
    PROFILE_NAME : `profileName`,
    PROFILE_ID : `profileId`,
}

