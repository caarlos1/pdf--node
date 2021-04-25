const Schema = require('mongoose').Schema
// const mongoose = require('mongoose')

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
    return db.model('usuario', usuario)
    // const Usuario = mongoose.model('usuario', usuario)
    // module.exports = Usuario
}