// Importo o modulo http do node.
const http = require('http')

// Função que atende a requisição.
const atenderRequisicao = (request, response) => {
  response.writeHead( 200, { 'Content-Type': 'text/html' } )
  response.write('<h1>Hello World!</h1>')
  response.end() // Finaliza requisição.
}

const mensagemServidorLigado = () =>{ console.log('Servidor: http://localhost:3000') }

// Criando o servidor 
const server = http.createServer( atenderRequisicao )

// Coloco o processo para escutar na porta 3000.
server.listen(3000, mensagemServidorLigado)
