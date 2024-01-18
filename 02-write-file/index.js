const fs = require('fs');
const readline = require('readline');

const filePath = './02-write-file/text.txt';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeToFile = (text) => {
  fs.appendFile(filePath, text, (err) => {
    if (err) throw err;
  });
};

function handleInput(input) {
  if (input.toLowerCase() === 'exit') {
    console.log('See you later!');
    process.exit(0);
  } else {
    writeToFile(input + '\n');
    rl.prompt();
  }
}

rl.setPrompt('Enter text: ');
rl.prompt();

rl.on('line', handleInput);
rl.on('SIGINT', () => {
  console.log('See you later!');
  process.exit(0);
});
