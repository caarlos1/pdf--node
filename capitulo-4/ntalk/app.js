const express = require('express')
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
const consign = require('consign') // Para importar modulos.
const bodyParser = require('body-parser')
const cookie = require('cookie')
const expressSession = require('express-session')
const methodOverride = require('method-override')
const config = require('./config')
const error = require('./middlewares/error')

const app = express()
const server = http.Server(app) // Configuração para usar o app como servidor http
const io = socketIO(server) // Configurando o servidor do socket
// Dando store na sessão
const store = new expressSession.MemoryStore() // Salva ar seção no store.

// Configurações Internas
app.set('views', path.join(__dirname, 'views')) // Set views.
app.set('view engine', 'ejs')

// Configurando a sessão do express.
app.use( expressSession({
  store,
  name: config.sessionKey,
  secret: config.sessionSecret,
}) )

app.use( bodyParser.json() )
app.use( bodyParser.urlencoded() )
app.use( methodOverride('_method') ) // Para conseguir enviar um put e delete pelo formulario, sem ajax.
app.use( express.static( path.join(__dirname, 'public') ) ) // Set arquivos estáticos


io.use( (socket, next) => {
  const cookieData = socket.request.headers.cookie // Cookie que veio na request.
  const cookieObj = cookie.parse(cookieData) // Transformo o cookie em um objeto.
  const sessionHash = cookieObj[config.sessionKey] || ''
  
  // .split cria um array procurando '.' pegando a informação a partir do incide 2 com .slice
  const sessionID = sessionHash.split('.')[0].slice(2)

  
  store.all( (err, sessions) => {
    const currentSession = sessions[sessionID]
    if ( err || !currentSession )
      return next(new Error('Acesso negado!'))

    socket.handshake.session = currentSession
    return next()
  } )
} )


// Carrega sozinho os modulos nas seguintes diretórios:
// Middlewares...
consign({})
  .include('models')
  .then('controllers')
  .then('routes')
  .then('events')
  .into(app, io)
  
// Middlewares de tratamento de erros
app.use(error.notFound)
app.use(error.serverError)

server.listen(3000, console.log('Ntalk no ar. http://localhost:3000'))