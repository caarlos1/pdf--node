const mongoose = require('mongoose')
const bluebird = require('bluebird')
const config = require('../config')
const host = config.mongodb[config.env]

mongoose.Promise = bluebird

// Seters
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Conexão com o banco de dados
mongoose.connect( host, config.mongoose )

module.exports = mongoose