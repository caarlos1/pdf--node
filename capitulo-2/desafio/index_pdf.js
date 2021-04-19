const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')

// Função de gerenciamento de rotas
const rotear = pathname => {
    if (pathname && pathname !== '/'){
        const arquivo = path.join(__dirname, `${pathname}.html`)
        const existe = fs.existsSync(arquivo) // .existsSync Confirma se o caminho existe.

        if(existe) 
            return arquivo
        // else
        return path.join(__dirname, 'erro.html')
    }
    // else
    return path.join(__dirname, 'artigos.html')
}


// Servidor
const server = http.createServer( (request, response) => {
    // Obtendo URL digitada.
    const pathname = url.parse(request.url).pathname
    const pagina = rotear(pathname) // Processando o pathname
    
    fs.readFile(pagina, (err, html) => {
        response.writeHeader(200, {'Content-Type': 'text/html'})
        response.end(html)
    })
} )


// Start do servidor
server.listen(3000, console.log('Executando Desafio'))