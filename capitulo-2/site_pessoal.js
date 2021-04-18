const http = require('http')
const fs = require('fs')

const server = http.createServer( (request, response) => {
    fs.readFile(__dirname + '/index.html', (erro, html) => {
        response.writeHead( 200, {'Content-Type': 'text/html'} )
        response.write( html ) // Escrevi na resposta o arquivo html.
        response.end()
    } )
} )

server.listen( 3000, console.log('Tô vivo!'))