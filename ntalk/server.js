const { Monitor } = require('forever-monitor')
const child = new Monitor('app.js', config.forever)

child.on('exit', () => console.log('Servidor finalziado.') )

child.start()