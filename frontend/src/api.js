export const API_URL = getEnvApiUrl();

function getEnvApiUrl() {
    try {
        const meta = new Function('return import.meta')();
        if (meta && meta.env && meta.env.VITE_API_URL) {
            return meta.env.VITE_API_URL;
        }
    } catch (e) {
        // ignore
    }

    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }

    return 'http://localhost:5000';
}

export function api(path, options = {}) {
    return fetch(`${API_URL}${path}`, options);
}
