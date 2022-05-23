require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const notFoundMiddleware = require('./middlewares/notFound')
const errorMiddleware = require('./middlewares/error')


app.use(cors())
if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.use(morgan('dev'))
}
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 8000
app.listen(port, () => console.log('server run on port: ' + port))