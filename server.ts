import router from './index'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'

const app = express()

const mountpoint='/app'

let prefix: string = ''


if (!process.env.VIDEOFOLDER) {
    throw Error('no videofolder provided (by process env)')
}

const videofolder = process.env.VIDEOFOLDER

if (process.env.PREFIX) prefix = process.env.PREFIX

if (!process.env.SERVERURI) {
    throw Error('no SERVERURI provided (by process env)')

}
if (!process.env.PORT) {
    process.env.PORT = 3000
}


if (!process.env.MODE) {
    app.use(mountpoint, router(videofolder, { serverUri: { path: videofolder, uri: process.env.SERVERURI+mountpoint+'/videolibrary/' } }))
    console.log(videofolder)

} else if (process.env.MODE === 'user') {
    if (!process.env.SECRET) {
        throw Error('no secret provided (by process env)')
    }
    app.use('/app', router(videofolder, { mode: { type: 'users', secret: process.env.SECRET, ignoreExpiration: true }, serverUri: { path: videofolder, uri: process.env.SERVERURI+mountpoint+'/videolibrary/' } }))

    console.log(jwt.sign({ prefix: '' }, process.env.SECRET))


}




app.listen(process.env.PORT)
