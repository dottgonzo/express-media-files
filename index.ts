import * as mediawatch from 'mediawatch'
import * as Promise from 'bluebird'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as  jwt from 'jsonwebtoken'


export default function (path, config?: { mode?: { type: string, secret?: string, ignoreExpiration?: true } }) {

  let mode = 'rootuser'
  let secret: any = false
  if (config) {
    if (config.mode && config.mode.type === 'restricted' && config.mode.secret) {
      secret = config.mode.secret
      mode = 'users'
    }
  }


  const router = express.Router();

  const fflist = new mediawatch.mediafiles({ path: path })


  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: true }))


  // use res.render to load up an ejs view file


  function getFilesByToken(token) {

    try {
      const decoded = jwt.verify(token, config.mode.secret, { ignoreExpiration: config.mode.ignoreExpiration })
      return JSON.parse(decoded).prefix
    } catch (err) {
      return false
    }


  }
  router.get('/list', function (req, res) {
    if (mode === 'rootuser') {
      res.json({ list: fflist.list })
    } else {
      res.json({ error: 'rootmode not allowed' })
    }
  })
  router.get('/listjs', function (req, res) {
    if (mode === 'rootuser') {
      res.send('var list=' + JSON.stringify(fflist.list))
    } else {
      res.send("alert('user mode not allowed')")
    }
  })



  router.get('/user/:token/list', function (req, res) {
    if (mode !== 'users') {

      res.json({ error: 'mode users' })


    } else {


      if (getFilesByToken(res.params.token)) {

        res.json({ list: fflist.list })

      } else {
        res.json({ error: 'json not valid' })
      }

    }
  })


  router.get('/user/:token/listjs', function (req, res) {

    if (mode === 'users') {

      if (getFilesByToken(res.params.token)) {

        res.send('var list=' + JSON.stringify(fflist.list))
      } else {
        res.json({ error: 'json not valid' })
      }
    } else {
      res.json({ error: 'mode users' })
    }

  })


  return router



}