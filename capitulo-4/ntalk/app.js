const express = require('express')
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
const consign = require('consign') // Para importar modulos.
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const methodOverride = require('method-override')
const error = require('./middlewares/error')

const app = express()
const server = http.Server(app) // Configuração para usar o app como servidor http
const io = socketIO(server) // Configurando o servidor do socket

// Configurações Internas
app.set('views', path.join(__dirname, 'views')) // Set views.
app.set('view engine', 'ejs')

// Middlewares.
app.use( cookieParser('ntalk') )
app.use( expressSession() )
app.use( bodyParser.json() )
app.use( bodyParser.urlencoded() )
app.use( methodOverride('_method') ) // Para conseguir enviar um put e delete pelo formulario, sem ajax.
app.use( express.static( path.join(__dirname, 'public') ) ) // Set arquivos estáticos


// Carrega sozinho os modulos nas seguintes diretórios:
consign({})
  .include('models')
  .then('controllers')
  .then('routes')
  .into(app)

// Middlewares de tratamento de erros
app.use(error.notFound)
app.use(error.serverError)

// Conexão do Socket.io
io.on('connection', (client) => {
  // Quando o cliente mandar mensagem para o servidor:
  client.on('send-server', (data) => {
    const resposta = `<b> ${data.nome}:</b> ${data.msg} </br>`
    client.emit('send-client', resposta) // Eviaa a resposta para o usuario.
    client.broadcast.emit('send-client', resposta) // Envia a respostas para todos usuarios menos o emissor.
  } )

})

server.listen(3000, console.log('Ntalk no ar. http://localhost:3000'))