import * as chai from "chai";


import * as rpj from "request-promise-json";

import { fork } from "child_process";

const expect = chai.expect

let serverstart


describe('main test express media files for open systems', function () {
    this.timeout(20000)
    before(function (cb) {
        serverstart = fork(__dirname + '/../testserver', [], { silent: false })
        setTimeout(() => {
            cb()
        }, 1000)
    })

    describe(' server is running?', function () {

        it('answer to ping request', function (done) {
            rpj.get('http://localhost:3000/ping').then((a) => {

                expect(a).to.be.ok
                expect(a).to.have.property('pong').that.eq('ok')
                done()

            }).catch((err) => {
                done(new Error(err))
            })
        })

    })



    describe('check list as rootuser', function () {

        it('works as rootuser', function (done) {
            rpj.get('http://localhost:3000/list').then((a) => {

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

