module.exports = (app, io) => {
// Conexão do Socket.io
    io.on('connection', (client) => {
        const { session } = client.handshake
        const { usuario } = session
        
        // Quando o cliente mandar mensagem para o servidor:
        client.on('send-server', (msg) => {
            const resposta = `<b> ${usuario.nome}:</b> ${ msg } </br>`
            client.emit('send-client', resposta) // Eviaa a resposta para o usuario.
            client.broadcast.emit('send-client', resposta) // Envia a respostas para todos usuarios menos o emissor.
        } )
    })
}