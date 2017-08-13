"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var express = require("express");
var jwt = require("jsonwebtoken");
var app = express();
var mountpoint = '/app';
var prefix = '';
if (!process.env.VIDEOFOLDER) {
    throw Error('no videofolder provided (by process env)');
}
var videofolder = process.env.VIDEOFOLDER;
if (process.env.PREFIX)
    prefix = process.env.PREFIX;
if (!process.env.SERVERURI) {
    throw Error('no SERVERURI provided (by process env)');
}
if (!process.env.PORT) {
    process.env.PORT = 3000;
}
if (!process.env.MODE) {
    app.use(mountpoint, index_1.default(videofolder, { serverUri: { path: videofolder, uri: process.env.SERVERURI + mountpoint + '/videolibrary/' } }));
    console.log(videofolder);
}
else if (process.env.MODE === 'user') {
    if (!process.env.SECRET) {
        throw Error('no secret provided (by process env)');
    }
    app.use('/app', index_1.default(videofolder, { mode: { type: 'users', secret: process.env.SECRET, ignoreExpiration: true }, serverUri: { path: videofolder, uri: process.env.SERVERURI + mountpoint + '/videolibrary/' } }));
    console.log(jwt.sign({ prefix: '' }, process.env.SECRET));
}
app.listen(process.env.PORT);
