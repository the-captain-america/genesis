import axios from 'axios';

// Change url here:
const URL = {
    loginUrl: `/login`
};

// hardcoded authentication
const auth = ({ username, password }) => {
    return new Promise((resolve, reject) => {
        const axiosConfig = {};
        axiosConfig.headers = {};
        axiosConfig.headers['content-type'] = 'application/json;charset=UTF-8';
        axiosConfig.headers['X-Requested-With'] = 'XMLHttpRequest';
        axiosConfig.headers['auth-token'] =
            '5c334e6c63533988636d5632615756994c333d3d';
        axiosConfig.url = URL.loginUrl;
        axiosConfig.method = 'post';
        axiosConfig.data = {
            username,
            password
        };
        axios
            .request(axiosConfig)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

export default auth;
