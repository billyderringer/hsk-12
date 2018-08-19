import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import config from './config/config'
import routes from './routes/routes'
import cors from 'cors'
import passport from 'passport'

const LocalStrategy = require('passport-local').Strategy

let app = express()
app.server = http.Server(app)
app.disable('x-powered-by')

// middleware
//app.use(cors({origin: '*'}))
//app.use(cors({credentials: true, origin: 'https://billyderringer.github.io'}))
//app.options('https://billyderringer.github.io', cors())

//parse application/json
app.use(bodyParser.json({
    limit: config.bodyLimit
}))

// passport config
app.use(passport.initialize())
let Teacher = require('./model/teacher')
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    Teacher.authenticate()
))
passport.serializeUser(Teacher.serializeUser())
passport.deserializeUser(Teacher.deserializeUser())

// api routes
app.use('/api/v1/', routes)

let port = config.port
app.server.listen(port)
console.log('Server started on port ' + port + '. Press CTRL-C to exit.')

export default app