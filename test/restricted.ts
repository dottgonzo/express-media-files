import * as chai from "chai";


import * as rpj from "request-promise-json";

import { fork } from "child_process";

const expect = chai.expect

let serverstart
let token

describe('main test express media files for restricted systems', function () {
    this.timeout(20000)
    before(function (cb) {


        serverstart = fork(__dirname + '/../testserver', [], { silent: false })
        setTimeout(() => {
            cb()
        }, 1000)

    })

    describe(' server is running?', function () {

        it('answer to ping request', function (done) {
            rpj.get('http://localhost:3000/restricted/ping').then((a) => {

                expect(a).to.be.ok
                expect(a).to.have.property('pong').that.eq('ok')
                done()

            }).catch((err) => {
                done(new Error(err))
            })
        })

        it('get test token (for test only)', function (done) {
            rpj.get('http://localhost:3000/testtoken').then((a) => {

                expect(a).to.be.ok
                expect(a).to.have.property('token').that.is.ok
                token = a.token
                done()

            }).catch((err) => {
                done(new Error(err))
            })
        })


    })



    describe('check list', function () {

        it('get list for user', function (done) {
            rpj.get('http://localhost:3000/restricted/user/' + token + '/list').then((a) => {

                expect(a).to.be.ok
                expect(a).to.have.property('list').that.is.an('Array')
                done()

            }).catch((err) => {
                done(new Error(err))
            })
        })

    })



    after(function (cb) {

        serverstart.kill()
        cb()
    })

})

