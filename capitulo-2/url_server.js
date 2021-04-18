const http = require('http')
const url = require('url')

const server = http.createServer( ( request, response ) => {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.write('<h1>Dados da query string.</h1>')

    // new URL substitui o url.parse()
    const result = url.parse(request.url, true)
    console.log(request.url);
    
    for (let key in result.query){
        response.write(` ${key}: ${result.query[key]} </br>`)
    }

    response.end()
} )

server.listen( 3000, console.log('Servidor ligado!') )