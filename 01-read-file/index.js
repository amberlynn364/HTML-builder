const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
stream.on('data', chunk => stdout.write(chunk));

