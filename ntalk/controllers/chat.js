const crypto = require('crypto')

module.exports = () => {
    const ChatController = {
        index (req, res) {
            const { sala } = req.query // Pego a query ?sala= da url para salvar o hash da conversa.
            let hashDaSala = sala

            // Caso não exista hash, é criada uma.
            if(!hashDaSala){
                const timestamp = Date.now().toString()
                const md5 = crypto.createHash('md5')
                hashDaSala = md5.update(timestamp).digest('hex')
            }

            res.render('chat/index', { sala: hashDaSala }) // O hash será o nome da sala.
        }
    }
    return ChatController
}