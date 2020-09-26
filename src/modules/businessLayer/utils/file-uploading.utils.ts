import { extname } from "path";
//import fs from 'fs'
import * as fs from 'fs';
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const move = (oldPath, newPath, callback) => {
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      if (err.code === 'EXDEV') {
        copy();
      } else {
        callback(err);
      }
      return;
    }
    callback();
  });

  function copy() {
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);
    readStream.on('error', callback);
    writeStream.on('error', callback);
    readStream.on('close', function () {
      fs.unlink(oldPath, callback);
    });
    readStream.pipe(writeStream);
  }
}

export const deleteFile = async (path, filename) => {
  try {
    console.log(filename)
    const del = await fs.unlink(path + '/' + filename, (err) => {
      if (err) {
        console.log(err)
        return false;
      } else {
        console.log('Deletado')
        return true;
      }
    });
    return del;
  } catch (err) {
    console.error(err)
    return false;
  }
}