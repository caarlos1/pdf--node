module.exports = (app, io) => {
// Conexão do Socket.io
    const onlines = {} // Usuários online.
    io.on('connection', (client) => {
        const { session } = client.handshake
        const { usuario } = session

        // Crio uma chave e valor no objeto com email e email.
        onlines[usuario.email] = usuario.email
        for(let email in onlines){
            client.emit('notify-onlines', email)
            client.broadcast.emit('notify-onlines', email)
        }
        
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

        // Executa quando o cliente é desconectádo por algum motivo.
        client.on('disconnect', () => {
            const { sala } = session
            const resposta = `<b>${ usuario.nome }</b> saiu da sala.`
            delete onlines[usuario.email] // Excluo da lista de online o usuario que desconectou.
            
            session.sala = null
            client.leave(sala) // Tira a conexão do usuário da sala.

            client.broadcast.emit('notify-offlines', usuario.email) // Notifica que o usuario está offline.
            io.to(sala).emit('send-client', resposta) // Mnada para sala a mensagem de disconnect.
        })

    })
}