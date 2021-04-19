const express = require('express')
const path = require('path')
const consign = require('consign') // Para importar modulos.
const app = express()

// Configurações Internas
app.set('views', path.join(__dirname, 'views')) // Set views.
app.set('view engine', 'ejs')

// Middlewares.
app.use( express.static( path.join(__dirname, 'public') ) ) // Set arquivos estáticos

// Carrega sozinho os modulos nas seguintes diretórios:
consign({})
  .include('models')
  .then('controllers')
  .then('routes')
  .into(app)

app.listen(3000, console.log('Ntalk no ar. http://localhost:3000'))