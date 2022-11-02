# 把手机B站缓存的视频转成MP4

## 使用npm安装FFmpeg
1. 安装依赖
2. 将手机B站缓存的视频转存到此目录的`download`：在`Android -> data -> tv.danmaku.bili -> download`
3. 执行命令，会将视频转到 `compose` 文件夹中，等待即可
```bash
npm run build
```

注意：`@ffmpeg-installer/ffmpeg`依赖可替代`FFmpeg.exe`软件，如果安装失败，则单独下载`FFmpeg.exe` [链接1](https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n4.4-latest-win64-gpl-4.4.zip) [链接2](https://github.com/BtbN/FFmpeg-Builds/releases)，同时[将FFmpeg添加到电脑的环境变量](https://jingyan.baidu.com/article/b907e627b5b4b707e7891cc1.html)
