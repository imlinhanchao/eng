var fs = require('fs');
var path = require('path')
const request = require('request').defaults({ jar: true });
const basecfg = require(process.cwd() + '/config').base;

module.exports = {
    download: function (url, filename, req = request,
        errorfn = function (err) { }, closefn = function () { }) {
        var filepath = path.join(process.cwd(), basecfg.upload, filename);
        this.mkdir(path.dirname(filepath));
        var fws = fs.createWriteStream(filepath);
        fws.on("close", closefn);
        fws.on('error', errorfn);
        req.get(url, function (err, res, body) {
            if (err || res.statusCode != 200) {
                try {
                    fws.close();
                } catch (error) {
                }
            }
        }).pipe(fws);
        return {
            url: basecfg.fileurl + filename,
            path: filepath
        };
    },

    exists: function (directory) {
        return fs.existsSync(directory);
    },

    mkdir: function (directory) {
        if (this.exists(directory)) return;
        fs.mkdirSync(directory);
    },

    del: function (file) {
        fs.unlink(file)
    }
}