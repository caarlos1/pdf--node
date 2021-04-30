// Observações:
//     Durante os estudos não consegui configurar os clusters e o Socket.io de forma funcional,
//     por isso não usarei esse arquivo, porem deixarei por motivos didáticos

const cluster = require('cluster')
const { Socket } = require('dgram')
const cpus = require('os').cpus()

if (cluster.isMaster) {
    cpus.forEach( () => cluster.fork() )
    cluster.on('listening', worker => {
        console.log(`Cluster ${worker.process.pid} conectado.`)
    })

    cluster.on('disconnect', worker => {
        console.log(`Cluster ${worker.process.pid} desconectado.`)
    })

    cluster.on('exit', worker => {
        console.log(`Cluster ${worker.process.pid} finalizado.`)
    })
} else {
    require('./app')
}