const authRoute = require('./authRoute')
const accountRoute = require('./accountRoute')
const conversationRoute = require('./conversationRoute')

const route = app =>{
    app.use('/api/auth', authRoute)
    app.use('/api/user', accountRoute)
    app.use('/api/conversation',conversationRoute)

    app.use((req,res)=>{
        res.json("404 - not found")
    })

}

module.exports = route