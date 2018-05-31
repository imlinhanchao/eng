import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - 自考英语查询' : '自考英语查询';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:7803/' :
    env === 'production' ?
    '/' :
    '/';

util.ajaxUrl = ajaxUrl;

export default util;