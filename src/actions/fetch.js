/**
 * Created by steve on 8/24/2016.
 */

import 'whatwg-fetch';
self.fetch.credentials = 'include';

import {compile} from 'path-to-regexp';

export default self.fetch.bind(self);
export const Headers = self.Headers;
export const Request = self.Request;
export const Response = self.Response;
import queryString from 'query-string';

export const fetchOptions = {
    PostJSON: (object, options = {}) => {
        return {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...options,
            body: JSON.stringify(object)
        };
    },
    Delete: () => {
        return {
            credentials: 'same-origin',
            method: 'DELETE'
        };
    }
};

const onErrorResponse = (response) => {
    if (response.ok) {
        return response;
    } else {
        const error = new Error(`${response.status} ${response.statusText}`);
        error.response = response;
        return Promise.reject(error);
    }
};

export function fetchGET(url, options = {}) {
    return new Promise((resolve, reject) => {
        fetch(url, {credentials: 'same-origin', ...options})
            .then(onErrorResponse)
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    reject(new Error(response.error));
                    return console.log(response.error);
                }
                resolve(response);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

export function fetchHTML(url, options = {}) {
    return new Promise((resolve, reject) => {
        fetch(url, {credentials: 'same-origin', ...options})
            .then(onErrorResponse)
            .then(response => response.text())
            .then(html => {
                resolve(html);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

export function fetchPOST(url, data, options = {}) {
    return new Promise((resolve, reject) => {
        fetch(url, fetchOptions.PostJSON(data, options))
            .then(onErrorResponse)
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    reject(new Error(response.error));
                    return console.log(response.error);
                }
                resolve(response);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

export function fetchPOST_FormData(url, data, options = {}) {
    try {
        const body = queryString.stringify(data);
        const fetchOptions = {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...(options.headers || {})
            },
            body: body,
        };
        return new Promise((resolve, reject) => {
            fetch(url, fetchOptions)
                .then(onErrorResponse)
                .then(response => response.json())
                .then(response =>{
                    if (response.error) {
                        reject(new Error(response.error));
                        return console.log(response.error);
                    }
                    resolve(response);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });

    } catch(err) {
        console.log("fetchPOST_FormData()", err.message);
        return Promise.reject(err);
    }
}

export function fetchDELETE(url) {
    return new Promise((resolve, reject) => {
        fetch(url, fetchOptions.Delete())
            .then(onErrorResponse)
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    throw new Error(response.error);
                }
                resolve(response);
            })
            .catch(err => {
                console.log('fetchDELETE()', err);
                reject(err);
            });
    });
}

/**
 *
 * @param {String} path
 * @param {Object} props
 * @return {String}
 */
export const buildPath = (path, props) => {
    try {
        return compile(path, {encode: encodeURIComponent})(props);
    } catch (e) {
        console.trace(e.message, path, props);
        return path;
    }
};
