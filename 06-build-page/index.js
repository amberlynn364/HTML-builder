const fs = require('fs');
const path = require('path');
const { buffer } = require('stream/consumers');
const fsPromises = fs.promises;
// const { readdir, mkdir } = require('fs/promises');

const pathToTemplateHtml = path.join(__dirname, 'template.html');
const pathToHtmlComponents = path.join(__dirname, 'components');
const pathToStyles = path.join(__dirname, 'styles');
const pathToAssets = path.join(__dirname, 'assets');
const pathToAssetsCopy = path.join(__dirname, 'project-dist', 'assets');
const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToProjectDistHtml = path.join(__dirname, 'project-dist', 'index.html');
const pathToProjectDistStyle = path.join(__dirname, 'project-dist', 'style.css');
const outputStreamStyles = fs.createWriteStream(pathToProjectDistStyle);

async function createDir() {
  await fsPromises.mkdir(pathToProjectDist, { recursive: true });
}

async function copyFolder(dir, copyDir) {
  try {
    await fsPromises.rm(copyDir, {recursive: true});
  } catch {
    console.log(`Copy folder from ${dir} to ${copyDir}`);
  } finally {
    await fsPromises.mkdir(copyDir, { recursive: true });
    let itemsInSourceFolder = await fsPromises.readdir(dir, { withFileTypes: true });
    itemsInSourceFolder.forEach(async(item) => {
      let dirPath = path.join(dir, item.name);
      let copyDirPath = path.join(copyDir, item.name);
      if (item.isDirectory()) {
        await copyFolder(dirPath, copyDirPath)
      } else {
        await fsPromises.copyFile(dirPath, copyDirPath);
      }
    })
  }
}

async function buildStyle(sourceFolder) {
  const itemsInSourceFolder = await fs.promises.readdir(sourceFolder, {withFileTypes: true});
  itemsInSourceFolder.forEach(async (item) => {
    const itemName = item.name;
    if (item.isFile() && path.extname(itemName) === '.css') {
      const inputStream = fs.createReadStream(path.join(sourceFolder, itemName))
      inputStream.on('data', data => outputStreamStyles.write(data));
    }
  })
}

async function buildHtml (template, components) {
  const input = fs.createReadStream(template, 'utf-8');
  input.on('data', async(data) => {
    let templateHtml = data.toString();
    const itemsInFolder = await fs.promises.readdir(components, {withFileTypes: true});
    itemsInFolder.forEach(async(item) => {
      const itemName = item.name;
      const fileName = path.basename(itemName, path.extname(itemName));
      const filePath = path.join(components, itemName);
      if (item.isFile() && path.extname(itemName) === '.html') {
        const input = fs.createReadStream(filePath, 'utf-8');
        input.on('data', data => {
          const componentHtml = data.toString();
          const output = fs.createWriteStream(pathToProjectDistHtml);
          templateHtml = templateHtml.replace(`{{${fileName}}}`, componentHtml);
          output.write(templateHtml);
        })
      }
    })
  })
}



function createBundle () {
  createDir();
  // cleanerProjectDist(pathToProjectDist);
  copyFolder(pathToAssets, pathToAssetsCopy)
  buildHtml(pathToTemplateHtml, pathToHtmlComponents);
  buildStyle(pathToStyles);
}

createBundle();