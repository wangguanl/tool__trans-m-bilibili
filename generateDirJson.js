/**
 * @method 将转换文件的列表进行扁平化处理，然后生成JSON
 **/
const Path = require("path"),
  {
    readdirAsync,
    readFileAsync,
    writeFileAsync,
    isDirectory,
  } = require("./utils");

(async () => {
  const p = "./download";
  const json = {};
  // 视频集合目录
  const ProDirs = await readdirAsync(p);

  // 生成JSON树
  await Promise.all(
    ProDirs.map(
      (ProDir) =>
        new Promise(async (resolve, reject) => {
          const vDirs = await readdirAsync(Path.join(p, ProDir));
          await Promise.all(
            vDirs.map(
              (vDir) =>
                new Promise(async (resolve, reject) => {
                  const buffer = await readFileAsync(
                    Path.join(p, ProDir, vDir, "entry.json")
                  );
                  let { title, page_data } = JSON.parse(buffer.toString());
                  title =
                    title.replace(/\"|\*|\\|\/|\||\:|\?/g, "") + "_" + ProDir; // 增加原有目录的名称，保证视频集合目录的唯一性，不会被重名的覆盖
                  if (!json[title]) {
                    json[title] = [];
                  }
                  const vDirDirectoryList = await readdirAsync(
                    Path.join(p, ProDir, vDir)
                  );
                  await Promise.all(
                    vDirDirectoryList.map(
                      (vDirDirectory) =>
                        new Promise(async (resolve, reject) => {
                          const flag = await isDirectory(
                            Path.join(p, ProDir, vDir, vDirDirectory)
                          );
                          if (flag) {
                            json[title].push({
                              videoName:
                                (page_data.part
                                  ? page_data.part.replace(
                                      /\"|\*|\\|\/|\||\:|\?/g,
                                      ""
                                    ) + "_"
                                  : "") + vDir, // 增加原有目录的名称，保证视频的唯一性，不会被重名的覆盖
                              dir: [p, ProDir, vDir, vDirDirectory],
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

  await writeFileAsync("./dir.json", Buffer.from(JSON.stringify(json)));
})();

// 视频集合目录
/* FS.readdir(p, (err, ProDirs) => {
  ProDirs.forEach((ProDir) => {
    // 视频目录
    FS.readdir(Path.join(p, ProDir), (err, vDirs) => {
      // console.log(vDir);
      vDirs.forEach((vDir) => {
        // console.log(vDir);
        FS.readFile(
          Path.join(p, ProDir, vDir, "entry.json"),
          (err, entryBuffer) => {
            // console.log(entryBuffer.toString());
            let { title, page_data } = JSON.parse(entryBuffer.toString());
            title = title + "_" + ProDir; // 增加原有目录的名称，保证视频集合目录的唯一性，不会被重名的覆盖
            if (!json[title]) {
              json[title] = [];
            }
            json[title].push({
              videoName: page_data.part + "_" + vDir, // 增加原有目录的名称，保证视频的唯一性，不会被重名的覆盖
              dir: [p, ProDir, vDir],
            });
            FS.writeFile(
              "./dir.json",
              Buffer.from(JSON.stringify(json)),
              (err, data) => {}
            );
          }
        );
      });
    });
  });
}); */
