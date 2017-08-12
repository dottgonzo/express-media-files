"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var rpj = require("request-promise-json");
var child_process_1 = require("child_process");
var expect = chai.expect;
var serverstart;
var token;
describe('main test express media files for restricted systems', function () {
    this.timeout(20000);
    before(function (cb) {
        serverstart = child_process_1.fork(__dirname + '/../testserver', [], { silent: false });
        setTimeout(function () {
            cb();
        }, 1000);
    });
    describe(' server is running?', function () {
        it('answer to ping request', function (done) {
            rpj.get('http://localhost:3000/restricted/ping').then(function (a) {
                expect(a).to.be.ok;
                expect(a).to.have.property('pong').that.eq('ok');
                done();
            }).catch(function (err) {
                done(new Error(err));
            });
        });
        it('get test token (for test only)', function (done) {
            rpj.get('http://localhost:3000/testtoken').then(function (a) {
                expect(a).to.be.ok;
                expect(a).to.have.property('token').that.is.ok;
                token = a.token;
                done();
            }).catch(function (err) {
                done(new Error(err));
            });
        });
    });
    describe('check list', function () {
        it('get list for user', function (done) {
            rpj.get('http://localhost:3000/restricted/user/' + token + '/list').then(function (a) {
                expect(a).to.be.ok;
                expect(a).to.have.property('list').that.is.an('Array');
                done();
            }).catch(function (err) {
                done(new Error(err));
            });
        });
    });
    after(function (cb) {
        serverstart.kill();
        cb();
    });
});
