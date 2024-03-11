import Cookies from "js-cookie";
export function isLoggedIn()    {
    return Cookies.get("jwt_authorization") !== undefined;
}


export function getRedirectToAfterLogin()    {
    return Cookies.get("redirect_to") ?? '/page/account/dashboard';
}


export function getUserInfoFromJwt()    {
    const jwt = Cookies.get("jwt_authorization");
    if (jwt === undefined) return undefined;

    const jwtPayload = jwt.split(".")[1];
    const jwtPayloadDecoded = atob(jwtPayload);
    return JSON.parse(jwtPayloadDecoded);
}

export function logout()    {
    Cookies.remove("jwt_authorization");
    Cookies.remove("redirect_to");
    window.location.href = "/";
}

/**
 * Remove leading and trailing spaces from a string
 * @param string
 * @returns {*}
 */
export function lrt (string) {
    return string.replace(/^\s+|\s+$/gm,'');
}

export function getApiConfig() {
    return {
        baseUrl: "http://localhost:6001",
        // baseUrl: "https://mg-api.wikismarts.com",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${
                Cookies.get('jwt_authorization')}`,
        },
    };
}

