# 把手机B站缓存的视频转成MP4

1. 安装依赖
2. 将手机B站缓存的视频转到电脑上：在Android -> data -> tv.danmaku.bili -> download
3. 拷贝手机缓存视频到download(在当前文件夹中)
4. 下载FFmpeg [4.4版本-链接1](https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n4.4-latest-win64-gpl-4.4.zip) [4.4版本-链接2](https://github.com/BtbN/FFmpeg-Builds/releases)
5. [将FFmpeg添加到电脑的环境变量](https://jingyan.baidu.com/article/b907e627b5b4b707e7891cc1.html)
6. node generateDirJson
7. node generateDirPath
8. 等待即可， 会将视频转到 `compose` 文件夹中