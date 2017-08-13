"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var express = require("express");
var jwt = require("jsonwebtoken");
var app = express();
var prefix = '';
if (!process.env.VIDEOFOLDER) {
    throw Error('no videofolder provided (by process env)');
}
var videofolder = process.env.VIDEOFOLDER;
if (process.env.PREFIX)
    prefix = process.env.PREFIX;
if (!process.env.MODE) {
    app.use('/app', index_1.default(videofolder));
    console.log(videofolder);
}
else if (process.env.MODE === 'user') {
    if (!process.env.SECRET) {
        throw Error('no secret provided (by process env)');
    }
    app.use('/app', index_1.default(videofolder, { mode: { type: 'users', secret: process.env.SECRET, ignoreExpiration: true } }));
    console.log(jwt.sign({ prefix: '' }, process.env.SECRET));
}
app.listen(3000);
