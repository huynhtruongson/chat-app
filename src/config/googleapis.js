require("dotenv").config()
const {google} = require("googleapis")

const CLIENT_ID = process.env.GG_ID
const CLIENT_SECRET = process.env.GG_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REDIRECT_TOKEN = process.env.REDIRECT_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REDIRECT_TOKEN})

module.exports = oAuth2Client
