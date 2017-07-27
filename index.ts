import * as mediawatch from 'mediawatch'
import * as Promise from 'bluebird'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as  jwt from 'jsonwebtoken'


export default function (path, config?: { mode?: { type: string, secret?: string } }) {


    const router = express.Router();

    const fflist = new mediawatch.mediafiles({ path: path })


    router.use(bodyParser.json())
    router.use(bodyParser.urlencoded({ extended: true }))


    // use res.render to load up an ejs view file


    function getFilesByToken(token) {
        return new Promise((resolve, reject) => {




        })

    }
    router.get('/list', function (req, res) {
        if (!config || !config.mode || config.mode.type !== 'restricted') {
            res.json({ list: fflist.list })
        } else {
            res.json({ error: 'rootmode not allowed' })
        }
    })
    router.get('/listjs', function (req, res) {
        if (!config || !config.mode || config.mode.type !== 'restricted') {
            res.send('var list=' + JSON.stringify(fflist.list))
        } else {
            res.send("alert('user mode not allowed')")
        }
    })



    router.get('/user/:token/list', function (req, res) {

        if(){

            res.json({ list: fflist.list })

        } else {
            res.json({error:'json not valid'})
        }

    })
    router.get('/user/:token/listjs', function (req, res) {
        res.send('var list=' + JSON.stringify(fflist.list))
    })


    return router



}