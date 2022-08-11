# 将手机B站缓存的视频转到电脑上

1. 安装依赖
2. 下载FFmpeg4.4版本(https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n4.4-latest-win64-gpl-4.4.zip) (https://github.com/BtbN/FFmpeg-Builds/releases)
3. 将FFmpeg添加到电脑的环境变量(https://baijiahao.baidu.com/s?id=1718025403184212915&wfr=spider&for=pc)
4. 拷贝手机缓存视频到download(在当前文件夹中)
5. node generateDirJson
6. node generateDirPath
7. 等待即可， 会将视频转到copy文件夹中