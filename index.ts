import * as mediawatch from 'mediawatch'
import * as Promise from 'bluebird'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as  jwt from 'jsonwebtoken'


interface IMediaFileResp {
  meta: IMediaFileMeta
  duration: string
  path: string
  fullname: string
  name: string
  extension: string
  dir: string
  extensionFamily: string
  extensionType: string
  uid: string
}

interface IMediaFileMeta {

}

export default function (path, config?: { exclude?: string[], serverUri?: { path: string, uri: string }, mode?: { type: string, secret?: string, ignoreExpiration?: true } }) {

  let mode = 'rootuser'
  let secret: any = false
  if (config) {
    if (config.mode && config.mode.type === 'users' && config.mode.secret) {
      secret = config.mode.secret
      mode = 'users'
    }
  } else {
    config = {}
  }


  const router = express.Router();

  const fflist = new mediawatch.mediafiles({ path: path, exclude: config.exclude, serverUri: config.serverUri })


  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: true }))


  // use res.render to load up an ejs view file


  function getFilesByToken(token, list: IMediaFileResp[]): IMediaFileResp[] | false {

    try {
      const decoded = jwt.verify(token, config.mode.secret, { ignoreExpiration: config.mode.ignoreExpiration })
      const prefix: string = decoded.prefix
      const correctedList: IMediaFileResp[] = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.name.split(prefix).length > 1 && item.name.split(prefix)[0] === '') {
          correctedList.push(item)
        }
      }
      return correctedList
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
      let script = 'var mediaListArray=' + JSON.stringify(fflist.list) + ';'
      script += 'var mediaServerDb=' + req.protocol + '://' + req.get('host') + req.originalUrl.split('/listjs')[0] + ';'
      res.send(script)
    } else {
      res.send("alert('user mode not allowed')")
    }
  })



  router.get('/user/:token/list', function (req, res) {
    if (mode !== 'users') {
      res.json({ error: 'mode users' })
    } else {
      const byToken = getFilesByToken(req.params.token, fflist.list)
      if (byToken) {
        res.json({ list: byToken })
      } else {
        res.json({ error: 'json not valid' })
      }
    }
  })


  router.get('/user/:token/listjs', function (req, res) {
    if (mode === 'users') {
      const byToken = getFilesByToken(req.params.token, fflist.list)
      if (byToken) {
        let script = 'var mediaListArray=' + JSON.stringify(fflist.list) + ';'
        script += 'var mediaServerDb=' + req.protocol + '://' + req.get('host') + req.originalUrl.split('/user/')[0] + ';'
        res.send(script)
      } else {
        res.json({ error: 'json not valid' })
      }
    } else {
      res.json({ error: 'mode users' })
    }
  })

  router.get('/ping', function (req, res) {
    res.json({ pong: 'ok' })
  })

  return router
}