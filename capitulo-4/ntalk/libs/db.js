const mongoose = require('mongoose')
const bluebird = require('bluebird')

// Seters
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.Promise = bluebird

const currentEnv = process.env.NODE_ENV || 'development'

const envURL = {
    test: 'mongodb://localhost:27017/ntalk_test',
    development: 'mongodb://localhost:27017/ntalk'
}

// Conexão com o banco de dados
mongoose.connect( envURL[currentEnv] )

module.exports = mongoose