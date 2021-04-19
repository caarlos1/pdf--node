const fs = require('fs')
const path = require('path')

// Função que le o arquivo.
const ler = (arquivo) => {
    const dir = path.join(__dirname, arquivo)
    fs.stat(dir, (erro, stat) => {
        if (erro) return erro
        if (stat.isFile())
            console.log('%s %d bytes', arquivo, stat.size)
    } )
}

// Função que lê o diretório
const lerDiretorio = () => {
    fs.readdir( __dirname, (erro, diretorio) => {
        if (erro) return erro
        diretorio.forEach( arquivo => ler(arquivo) )
    } )
}

lerDiretorio()