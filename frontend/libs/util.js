import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - 我的会议室' : '我的会议室';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'api/' :
    env === 'production' ?
    'api/' :
    'api/';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

export default util;