import router from './index'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'

const app = express()

const videofolder = __dirname + '/test/video/'

const testprefix = 'kasper'

const testsecret = 'shhhh'

const testtoken = jwt.sign({ prefix: testprefix }, testsecret)



// console.log(videofolder)

app.use('/', router(videofolder))
app.use('/restricted', router(videofolder, { mode: { type: 'users', secret: testsecret, ignoreExpiration: true } }))

app.get('/testtoken', function (req, res) {
    res.json({ token: testtoken })
})

app.listen(3000)
