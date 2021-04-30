const express = require('express')
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
const consign = require('consign') // Para importar modulos.
const cookie = require('cookie')
const compression = require('compression')
const expressSession = require('express-session')
const methodOverride = require('method-override')

const config = require('./config')
const error = require('./middlewares/error')

// Adaptando a sessão para ser salva no redis.
const redis = require('redis')
const redisAdapter = require('socket.io-redis')
const RedisStore = require('connect-redis')(expressSession)
// Necessário criar o redisClient para instancia um objeto RedisSotore
const redisClient = redis.createClient()

const app = express()
const server = http.Server(app) // Configuração para usar o app como servidor http
const io = socketIO(server) // Configurando o servidor do socket
const store = new RedisStore( {client: redisClient, prefix: config.sessionKey } )  // Objeto que vai salvar as sessões

// Configurações Internas
app.set('views', path.join(__dirname, 'views')) // Set views.
app.set('view engine', 'ejs')

app.use( compression() )
app.use( expressSession({
  store,
  resave: true,
  saveUninitialized: true,
  name: config.sessionKey,
  secret: config.sessionSecret,
}) )

app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )
app.use( methodOverride('_method') ) // Para conseguir enviar um put e delete pelo formulario, sem ajax.
app.use( express.static( path.join(__dirname, 'public'), { maxAge: 3600000 } ) ) // Set arquivos estáticos

io.adapter( redisAdapter() ) ;
io.use( (socket, next) => {
  const cookieData = socket.request.headers.cookie // Cookie que veio na request.
  const cookieObj = cookie.parse(cookieData) // Transformo o cookie em um objeto.
  const sessionHash = cookieObj[config.sessionKey] || ''
  // .split cria um array procurando '.' pegando a informação a partir do incide 2 com .slice
  const sessionID = sessionHash.split('.')[0].slice(2)

  
  store.get( sessionID, (err, currentSession) => {
    if ( err ) return next( new Error('Acesso negado!') )
    socket.handshake.session = currentSession
    return next()
  } )
} )


// Carrega sozinho os modulos nas seguintes diretórios:
// Middlewares...
consign({ locale: 'pt-br', verbose: false, })
  .include('models')
  .then('controllers')
  .then('routes')
  .then('events')
  .into(app, io)
  
// Middlewares de tratamento de erros
app.use(error.notFound)
app.use(error.serverError)

server.listen(3000, console.log('Ntalk no ar. http://localhost:3000'))

// Exportando o app para testes.
module.exports = app