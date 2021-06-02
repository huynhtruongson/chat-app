require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const AccountRouter = require('./routers/AccountRouter')
const VerifyEmailAuth = require('./auth/verify_email')
// const server = require('http').createServer(app);
// const io = require('socket.io')(server)


app.use(cors())
// app.set('socketio', io)

// const CheckLogin = require('./auth/CheckLogin')
// const CheckAdmin = require('./middleware/CheckAdmin')

app.use(express.urlencoded({extended : false}))
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req,res) => {
    res.json({
        code : 0,
        message : 'Wellcom to my REST API',
        time : DateTime.now()
    })
})

// app.get('/resetpassword', async(req,res)=>{
//     try{
//         resetpassword = await bcrypt.hash('123456789',10)
//         await AccountModel.updateOne({user_name:"Admin"},{password:resetpassword })
//         return res.json({code:0,message:"password đổi thành công: 123456789"})
//     }catch(err){
//         return res.json({code:1,message:err.message})
//     }
// })



// app.use('/notification',CheckLogin,NotificationrRouter)
app.use('/account', AccountRouter)
app.use('/verify', VerifyEmailAuth)
// app.use('/admin',CheckLogin,CheckAdmin,AdminRouter)

// mongodb+srv://adminPDA:<password>@cluster0.v9bnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// adminPDA
// mn2jHpinkZEvtYi

mongoose.connect('mongodb+srv://adminPDA:mn2jHpinkZEvtYi@cluster0.m0tni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(()=>{
    app.listen(port, () => {
        console.log( `http://localhost:${port}` )
    })
})
.catch(e => {
    console.log( 'Không thể kết nối với database' + e.message )
})
