import router from './index'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'

const app = express()



let prefix: string = ''






if (!process.env.videofolder) {
    throw Error('no videofolder provided (by process env)')
}

const videofolder = process.env.videofolder

if (process.env.prefix) prefix = process.env.prefix



    console.log(videofolder)
    

// console.log(videofolder)
if (!process.env.mode) {
    app.use('/', router(videofolder))

} else if (process.env.mode === 'user') {
    if (!process.env.secret) {
        throw Error('no secret provided (by process env)')
    }
    app.use('/restricted', router(videofolder, { mode: { type: 'users', secret: process.env.secret, ignoreExpiration: true } }))

}





app.listen(3000)
