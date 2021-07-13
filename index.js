require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const mongoConnect = require('./src/config/databaseConfig')
const route = require('./src/routes')
const {socketServer} = require('./socketServer');
const path = require('path');

app.use(cors())
// app.set('socketio', io)
// const CheckLogin = require('./auth/CheckLogin')
// const CheckAdmin = require('./middleware/CheckAdmin')
app.use(express.urlencoded({extended : false}))
app.use(express.json())

mongoConnect()
io.on("connection", socket => {
    socketServer(socket)
})
route(app)
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*',(req,res) => {
        res.sendFile(path.join(__dirname,'client','build','index.html'))
    })
}

const port = process.env.PORT || 5000
server.listen(port, () => {
    console.log( `http://localhost:${port}` )
})


