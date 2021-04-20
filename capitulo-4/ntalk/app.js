const express = require('express')
const path = require('path')
const consign = require('consign') // Para importar modulos.
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const methodOverride = require('method-override')
const error = require('./middlewares/error')
const app = express()

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

app.listen(3000, console.log('Ntalk no ar. http://localhost:3000'))