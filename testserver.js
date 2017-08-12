"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var express = require("express");
var jwt = require("jsonwebtoken");
var app = express();
var videofolder = __dirname + '/test/video/';
var testprefix = 'kasper';
var testsecret = 'shhhh';
var testtoken = jwt.sign({ prefix: testprefix }, testsecret);
app.use('/', index_1.default(videofolder));
app.use('/restricted', index_1.default(videofolder, { mode: { type: 'users', secret: testsecret, ignoreExpiration: true } }));
app.get('/testtoken', function (req, res) {
    res.json({ token: testtoken });
});
app.listen(3000);
