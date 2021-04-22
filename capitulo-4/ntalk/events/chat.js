module.exports = (app, io) => {
// Conexão do Socket.io
    io.on('connection', (client) => {
        const { session } = client.handshake
        const { usuario } = session
        
        // Quando o cliente mandar mensagem para o servidor:
        client.on('send-server', (hashDaSala, msg) => {
            const novaMensagem = { email: usuario.email, sala: hashDaSala }
            const resposta = `<b> ${usuario.nome}:</b> ${ msg } </br>`
            
            session.sala = hashDaSala

            client.broadcast.emit('new-message', novaMensagem) // Avisar que uma mensagem foi enviada paro o usulário.
            io.to(hashDaSala).emit('send-client', resposta) // Envia a mensagem para a sala com o hash
        } )

        // Evento escuta e cria as salas com o hash recebido.
        client.on('create-room', hashDaSala => {
            session.sala = hashDaSala // Adiciona a sala no usuário
            client.join(hashDaSala) // Inclui a conexão do usuário na sala.
        } )

        // Desconectando da sala.
        client.on('disconnect', () => {
            const { sala } = session
            session.sala = null
            client.leave(sala)
        })

    })
}