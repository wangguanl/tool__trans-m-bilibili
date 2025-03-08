`index.js`文件已经处理了PC端的缓存的视频列表，可输出json文件。
`compose.js`拿到对应的JSON就可以处理m4s音频视频生成MP4文件，但是目前卡在了无法处理m4s的二进制数据，参考[python](https://github.com/molihuan/BilibiliCacheVideoMergePython)项目文件后依然没有找到头绪。