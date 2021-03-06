import router from './index'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import * as cors from 'cors'


export interface IOptions {
    exclude?: string[]
    serverUri?: { path: string, uri: string }
    mode?: { type: string, secret?: string, ignoreExpiration?: true }
    conversion?: { dest: string, prefix?: string }
}

const app = express()
app.use(cors())

const mountpoint = '/'

let prefix: string = ''
const options = <IOptions>{}



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
process.env.PORT = parseInt(process.env.PORT)


if (process.env.CONVERSIONDEST) {
    options.conversion = { dest: process.env.CONVERSIONDEST }
}

if (process.env.MODE === 'user' && process.env.SECRET) {
    options.mode = { type: 'users', secret: process.env.SECRET, ignoreExpiration: true }
}

options.serverUri = { path: videofolder, uri: process.env.SERVERURI + mountpoint + 'videolibrary/' }

if (!process.env.MODE) {
    console.log(videofolder)
} else if (process.env.MODE === 'user') {
    if (!process.env.SECRET) {
        throw Error('no secret provided (by process env)')
    }
    console.log(jwt.sign({ prefix: '' }, process.env.SECRET))
}
app.use(mountpoint, router(videofolder, options))




app.listen(process.env.PORT)
