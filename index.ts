import * as mediawatch from 'mediawatch'
import * as Promise from 'bluebird'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as  jwt from 'jsonwebtoken'
import * as ffvideoconverter from 'ffvideoconverter'
import * as rpj from 'request-promise-json'


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

function getFilesByToken(token, list: IMediaFileResp[], mode): IMediaFileResp[] | false {

  try {
    const decoded = jwt.verify(token, mode.secret, { ignoreExpiration: mode.ignoreExpiration })
    const prefix: string = decoded.prefix
    if (prefix) {
      const correctedList: IMediaFileResp[] = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.name.split(prefix).length > 1 && item.name.split(prefix)[0] === '') {
          correctedList.push(item)
        }
      }
      return correctedList
    } else {
      return list
    }

  } catch (err) {
    console.log(err)
    return false
  }


}


function checkfile(token, list: IMediaFileResp[], mode, filePath, serverPath) {
  let exists = false
  const newlist = getFilesByToken(token, list, mode)
  if (newlist) {
    for (let i = 0; i < newlist.length; i++) {
      console.log(newlist[i].path, serverPath + filePath)
      if (newlist[i].path === serverPath + filePath) exists = true
    }
  }

  if (exists) {
    return true
  } else {
    return false
  }
}

function basicAuth(req, mode, list, serverPath) {
  if (req.query && req.query.token) {

    try {
      const token = jwt.verify(req.query.token, mode.secret)
      console.log('decoded', token)
      if (token && token.prefix !== false) {
        const file = req.originalUrl.split('?')[0].split('/')[req.originalUrl.split('?')[0].split('/').length - 1]
        let filteredlist = checkfile(req.query.token, list, mode, file, serverPath)
        console.log(file)

        console.log(filteredlist)

        if (filteredlist) {
          console.log(getFilesByToken(req.query.token, list, mode))
          return true

        } else {

          return false

        }

      } else {
        return false

      }
    } catch (err) {
      console.error('unauthorized')
      return false

    }

  } else {
    return false
  }

}
function auth(req, res, next, mode, list, serverPath) {


  if (basicAuth(req, mode, list, serverPath))
    return next()
  else {

    return res.sendStatus(401)
  }
}

export default function (path, config?: { exclude?: string[], serverUri?: { path: string, uri: string }, mode?: { type: string, secret?: string, ignoreExpiration?: true }, conversion?: { dest: string, prefix?: string } }) {

  let mode = 'rootuser'
  let secret: any = false
  const router = express.Router();

  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: true }))

  if (config) {
    if (config.mode && config.mode.type === 'users' && config.mode.secret) {
      secret = config.mode.secret
      mode = 'users'
    }
  } else {
    config = {}
    router.use('/video', express.static(path))

  }




  const fflist = new mediawatch.mediafiles({ path: path, exclude: config.exclude, serverUri: config.serverUri })

  if (mode === 'users') {
    router.use(function (req, res, next) {
      if (req.url.indexOf('videolibrary') != -1) {
        console.log(req.query);
        return auth(req, res, next, config.mode, fflist.list, path);
      }
      else
        next();
    });
    router.use('/videolibrary', express.static(path))

  }

  // use res.render to load up an ejs view file



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
      script += 'var mediaServerDb="' + req.protocol + '://' + req.get('host') + req.originalUrl.split('/listjs')[0] + '";'
      res.send(script)
    } else {
      res.send("alert('user mode not allowed')")
    }
  })



  router.get('/user/:token/list', function (req, res) {
    if (mode !== 'users') {
      res.json({ error: 'mode users' })
    } else {
      const byToken = getFilesByToken(req.params.token, fflist.list, config.mode)
      if (byToken) {
        res.json({ list: byToken })
      } else {
        res.json({ error: 'json not valid' })
      }
    }
  })


  router.get('/user/:token/listjs', function (req, res) {
    if (mode === 'users') {
      const byToken = getFilesByToken(req.params.token, fflist.list, config.mode)
      if (byToken) {
        let script = 'var mediaListArray=' + JSON.stringify(byToken) + ';'
        script += 'var mediaServerDb="' + req.protocol + '://' + req.get('host') + req.originalUrl.split('/user/')[0] + '";'
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


  if (config.conversion && config.conversion.dest) {
    router.post('/convert', function (req, res) {
      const data = req.body

      const fileexist = checkfile(data.token, fflist.list, config.mode, data.video.path, path)
      
      
        if (fileexist) {
          console.log(data.video.path, { startTime: data.cut.data.from, duration: data.cut.data.duration })


          const ffmpeg = new ffvideoconverter.FFVideoConvert({ destinationPath: config.conversion.dest })

          ffmpeg.cutVideo(data.video.path, { startTime: data.cut.data.from, duration: data.cut.data.duration }).then(() => {
            res.json({ ok: true })
          }).catch((err) => {
            console.log({ error: 'file not exists or you are unauthorized' })
          })
        } else {
          res.json({ error: 'file not exists or you are unauthorized' })
        }
 
        


    })

  }

  return router
}