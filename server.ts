import router from './index'
import * as express from 'express'

const app = express()


app.use('/', router('/home/dario/Video'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
