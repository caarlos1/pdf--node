const { Monitor } = require('forever-monitor')
const child = new Monitor('app.js', {
    max: 10,
    silent: true,
    killTree: true,
    logFile: 'logs/forever.log',
    outFile: 'logs/app.log',
    errFile: 'logs/error.log',
})

child.on('exit', () => console.log('Servidor finalziado.') )

child.start()