require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const mongoConnect = require('./config/databaseConfig')
const route = require('./routes')
// const server = require('http').createServer(app);
// const io = require('socket.io')(server)

app.use(cors())
// app.set('socketio', io)
// const CheckLogin = require('./auth/CheckLogin')
// const CheckAdmin = require('./middleware/CheckAdmin')
app.use(express.urlencoded({extended : false}))
app.use(express.json())

mongoConnect()

route(app)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log( `http://localhost:${port}` )
})


