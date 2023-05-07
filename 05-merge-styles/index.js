const fs = require("fs");
const path = require("path");
const pathToFolderWithStyles = path.join(__dirname, "styles");
const pathToFolderWithBundle = path.join(__dirname, "project-dist", "bundle.css");
const outputStream = fs.createWriteStream(pathToFolderWithBundle);

async function buildBundle(sourceFolder) {
  const itemsInSourceFolder = await fs.promises.readdir(sourceFolder, {withFileTypes: true});
  itemsInSourceFolder.forEach(async (item) => {
    const itemName = item.name;
    if (item.isFile() && path.extname(itemName) === '.css') {
      const inputStream = fs.createReadStream(path.join(sourceFolder, itemName))
      inputStream.on('data', data => outputStream.write(data));
    }
  })
}
buildBundle(pathToFolderWithStyles, pathToFolderWithBundle)