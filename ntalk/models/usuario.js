const db = require('../libs/db.js')
const Schema = require('mongoose').Schema

module.exports = () => {

    const contato = new Schema({
        nome: String,
        email: String,
    })
    
    const usuario = new Schema({
        nome: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: { unique: true }
        },
        contatos: [contato]
    })
    
    return db.model('usuarios', usuario)
}