import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - 自考英语查询' : '自考英语查询';
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