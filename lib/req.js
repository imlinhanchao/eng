const request = require('request-promise').defaults({
    jar: true,
    simple: false,
    resolveWithFullResponse: true
});
const urlencode = require('urlencode');
const iconv = require('iconv-lite');

const modules = require('../modules.js');
const App = modules.app;

module.exports.get = async function (url, encoding = 'utf-8') {
    let options = {
        url: url,
        encoding: null
    };

    let rsp = await request.get(options);
    if (rsp.statusCode >= 400) {
        throw (App.error.network('访问失败！'));
    }

    rsp.body = iconv.decode(rsp.body, encoding);
    return rsp;
};

module.exports.post = async function (url, formData, encoding = 'utf-8') {
    let options = {
        url: url,
        form: formData,
        encoding: null
    };

    let rsp = await request.post(options);
    if (!rsp || rsp.statusCode >= 400) {
        throw (App.error.network('访问失败！'));
    }

    rsp.body = iconv.decode(rsp.body, encoding);

    return rsp;
};

module.exports.json = async function (url, json) {
    let options = {
        url: url,
        json: true,
        encoding: null,
        body: json
    };

    let rsp = await request.post(options);
    if (!rsp || rsp.statusCode >= 400) {
        throw (App.error.network('访问失败！'));
    }

    rsp.body = rsp.body;

    return rsp;
};

module.exports.toFormData = function (obj, encoding) {
    let data = '';
    for (let k in obj) {
        let val = obj[k].toString().match(/^\w+$/) ? obj[k] : urlencode(obj[k], encoding);
        data += '&' + k + '=' + val;
    }
    return data.replace(/^&+/, '');
};

module.exports.send = request;