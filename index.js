"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mediawatch = require("mediawatch");
var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
function default_1(path, config) {
    var mode = 'rootuser';
    var secret = false;
    if (config) {
        if (config.mode && config.mode.type === 'users' && config.mode.secret) {
            secret = config.mode.secret;
            mode = 'users';
        }
    }
    var router = express.Router();
    var fflist = new mediawatch.mediafiles({ path: path });
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));
    function getFilesByToken(token, list) {
        try {
            var decoded = jwt.verify(token, config.mode.secret, { ignoreExpiration: config.mode.ignoreExpiration });
            var prefix = decoded.prefix;
            var correctedList = [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.name.split(prefix).length > 1 && item.name.split(prefix)[0] === '') {
                    correctedList.push(item);
                }
            }
            return correctedList;
        }
        catch (err) {
            return false;
        }
    }
    router.get('/list', function (req, res) {
        if (mode === 'rootuser') {
            res.json({ list: fflist.list });
        }
        else {
            res.json({ error: 'rootmode not allowed' });
        }
    });
    router.get('/listjs', function (req, res) {
        if (mode === 'rootuser') {
            res.send('var list=' + JSON.stringify(fflist.list));
        }
        else {
            res.send("alert('user mode not allowed')");
        }
    });
    router.get('/user/:token/list', function (req, res) {
        if (mode !== 'users') {
            res.json({ error: 'mode users' });
        }
        else {
            var byToken = getFilesByToken(req.params.token, fflist.list);
            if (byToken) {
                res.json({ list: byToken });
            }
            else {
                res.json({ error: 'json not valid' });
            }
        }
    });
    router.get('/user/:token/listjs', function (req, res) {
        if (mode === 'users') {
            var byToken = getFilesByToken(req.params.token, fflist.list);
            if (byToken) {
                res.send('var list=' + JSON.stringify(byToken));
            }
            else {
                res.json({ error: 'json not valid' });
            }
        }
        else {
            res.json({ error: 'mode users' });
        }
    });
    router.get('/ping', function (req, res) {
        res.json({ pong: 'ok' });
    });
    return router;
}
exports.default = default_1;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0FBQztZQUNyQixJQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzlELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1lBQ2pELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQTtZQUN2QyxDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFBO1FBQ25DLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsR0FBRyxFQUFFLEdBQUc7UUFDcEMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQzFCLENBQUMsQ0FBQyxDQUFBO0lBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQTtBQUNmLENBQUM7QUE1RkQsNEJBNEZDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbWVkaWF3YXRjaCBmcm9tICdtZWRpYXdhdGNoJ1xuaW1wb3J0ICogYXMgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcbmltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcbmltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInXG5pbXBvcnQgKiBhcyAgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcblxuXG5pbnRlcmZhY2UgSU1lZGlhRmlsZVJlc3Age1xuICBtZXRhOiBJTWVkaWFGaWxlTWV0YVxuICBkdXJhdGlvbjogc3RyaW5nXG4gIHBhdGg6IHN0cmluZ1xuICBmdWxsbmFtZTogc3RyaW5nXG4gIG5hbWU6IHN0cmluZ1xuICBleHRlbnNpb246IHN0cmluZ1xuICBkaXI6IHN0cmluZ1xuICBleHRlbnNpb25GYW1pbHk6IHN0cmluZ1xuICBleHRlbnNpb25UeXBlOiBzdHJpbmdcbn1cbmludGVyZmFjZSBJTWVkaWFGaWxlTWV0YSB7XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGF0aCwgY29uZmlnPzogeyBtb2RlPzogeyB0eXBlOiBzdHJpbmcsIHNlY3JldD86IHN0cmluZywgaWdub3JlRXhwaXJhdGlvbj86IHRydWUgfSB9KSB7XG5cbiAgbGV0IG1vZGUgPSAncm9vdHVzZXInXG4gIGxldCBzZWNyZXQ6IGFueSA9IGZhbHNlXG4gIGlmIChjb25maWcpIHtcbiAgICBpZiAoY29uZmlnLm1vZGUgJiYgY29uZmlnLm1vZGUudHlwZSA9PT0gJ3VzZXJzJyAmJiBjb25maWcubW9kZS5zZWNyZXQpIHtcbiAgICAgIHNlY3JldCA9IGNvbmZpZy5tb2RlLnNlY3JldFxuICAgICAgbW9kZSA9ICd1c2VycydcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgY29uc3QgZmZsaXN0ID0gbmV3IG1lZGlhd2F0Y2gubWVkaWFmaWxlcyh7IHBhdGg6IHBhdGggfSlcblxuXG4gIHJvdXRlci51c2UoYm9keVBhcnNlci5qc29uKCkpXG4gIHJvdXRlci51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpXG5cblxuICAvLyB1c2UgcmVzLnJlbmRlciB0byBsb2FkIHVwIGFuIGVqcyB2aWV3IGZpbGVcblxuXG4gIGZ1bmN0aW9uIGdldEZpbGVzQnlUb2tlbih0b2tlbiwgbGlzdDogSU1lZGlhRmlsZVJlc3BbXSk6IElNZWRpYUZpbGVSZXNwW10gfCBmYWxzZSB7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZGVjb2RlZCA9IGp3dC52ZXJpZnkodG9rZW4sIGNvbmZpZy5tb2RlLnNlY3JldCwgeyBpZ25vcmVFeHBpcmF0aW9uOiBjb25maWcubW9kZS5pZ25vcmVFeHBpcmF0aW9uIH0pXG4gICAgICBjb25zdCBwcmVmaXg6IHN0cmluZyA9IGRlY29kZWQucHJlZml4XG4gICAgICBjb25zdCBjb3JyZWN0ZWRMaXN0OiBJTWVkaWFGaWxlUmVzcFtdID0gW11cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpdGVtID0gbGlzdFtpXVxuICAgICAgICBpZiAoaXRlbS5uYW1lLnNwbGl0KHByZWZpeCkubGVuZ3RoID4gMSAmJiBpdGVtLm5hbWUuc3BsaXQocHJlZml4KVswXSA9PT0gJycpIHtcbiAgICAgICAgICBjb3JyZWN0ZWRMaXN0LnB1c2goaXRlbSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNvcnJlY3RlZExpc3RcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuXG4gIH1cbiAgcm91dGVyLmdldCgnL2xpc3QnLCBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICBpZiAobW9kZSA9PT0gJ3Jvb3R1c2VyJykge1xuICAgICAgcmVzLmpzb24oeyBsaXN0OiBmZmxpc3QubGlzdCB9KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMuanNvbih7IGVycm9yOiAncm9vdG1vZGUgbm90IGFsbG93ZWQnIH0pXG4gICAgfVxuICB9KVxuICByb3V0ZXIuZ2V0KCcvbGlzdGpzJywgZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgaWYgKG1vZGUgPT09ICdyb290dXNlcicpIHtcbiAgICAgIHJlcy5zZW5kKCd2YXIgbGlzdD0nICsgSlNPTi5zdHJpbmdpZnkoZmZsaXN0Lmxpc3QpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc2VuZChcImFsZXJ0KCd1c2VyIG1vZGUgbm90IGFsbG93ZWQnKVwiKVxuICAgIH1cbiAgfSlcblxuXG5cbiAgcm91dGVyLmdldCgnL3VzZXIvOnRva2VuL2xpc3QnLCBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICBpZiAobW9kZSAhPT0gJ3VzZXJzJykge1xuICAgICAgcmVzLmpzb24oeyBlcnJvcjogJ21vZGUgdXNlcnMnIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJ5VG9rZW4gPSBnZXRGaWxlc0J5VG9rZW4ocmVxLnBhcmFtcy50b2tlbiwgZmZsaXN0Lmxpc3QpXG4gICAgICBpZiAoYnlUb2tlbikge1xuICAgICAgICByZXMuanNvbih7IGxpc3Q6IGJ5VG9rZW4gfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5qc29uKHsgZXJyb3I6ICdqc29uIG5vdCB2YWxpZCcgfSlcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cblxuICByb3V0ZXIuZ2V0KCcvdXNlci86dG9rZW4vbGlzdGpzJywgZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgaWYgKG1vZGUgPT09ICd1c2VycycpIHtcbiAgICAgIGNvbnN0IGJ5VG9rZW4gPSBnZXRGaWxlc0J5VG9rZW4ocmVxLnBhcmFtcy50b2tlbiwgZmZsaXN0Lmxpc3QpXG4gICAgICBpZiAoYnlUb2tlbikge1xuICAgICAgICByZXMuc2VuZCgndmFyIGxpc3Q9JyArIEpTT04uc3RyaW5naWZ5KGJ5VG9rZW4pKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzLmpzb24oeyBlcnJvcjogJ2pzb24gbm90IHZhbGlkJyB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMuanNvbih7IGVycm9yOiAnbW9kZSB1c2VycycgfSlcbiAgICB9XG4gIH0pXG5cbiAgcm91dGVyLmdldCgnL3BpbmcnLCBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICByZXMuanNvbih7IHBvbmc6ICdvaycgfSlcbiAgfSlcblxuICByZXR1cm4gcm91dGVyXG59Il19
