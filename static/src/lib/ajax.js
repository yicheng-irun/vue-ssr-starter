import axios from 'axios';
import runtime from './runtime';
import urlLib from 'url';

function parseUrl (url) {
    if (runtime.isServer) {
        const result = urlLib.resolve(runtime.serverOrigin, url);
        return result;
    }
    return url;
}

/**
 * add headers to server side requests
 */
function getHeaders () {
    if (runtime.isServer) {
        return {
            ...runtime.action.req.headers,
            accept: '*/*',
        };
    }
    return undefined;
}

export function get (url, params) {
    return axios.get(parseUrl(url), {
        params,
        headers: getHeaders(),
    });
}

export function post (url, data, params) {
    return axios.post(parseUrl(url), data, {
        params,
        headers: getHeaders(),
    });
}
