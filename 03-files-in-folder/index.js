const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, async (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      try {
        const stats = await fs.promises.stat(filePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInKilobytes = fileSizeInBytes / 1024;
        const fileExtension = path.extname(filePath).slice(1);
        const fileName = path.basename(file.name, path.extname(file.name));
        console.log(
          `${fileName}-${fileExtension}-${fileSizeInKilobytes.toFixed(3)}kb`,
        );
      } catch (err) {
        console.error(`Error reading file: ${filePath}`, err);
      }
    }
  }
});
