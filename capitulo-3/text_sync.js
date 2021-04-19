const fs = require('fs')

for (let i = 1; i <= 5; i++){
    const file = __dirname + `/sync-txt${i}.txt`
    fs.writeFileSync(file, 'Hello Node.js')
    console.log('Arquivo Sync Gerado.')
}