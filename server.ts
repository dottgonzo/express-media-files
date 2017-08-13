import router from './index'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'

const app = express()



let prefix: string = ''


if (!process.env.VIDEOFOLDER) {
    throw Error('no videofolder provided (by process env)')
}

const videofolder = process.env.VIDEOFOLDER

if (process.env.PREFIX) prefix = process.env.PREFIX




if (!process.env.MODE) {
    app.use('/app', router(videofolder))
 console.log(videofolder)

} else if (process.env.MODE === 'user') {
    if (!process.env.SECRET) {
        throw Error('no secret provided (by process env)')
    }
    app.use('/app', router(videofolder, { mode: { type: 'users', secret: process.env.SECRET, ignoreExpiration: true } }))

console.log(jwt.sign({ prefix: '' },process.env.SECRET))


}




app.listen(3000)
