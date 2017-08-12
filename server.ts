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



    console.log(videofolder)
    

// console.log(videofolder)
if (!process.env.mode) {
    app.use('/', router(videofolder))

} else if (process.env.mode === 'user') {
    if (!process.env.SECRET) {
        throw Error('no secret provided (by process env)')
    }
    app.use('/restricted', router(videofolder, { mode: { type: 'users', secret: process.env.SECRET, ignoreExpiration: true } }))

}


app.use('/video', express.static(videofolder))



app.listen(3000)
