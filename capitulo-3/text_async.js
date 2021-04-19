const fs = require('fs')

for( let i = 1 ; i <= 5; i++ ){
    const file =  __dirname + `/async-txt${i}.txt`
    fs.writeFile( file, 'Hello Node.js', (err, out) => {
        console.log('Arquivo Async Gerado.')
    })
}