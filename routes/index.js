const authRoute = require('./authRoute')
const verifyEmail = require('../auth/verify_email')
const accountRoute = require('./accountRoute')
const route = app =>{
    app.use('/api/auth', authRoute)
    app.use('/api/verify', verifyEmail)
    app.use('/api/user',accountRoute)

    app.use((req,res)=>{
        res.json("404 - not found")
    })
}

module.exports = route