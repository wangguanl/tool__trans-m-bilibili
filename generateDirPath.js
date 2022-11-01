const Path = require('path'),
  { to } = require('await-to-js');

const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg'),
  ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const {
  statAsync,
  mkdirAsync,
  readdirAsync,
  readFileAsync,
  writeFileAsync,
  accessAsync,
} = require('./utils');

(async () => {
  const output = './compose';

  const [err] = await to(statAsync(output));
  err && (await to(mkdirAsync(output)));

  // 根据JSON生成文件目录
  // const dirBuffer = await readFileAsync('./dir.json');
  // const dirJson = JSON.parse(dirBuffer.toString());
  const dirJson = require('./dir.json');
  const ProDirs = Object.keys(dirJson);
  await to(
    Promise.all(ProDirs.map(ProDir => mkdirAsync(Path.join(output, ProDir))))
  );

  var ffmpegVideo = (() => {
    let ProDirsIndex = 0;
    let vDirsIndex = 0;
    const errFiles = {}; // 合成失败的文件
    return async () => {
      if (ProDirsIndex === ProDirs.length) {
        console.log(
          `已经全部合成完成，共计${ProDirs.length}个视频，共计${
            ProDirs.map(ProDir => dirJson[ProDir]).flat().length
          } P`
        );
      } else {
        const vDirs = dirJson[ProDirs[ProDirsIndex]];
        if (vDirsIndex === vDirs.length) {
          // console.log(ProDirs[ProDirsIndex] + "已经全部合成完成");
          ProDirsIndex++;
          vDirsIndex = 0;
        } else {
          const { videoName, dir } = vDirs[vDirsIndex];
          const filePath = Path.join(
            output,
            ProDirs[ProDirsIndex],
            videoName + '.mp4'
          );
          const [err] = await to(accessAsync(filePath));
          // 二次执行：如果没有找到已经生成的视频，就执行合成
          if (err) {
            console.log(
              '正在合成：' + ProDirs[ProDirsIndex] + '目录下的' + videoName
            );
            const [err] = await to(
              runFfmpeg(
                Path.join(...dir, 'video.m4s'),
                Path.join(...dir, 'audio.m4s'),
                filePath
              )
            );
            if (err) {
              if (!errFiles[ProDirs[ProDirsIndex]]) {
                errFiles[ProDirs[ProDirsIndex]] = [];
              }
              errFiles[ProDirs[ProDirsIndex]].push(vDirs[vDirsIndex]);

              console.log(videoName + '合成失败');
              console.log(errFiles);
              console.log(err);
              await writeFileAsync(
                './errCopyLog.json',
                Buffer.from(JSON.stringify(errFiles))
              );
            }
          } else {
            // console.log(videoName + "已存在");
          }
          vDirsIndex++;
        }
        ffmpegVideo();
      }
    };
  })();
  ffmpegVideo();
})();

function runFfmpeg(video, audio, output) {
  return new Promise((resolve, reject) => {
    ffmpeg(video)
      .input(audio)
      .on('progress', progress => {
        if (progress.percent) {
          console.log('Processing: ' + progress.percent + '%');
        }
        if (progress.percent >= 100) {
          resolve();
        }
      })
      .on('error', err => {
        if (err) {
          console.log('Error transcoding file');
        }
        reject(err);
      })
      .on('end', () => {
        console.log('Finished processing');
        resolve();
      })
      .outputOptions('-c copy')
      .output(output)
      .run();
  });
}
