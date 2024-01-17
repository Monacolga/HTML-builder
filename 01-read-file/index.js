const fs = require('fs');

const readStream = fs.createReadStream(__dirname + '/text.txt', 'utf-8');

readStream.on('data', (data) => {
  console.log(data);
});

readStream.on('error', (error) => {
  console.error(error);
});
