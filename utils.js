const FS = require('fs'),
  { to } = require('await-to-js');

module.exports = {
  readdirAsync: path =>
    new Promise((resolve, reject) =>
      FS.readdir(path, (err, dirs) => (err ? reject(err) : resolve(dirs)))
    ),
  readFileAsync: path =>
    new Promise((resolve, reject) =>
      FS.readFile(path, (err, buffer) => (err ? reject(err) : resolve(buffer)))
    ),
  writeFileAsync: (path, data) =>
    new Promise((resolve, reject) =>
      FS.writeFile(path, data, err => (err ? reject(err) : resolve()))
    ),
  statAsync: path =>
    new Promise((resolve, reject) =>
      FS.stat(path, (err, data) => (err ? reject(err) : resolve(data)))
    ),
  mkdirAsync: path =>
    new Promise((resolve, reject) =>
      FS.mkdir(path, err => (err ? reject(err) : resolve()))
    ),
  accessAsync: path =>
    new Promise((resolve, reject) =>
      FS.access(path, err => (err ? reject(err) : resolve()))
    ),
  isFile: async path =>
    new Promise(async (resolve, reject) => {
      const [err, data] = await to(module.exports.statAsync(path));
      err ? reject(err) : resolve(data.isFile());
    }),
  isDirectory: async path =>
    new Promise(async (resolve, reject) => {
      const [err, data] = await to(module.exports.statAsync(path));
      err ? reject(err) : resolve(data.isDirectory());
    }),
};
