const fs = require('fs').promises;
const path = require('path');

const copyDir = async () => {
  const sourceDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files copy');

  try {
    await fs.mkdir(destDir, { recursive: true });
    await copyFiles(sourceDir, destDir);
    console.log('Directory copied successfully!');

    const watcher = fs.watch(
      sourceDir,
      { recursive: true },
      async (eventType, filename) => {
        if (!filename) return;

        const sourcePath = path.join(sourceDir, filename);
        const destPath = path.join(destDir, filename);

        try {
          if (eventType === 'rename') {
            const sourceExists = await fileExists(sourcePath);
            const destExists = await fileExists(destPath);

            if (!sourceExists && destExists) {
              await fs.unlink(destPath);
              console.log(`File ${filename} removed from files-copy`);
            } else if (sourceExists && !destExists) {
              await fs.copyFile(sourcePath, destPath);
              console.log(`File ${filename} added to files-copy`);
            }
          } else if (eventType === 'change') {
            await fs.copyFile(sourcePath, destPath);
            console.log(`File ${filename} updated in files-copy`);
          }
        } catch (error) {
          console.error(`Error updating file ${filename}: ${error}`);
        }
      },
    );

    process.on('SIGINT', () => {
      watcher.close();
      process.exit();
    });

    const sourceFiles = await fs.readdir(sourceDir);
    const destFiles = await fs.readdir(destDir);
    for (const file of destFiles) {
      const filePath = path.join(destDir, file);
      if (!sourceFiles.includes(file)) {
        await fs.unlink(filePath);
        console.log(`File ${file} removed from files-copy`);
      }
    }
  } catch (error) {
    console.error(`Error copying directory: ${error}`);
  }
};

const copyFiles = async (sourceDir, destDir) => {
  const files = await fs.readdir(sourceDir, { withFileTypes: true });
  await Promise.all(
    files.map(async (file) => {
      const sourcePath = path.join(sourceDir, file.name);
      const destPath = path.join(destDir, file.name);
      if (file.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        await copyFiles(sourcePath, destPath);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
    }),
  );
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

copyDir();
