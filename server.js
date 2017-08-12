"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var express = require("express");
var app = express();
var prefix = '';
if (!process.env.videofolder) {
    throw Error('no videofolder provided (by process env)');
}
var videofolder = process.env.videofolder;
if (process.env.prefix)
    prefix = process.env.prefix;
console.log(videofolder);
if (!process.env.mode) {
    app.use('/', index_1.default(videofolder));
}
else if (process.env.mode === 'user') {
    if (!process.env.secret) {
        throw Error('no secret provided (by process env)');
    }
    app.use('/restricted', index_1.default(videofolder, { mode: { type: 'users', secret: process.env.secret, ignoreExpiration: true } }));
}
app.listen(3000);
