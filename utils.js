const FS = require("fs");

module.exports = {
  readdirAsync: (path) =>
    new Promise((resolve, reject) => {
      FS.readdir(path, (err, dirs) => (err ? reject(err) : resolve(dirs)));
    }),
  readFileAsync: (path) =>
    new Promise((resolve, reject) => {
      FS.readFile(path, (err, buffer) => (err ? reject(err) : resolve(buffer)));
    }),
  writeFileAsync: (path, data) =>
    new Promise((resolve, reject) => {
      FS.writeFile(path, data, (err) => (err ? reject(err) : resolve()));
    }),
  statAsync: (path) =>
    new Promise((resolve, reject) => {
      FS.stat(path, (err, data) => (err ? reject(err) : resolve(data)));
    }),
  mkdirAsync: (path) =>
    new Promise((resolve, reject) => {
      FS.mkdir(path, (err) => (err ? reject(err) : resolve()));
    }),
  accessAsync: (path) =>
    new Promise((resolve, reject) => {
      FS.access(path, (err) => (err ? reject(err) : resolve()));
    }),
  isFile: async (path) =>
    new Promise(async (resolve, reject) => {
      try {
        const data = await module.exports.statAsync(path);
        resolve(data.isFile());
      } catch (err) {
        reject(err);
      }
    }),
  isDirectory: async (path) =>
    new Promise(async (resolve, reject) => {
      try {
        const data = await module.exports.statAsync(path);
        resolve(data.isDirectory());
      } catch (err) {
        reject(err);
      }
    }),
};
