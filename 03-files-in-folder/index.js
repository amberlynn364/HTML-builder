const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');
const { readdir, stat } = require('fs/promises');

async function findFilesInFolder(folder) {
  const files = await readdir(folder, {withFileTypes: true});
  files.forEach(async (item) => {
    if (item.isFile()) {
      const file = item.name;
      const stats = await stat(path.join(folder, file));
      const fileName = path.basename(file, path.extname(file));
      const fileExtension = path.extname(file).slice(1);
      const fileSize = `${(stats.size / 1024).toFixed(1)}kb`
      const result = `${fileName} - ${fileExtension} - ${fileSize}`;
      console.log(result);
    }
  })
};

findFilesInFolder(pathToFolder);

