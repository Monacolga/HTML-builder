const fs = require('fs').promises;
const path = require('path');

const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const templateFile = path.join(__dirname, 'template.html');

const distFolder = path.join(__dirname, 'project-dist');
const outputFile = path.join(distFolder, 'index.html');
const stylesOutputFile = path.join(distFolder, 'style.css');
const assetsOutputFolder = path.join(distFolder, 'assets');

const compileStyles = async (inputPath, outputPath) => {
  try {
    await fs.writeFile(outputPath, '');

    const files = await fs.readdir(inputPath, { withFileTypes: true });
    const cssFiles = files.filter(
      (file) => file.isFile() && file.name.endsWith('.css'),
    );

    for (const file of cssFiles) {
      const data = await fs.readFile(path.join(inputPath, file.name), {
        encoding: 'utf-8',
      });
      await fs.appendFile(outputPath, data);
    }

    console.log('Styles compiled successfully!');
  } catch (error) {
    console.error(`Error compiling styles: ${error}`);
  }
};

const copyDir = async (inputPath, outputPath) => {
  try {
    const sourceFilesNames = [];
    await fs.mkdir(path.join(outputPath), { recursive: true });

    const files = await fs.readdir(inputPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        await fs.copyFile(
          path.join(inputPath, file.name),
          path.join(outputPath, file.name),
        );
        sourceFilesNames.push(file.name);
      }
    }

    const copyFiles = await fs.readdir(outputPath, { withFileTypes: true });

    for (const file of copyFiles) {
      if (!sourceFilesNames.includes(file.name)) {
        await fs.rm(path.join(outputPath, file.name));
      }
    }

    console.log('Directory copied successfully!');
  } catch (error) {
    console.error(`Error copying directory: ${error}`);
  }
};

const buildPage = async () => {
  try {
    await fs.mkdir(distFolder, { recursive: true });
    let content = await fs.readFile(templateFile, 'utf-8');
    const matches = content.match(/{{(.*?)}}/g);

    if (matches) {
      for (const match of matches) {
        const componentName = match.replace(/[{})]/g, '');
        const componentFile = path.join(
          componentsFolder,
          `${componentName}.html`,
        );

        try {
          const component = await fs.readFile(componentFile, 'utf-8');
          content = content.replace(match, component);
        } catch (error) {
          console.error(
            `Error reading component file ${componentFile}: ${error}`,
          );
        }
      }
    }

    await fs.writeFile(outputFile, content, 'utf-8');

    console.log('Page built successfully!');
  } catch (error) {
    console.error(`Error building page: ${error}`);
  }
};

const copyAssets = async () => {
  try {
    await fs.mkdir(assetsOutputFolder, { recursive: true });
    const files = await fs.readdir(assetsFolder, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        await copyDir(
          path.join(assetsFolder, file.name),
          path.join(assetsOutputFolder, file.name),
        );
      }
    }

    console.log('Assets copied successfully!');
  } catch (error) {
    console.error(`Error copying assets: ${error}`);
  }
};

const build = async () => {
  await buildPage();
  await compileStyles(stylesFolder, stylesOutputFile);
  await copyAssets();
};

build();
////////////////////

// const replaceTemplateTags = async (templateContent) => {
//   const matches = templateContent.match(/{{(.*?)}}/g);

//   if (!matches) {
//     return templateContent;
//   }

//   for (const match of matches) {
//     const componentName = match.slice(2, -2).trim();
//     const componentFile = path.join(templatesFolder, `${componentName}.html`);

//     try {
//       const componentContent = await fs.readFile(componentFile, 'utf-8');
//       templateContent = templateContent.replace(
//         new RegExp(`{{${componentName}}}`, 'g'),
//         componentContent,
//       );
//     } catch (error) {
//       console.error(`Error reading component file ${componentFile}: ${error}`);
//     }
//   }

//   return templateContent;
// };

// const compileStyles = async () => {
//   try {
//     const files = await fs.readdir(stylesFolder, { withFileTypes: true });
//     const styleFiles = files.filter(
//       (file) => file.isFile() && file.name.endsWith('.css'),
//     );

//     const compiledStyles = await Promise.all(
//       styleFiles.map(async (file) => {
//         const filePath = path.join(stylesFolder, file.name);
//         const content = await fs.readFile(filePath, 'utf-8');
//         return content;
//       }),
//     );

//     await fs.writeFile(stylesOutputFile, compiledStyles.join('\n'), 'utf-8');

//     console.log('Styles compiled successfully!');
//   } catch (error) {
//     console.error(`Error compiling styles: ${error}`);
//   }
// };

// const copyAssets = async () => {
//   try {
//     await fs.mkdir(assetsOutputFile, { recursive: true });

//     await fs
//       .readdir(assetsFolder, { withFileTypes: true })
//       .then((files) =>
//         Promise.all(
//           files.map((file) =>
//             fs.copyFile(
//               path.join(assetsFolder, file.name),
//               path.join(assetsOutputFile, file.name),
//             ),
//           ),
//         ),
//       );

//     console.log('Assets copied successfully!');
//   } catch (error) {
//     console.error(`Error copying assets: ${error}`);
//   }
// };

// const buildPage = async () => {
//   try {
//     await fs.mkdir(distFolder, { recursive: true });

//     const templateContent = await fs.readFile(templateFile, 'utf-8');
//     const replacedContent = await replaceTemplateTags(templateContent);

//     await fs.writeFile(outputFile, replacedContent, 'utf-8');

//     console.log('Page built successfully!');
//   } catch (error) {
//     console.error(`Error building page: ${error}`);
//   }
// };

// compileStyles()
//   .then(() => {
//     // Create the project-dist folder
//     return fs.mkdir(distFolder, { recursive: true });
//   })
//   .then(() => {
//     // Copy assets
//     return copyAssets();
//   })
//   .then(() => {
//     // Build page after styles and assets are copied
//     return buildPage();
//   })
//   .catch((error) => {
//     console.error(`Error: ${error}`);
//   });
