# 把手机B站缓存的视频转成MP4

## 操作步骤
1. 将手机B站缓存的视频转存到此目录的`download`：在`Android -> data -> tv.danmaku.bili -> download`(`Android\data\tv.danmaku.bili\download`)
2. 安装依赖 & 执行命令，会将视频转到 `compose` 文件夹中。
```bash
yarn
```
```bash
yarn build
```


注意：`@ffmpeg-installer/ffmpeg`依赖可替代`FFmpeg.exe`软件，如果安装失败，则单独下载`FFmpeg.exe` [链接1](https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n4.4-latest-win64-gpl-4.4.zip) [链接2](https://github.com/BtbN/FFmpeg-Builds/releases)，下载完成后[将FFmpeg添加到电脑的环境变量](https://jingyan.baidu.com/article/b907e627b5b4b707e7891cc1.html)
