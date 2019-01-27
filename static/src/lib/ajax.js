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

export function get (url, params) {
    return axios.get(parseUrl(url), { params });
}

export function post (url, data) {
    return axios.post(parseUrl(url), data);
}
