const redis = require('redis').createClient()

module.exports = (app, io) => {
// Conexão do Socket.io
    io.on('connection', (client) => {
        const { session } = client.handshake
        const { usuario } = session

        redis.sadd('onlines', usuario.email, () => {
            redis.smembers('onlines', (err, emails) => {                
                emails.forEach( email => {
                    client.emit('notify-onlines', email)
                    client.broadcast.emit('notify-onlines', email)
                } )
            })
        })
        
        // Quando o cliente mandar mensagem para o servidor:
        client.on('send-server', (hashDaSala, msg) => {
            const novaMensagem = { email: usuario.email, sala: hashDaSala }
            const resposta = `<b>${usuario.nome}:</b> ${ msg } </br>`
            // session.sala = hashDaSala

            redis.lpush(hashDaSala, resposta, () => {
                client.broadcast.emit('new-message', novaMensagem) // Avisar que uma mensagem foi enviada paro o usulário.
                io.to(hashDaSala).emit('send-client', resposta) // Envia a mensagem para a sala com o hash
            } )
        } )

        // Evento escuta e cria as salas com o hash recebido.
        client.on('create-room', hashDaSala => {
            session.sala = hashDaSala // Adiciona a sala no usuário
            client.join(hashDaSala) // Inclui a conexão do usuário na sala.
            // Mensagem de entrou.
            const resposta = `<b>${usuario.nome} entrou na sala.</b></br>`
            // Subindo pro banco as mensagens.
            redis.lpush(hashDaSala, resposta, () => {
                redis.lrange(hashDaSala, 0, -1, (err, msgs) => {
                    msgs.forEach( msg => {
                        io.to(hashDaSala).emit('send-client', msg)
                    })
                })
            } )
        } )

        // Executa quando o cliente é desconectádo por algum motivo.
        client.on('disconnect', () => {
            const { sala } = session
            const resposta = `<b>${ usuario.nome } saiu da sala.</b></br>`

            redis.lpush(sala, resposta, () => {
                session.sala = null
                redis.srem('onlines', usuario.email)
                client.leave(sala) // Tira a conexão do usuário da sala.

                client.broadcast.emit('notify-offlines', usuario.email) // Notifica que o usuario está offline.
                io.to(sala).emit('send-client', resposta) // Mnada para sala a mensagem de disconnect.
            } )
        })

    })
}