const fs = require("fs/promises");
const path = require("path");
const folder = path.join(__dirname, "files");
const folderCopy = path.join(__dirname, "files-copy");

async function copyFolder(dir, copyDir) {
  try {
    await fs.rm(copyDir, {recursive: true});
  } catch {
    console.log('Creating folder');
  } finally {
    await fs.mkdir(copyDir, { recursive: true });
    let itemsInSourceFolder = await fs.readdir(dir, { withFileTypes: true });
    itemsInSourceFolder.forEach(async(item) => {
      let dirPath = path.join(dir, item.name);
      let copyDirPath = path.join(copyDir, item.name);
      if (item.isDirectory()) {
        await copyFolder(dirPath, copyDirPath)
      } else {
        await fs.copyFile(dirPath, copyDirPath);
      }
    })
  }
}

copyFolder(folder, folderCopy);