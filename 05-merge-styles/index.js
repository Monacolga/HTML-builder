const fs = require('fs').promises;
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const distFolder = path.join(__dirname, 'project-dist');
const outputFile = path.join(distFolder, 'bundle.css');

const isValidStyleFile = (filename) => {
  return filename.endsWith('.css');
};

const compileStyles = async () => {
  try {
    const files = await fs.readdir(stylesFolder, { withFileTypes: true });

    const styleFiles = files.filter(
      (file) => file.isFile() && isValidStyleFile(file.name),
    );

    const compiledStyles = await Promise.all(
      styleFiles.map(async (file) => {
        const filePath = path.join(stylesFolder, file.name);
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
      }),
    );

    await fs.writeFile(outputFile, compiledStyles.join('\n'), 'utf-8');

    console.log('Styles compiled successfully!');
  } catch (error) {
    console.error(`Error compiling styles: ${error}`);
  }
};

compileStyles();
