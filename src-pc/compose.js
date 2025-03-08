/**
 * @method 读取dir.json或接收一个json，遍历处理download文件夹中的video.m4s和audio.m4s合并成.mp4文件
 **/
const Path = require('path'),
  { to } = require('await-to-js');

const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg'),
  ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const {
  statAsync,
  mkdirAsync,
  // readdirAsync,
  readFileAsync,
  writeFileAsync,
  accessAsync,
} = require('wgl-node-utils');

// 根据JSON生成文件目录
// const dirBuffer = await readFileAsync('./dir.json');
// const dirJson = JSON.parse(dirBuffer.toString());
// const dirJson = require('./dir.json');

module.exports = async (dirJson, output) => {
  // 检查 输出 文件夹是否存在，如果不存在则创建
  const [err] = await to(statAsync(output));
  err && (await to(mkdirAsync(output)));

  // 创建 输出 目录文件夹结构
  const ProDirs = Object.keys(dirJson);
  await to(
    Promise.all(
      ProDirs.map(ProDir =>
        // mkdirAsync(Path.join(output, dirJson[ProDir].groupTitle))
        mkdirAsync(Path.join(output, ProDir))
      )
    )
  );
  const errFiles = {}; // 合成失败的文件
  const ffmpegVideo = (() => {
    let ProDirsIndex = 0;
    let vDirsIndex = 0;
    return async () => {
      if (ProDirsIndex === ProDirs.length) {
        // 如果有合成失败的，则控制台打印输出
        const errTransList = Object.keys(errFiles).filter(
          e => errFiles[e].length
        );
        console.log(
          `已经全部合成完成，共计${ProDirs.length}个视频，共计${
            ProDirs.map(ProDir => dirJson[ProDir]).flat().length
          } P，失败 ${errTransList.length} 个`
        );
        if (errTransList.length) {
          console.log('以下文件合成失败，详情请看：');
          console.log('./err.log.json');
          console.log(errTransList);
        }
        await writeFileAsync(
          './err.log.json',
          Buffer.from(JSON.stringify(errFiles))
        );
      } else {
        const vDirs = dirJson[ProDirs[ProDirsIndex]].children;
        if (vDirsIndex === vDirs.length) {
          console.log(ProDirs[ProDirsIndex] + '已经合成完成');
          ProDirsIndex++;
          vDirsIndex = 0;
        } else {
          // console.log(vDirs);
          // console.log(vDirs[vDirsIndex]);
          const { videoName, dir, audio = [], video = [] } = vDirs[vDirsIndex];
          const filePath = Path.join(
            output,
            ProDirs[ProDirsIndex],
            videoName + '.mp4'
          );
          console.log(filePath);
          const [err] = await to(accessAsync(filePath));
          if (!errFiles[ProDirs[ProDirsIndex]]) {
            errFiles[ProDirs[ProDirsIndex]] = [];
          }
          // 二次执行：如果没有找到已经生成的视频，就执行合成
          if (err) {
            console.log(
              '正在合成：' + ProDirs[ProDirsIndex] + '目录下的' + videoName
            );
            var audioBuffer = await readFileAsync(Path.join(...dir, audio[0])),
              videoBuffer = await readFileAsync(Path.join(...dir, video[0]));
            console.log(videoBuffer[32]);
            // console.log(transBuffer(Buffer.from(audioBuffer).toString()));
            // console.log(Buffer.from(audioBuffer.toString('hex')));
            function transBuffer(buffer) {
              // console.log(buffer)
              return buffer
                .replace('000000000', '')
                .replace('$', ' ')
                .replace('avc1', '');
            }
            function transBuffer2(buffer) {
              // console.log(buffer)
              return buffer.replace('000000000', '');
            }
            // console.log(new Uint32Array(m4sBuffer).toString());

            // audioBuffer.toString('hex').transBuffer();

            /* const arrayBuffer = new ArrayBuffer(16);
            const buffer = Buffer.from(arrayBuffer); */
            await writeFileAsync(
              './audio.mp4',
              Buffer.from(transBuffer(audioBuffer.toString()).toString('hex'))
            );
            await writeFileAsync(
              './video.mp4',
              Buffer.from(transBuffer(videoBuffer.toString()).toString('hex'))
            );
            await writeFileAsync(
              './audio2.mp4',
              Buffer.from(transBuffer2(audioBuffer.toString()).toString('hex'))
            );
            await writeFileAsync(
              './video2.mp4',
              Buffer.from(transBuffer2(videoBuffer.toString()).toString('hex'))
            );
            /* let err;
            if (blv.length) {
              [err] = await to(
                runFragmentsFfmpeg(
                  blv.map(f => Path.join(...dir, f)),
                  filePath
                )
              );
            }
            if (m4s.length) {
              [err] = await to(
                runFfmpeg(
                  m4s.map(f => Path.join(...dir, f)),
                  filePath
                )
              );
            }

            if (err) {
              errFiles[ProDirs[ProDirsIndex]].push([
                vDirs[vDirsIndex],
                '合成失败',
                err.message,
              ]);
              console.log(err);
            } */
          } else {
            // errFiles[ProDirs[ProDirsIndex]].push([dir, '已存在']);
          }
          vDirsIndex++;
        }
        ffmpegVideo();
      }
    };
  })();
  ffmpegVideo();
};

function runFfmpeg(fragments, output) {
  return new Promise((resolve, reject) => {
    const ff = ffmpeg(fragments[0]);
    if (fragments[1]) {
      ff.input(fragments[1]);
    }
    ff.on('progress', progress => {
      if (progress.percent) {
        console.log(`合成进度: ${progress.percent}%`);
      }
    })
      .on('error', err => {
        console.log('文件转译失败');
        reject(err);
      })
      .on('end', () => {
        console.log('完成转译');
        resolve();
      })
      .outputOptions('-c copy')
      .output(output)
      .run();
  });
}

function runFragmentsFfmpeg(fragments, output) {
  return new Promise((resolve, reject) => {
    const ff = ffmpeg();
    fragments.forEach(i => ff.mergeAdd(i));
    ff.on('progress', progress => {
      if (progress.percent) {
        console.log(
          `共计合成${fragments.length}个片段, 整体进度：${(
            progress.percent / fragments.length
          ).toFixed(2)}%；合成第${Math.ceil(
            progress.percent / 100
          )}个，进度: ${(progress.percent % 100).toFixed(2)}%`
        );
      }
    })
      .on('error', err => {
        console.log('文件转译失败');
        reject(err);
      })
      .on('end', () => {
        console.log('完成转译');
        resolve();
      })
      .mergeToFile(output, './');
  });
}
