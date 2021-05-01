const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const path = require('path')
const consign = require('consign')
const cookie = require('cookie')

// const compression = require('compression')
const expressSession = require('express-session')
const methodOverride = require('method-override')

const config = require('./config')
const error = require('./middlewares/error')

// Configuração do redis / socket.io-redis / connect-redis
const redis = require('redis')
const redisAdapter = require('socket.io-redis')
const csurf = require('csurf')
const RedisStore = require('connect-redis')(expressSession)
const redisClient = redis.createClient()

// Configuração do express / servidor / socket.io
const app = express()
const server = http.Server(app)
const io = socketIO(server)

app.disable('x-powered-by') // Desativar Header.

// Configuração de sessão no servidor
const store = new RedisStore( { client: redisClient, ...config.redisStore } )

// Configurações da view
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// app.use( compression() )
app.use( expressSession({
  store,
  resave: true,
  saveUninitialized: true,
  name: config.sessionKey,
  secret: config.sessionSecret,
}) )

app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )
app.use( methodOverride('_method') ) // P/ habilitar a comunicação por outros métodos pelo formulário.
app.use( express.static( 
  path.join(__dirname, 'public'), 
  // config.cache, 
) )

// // Configuração do csurf para funcionar com os testes.
if(process.env.NODE_ENV === 'test' )
  app.use( csurf( { ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'] }) )
else
  app.use( csurf() )

app.use( (req, res, next) => {
  res.locals._csrf = req.csrfToken()
  next()
} )


io.adapter( redisAdapter(config.redis) ) ;
io.use( (socket, next) => {
  const cookieData = socket.request.headers.cookie // Cookie da request.
  const cookieObj = cookie.parse(cookieData) // Converte cookie em objeto.
  const sessionHash = cookieObj[config.sessionKey] || ''
  const sessionID = sessionHash.split('.')[0].slice(2)

  store.get( sessionID, (err, currentSession) => {
    if ( err ) return next( new Error('Acesso negado!') )
    socket.handshake.session = currentSession
    return next()
  } )
} )

// Carregando dos módulos
consign({ locale: 'pt-br', verbose: false, })
  .include('models')
  .then('controllers')
  .then('routes')
  .then('events')
  .into(app, io)
  
// Middlewares de tratamento de erros
app.use(error.notFound)
app.use(error.serverError)

// Start do Servidor
server.listen(3000, console.log(`${ new Date() }: O Ntalk está no ar: http://localhost:3000`))

// Exportando app para testes.
module.exports = app