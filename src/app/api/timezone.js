import axios from 'axios';
import mockData from './mock/timezone.json';

const URL = {
    timezoneURL: `/v1/category/tzlist`
};

const timezone = () => {
    return new Promise((resolve, reject) => {
        const axiosConfig = {};
        axiosConfig.headers = {};
        axiosConfig.headers['content-type'] = 'application/json;charset=UTF-8';
        axiosConfig.headers['X-Requested-With'] = 'XMLHttpRequest';
        axiosConfig.url = URL.timezoneURL;
        axiosConfig.method = 'get';
        axiosConfig.data = {};
        axios
            .request(axiosConfig)
            .then(response => {
                // resolve(response.data);
                resolve(mockData);
            })
            .catch(error => {
                // reject(error);
                resolve(mockData);
            });
    });
};

export default timezone;
