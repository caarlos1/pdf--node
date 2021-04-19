const http = require('http')
const fs = require('fs')


const server = http.createServer( (req, res) => {

    const finalizarResposta  = (arquivo) => { 
        res.writeHead( 200, { 'Content-Type': 'text/html' } )
        fs.readFile(__dirname + '/' + arquivo + '.html', (erro, html) => {
            res.write( html )
            res.end()
        } )
     }

    if(req.url === '/' || req.url === '/artigos' )
        finalizarResposta('artigos')  
    else if (req.url === '/contato')
        finalizarResposta('contato')
    else
        finalizarResposta('erro')
    
} )

server.listen(3000, console.log('Servidor on.'))