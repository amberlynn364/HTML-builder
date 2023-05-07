const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const newFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(newFile);
stdout.write('Привет! Напиши что-нибудь!\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    quitAndBye();
  }
  output.write(data);
})

process.on('SIGINT', quitAndBye)

function quitAndBye() {
  stdout.write('Спасибо за внимание! Удачи в изучении Node.js!');
  process.exit();
}
