const express = require('express')
const path = require('path')
const routes = require('./routes/index')
const users = require('./routes/users')
const app = express()

// Configurações Internas
app.set('views', path.join(__dirname, 'views')) // Set views.
app.set('view engine', 'ejs')

// Middlewares.
app.use( express.static( path.join(__dirname, 'public') ) ) // Set arquivos estáticos
app.use('/', routes) // Rotas
app.use('/usuarios', users)

app.listen(3000, console.log('Ntalk no ar. http://localhost:3000'))