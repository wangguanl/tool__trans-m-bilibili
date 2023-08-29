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
  } = require('wgl-node-utils');
(async () => {
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
          const vDirs = await readdirAsync(Path.join(input, ProDir));
          await Promise.all(
            vDirs.map(
              vDir =>
                new Promise(async (resolve, reject) => {
                  const buffer = await readFileAsync(
                    Path.join(input, ProDir, vDir, 'entry.json')
                  );
                  let { title, page_data } = JSON.parse(buffer.toString());
                  title = IllegalPipe(title) + '_' + ProDir; // 增加原有目录的名称，保证视频集合目录的唯一性，不会被重名的覆盖
                  if (!json[title]) {
                    json[title] = [];
                  }
                  const vDirDirectoryList = await readdirAsync(
                    Path.join(input, ProDir, vDir)
                  );
                  await Promise.all(
                    vDirDirectoryList.map(
                      vDirDirectory =>
                        new Promise(async (resolve, reject) => {
                          const flag = await isDirectory(
                            Path.join(input, ProDir, vDir, vDirDirectory)
                          );
                          if (flag) {
                            const Fragments = await readdirAsync(
                              Path.join(input, ProDir, vDir, vDirDirectory)
                            );
                            json[title].push({
                              videoName:
                                (page_data.part
                                  ? IllegalPipe(page_data.part) + '_'
                                  : '') + vDir, // 增加原有目录的名称，保证视频的唯一性，不会被重名的覆盖
                              dir: [input, ProDir, vDir, vDirDirectory],
                              blv: Fragments.filter(
                                fileName => Path.extname(fileName) === '.blv'
                              ).sort(
                                (a, b) =>
                                  Number.parseInt(a) - Number.parseInt(b)
                              ),
                              m4s: Fragments.filter(
                                fileName => Path.extname(fileName) === '.m4s'
                              ),
                            });
                          }
                          resolve(flag);
                        })
                    )
                  );
                  resolve();
                })
            )
          );
          resolve();
        })
    )
  );

  compose(json, output);

  // await writeFileAsync('./dir.json', Buffer.from(JSON.stringify(json)));
})();
