"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var express = require("express");
var app = express();
var prefix = '';
if (!process.env.videofolder) {
    throw Error('no videofolder provided (by process env)');
}
var videofolder = process.env.VIDEOFOLDER;
if (process.env.PREFIX)
    prefix = process.env.PREFIX;
console.log(videofolder);
if (!process.env.mode) {
    app.use('/', index_1.default(videofolder));
}
else if (process.env.mode === 'user') {
    if (!process.env.SECRET) {
        throw Error('no secret provided (by process env)');
    }
    app.use('/restricted', index_1.default(videofolder, { mode: { type: 'users', secret: process.env.SECRET, ignoreExpiration: true } }));
}
app.listen(3000);
