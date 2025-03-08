/**
 * @method 将转换文件的列表进行扁平化处理，然后生成JSON
 **/
const Path = require('path'),
  compose = require('./compose'),
  {
    readdirAsync,
    readFileAsync,
    writeFileAsync,
    isDirectory,
    IllegalPipe,
    rmdirSync,
  } = require('wgl-node-utils');
(async () => {
  // const input = Path.resolve('G:\\bilidownload\\'),
  const input = Path.resolve(process.cwd(), 'download'),
    output = Path.resolve(process.cwd(), 'dist');
  const json = {};
  // 视频集合目录
  const ProDirs = await readdirAsync(input);
  // 生成JSON树
  await Promise.all(
    ProDirs.map(
      ProDir =>
        new Promise(async (resolve, reject) => {
          const flag = await isDirectory(Path.join(input, ProDir));
          if (flag) {
            const buffer = await readFileAsync(
              Path.join(input, ProDir, 'videoInfo.json')
            );

            let {
              groupTitle, // 文件目录名称
              groupId, // 文件目录id
              title, // 文件名称
            } = JSON.parse(buffer.toString());
            title = IllegalPipe(title) + '_' + ProDir; // 增加原有目录的名称，保证视频集合目录的唯一性，不会被重名的覆盖
            if (!json[groupId]) {
              json[groupId] = {
                groupTitle,
                children: [],
              };
            }
            const Fragments = await readdirAsync(Path.join(input, ProDir));
            const m4s = Fragments.filter(
              fileName => Path.extname(fileName) === '.m4s'
            );
            // 音频标识：30280
            const obj = {
              videoName: title, // 增加原有目录的名称，保证视频的唯一性，不会被重名的覆盖
              dir: [input, ProDir],
              audio: m4s.filter(name => name.match('30280')),
              video: m4s.filter(name => name.match('30080')),
            };
            if (m4s.length > 2) {
              obj[m4s] = m4s;
            }
            json[groupId].children.push(obj);
          }
          resolve();
        })
    )
  );
  compose(json, output);

  await writeFileAsync('./dir.json', Buffer.from(JSON.stringify(json)));
})();
