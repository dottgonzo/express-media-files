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
    else {
        config = {};
    }
    var router = express.Router();
    var fflist = new mediawatch.mediafiles({ path: path, exclude: config.exclude, serverUri: config.serverUri });
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
            var script = 'var mediaListArray=' + JSON.stringify(fflist.list) + ';';
            script += 'var mediaServerDb=' + req.protocol + '://' + req.get('host') + req.originalUrl + ';';
            res.send(script);
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
