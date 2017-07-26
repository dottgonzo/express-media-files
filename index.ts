import * as mediawatch from 'mediawatch'
import * as Promise from 'bluebird'
import * as express from 'express'
import * as bodyParser from 'body-parser'

const router = express.Router();

const fflist = new mediawatch.mediafiles({ path: '/home/dario/Video' })


router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


// use res.render to load up an ejs view file


function getFilesByToken(token){
return new Promise((resolve,reject)=>{




})

}



router.get('/user/:token/list', function (req, res) {
    res.json({ list: fflist.list })
})
router.get('/user/:token/listjs', function (req, res) {
    res.send('var list='+JSON.stringify(fflist.list))
})




export default router