# 依赖jQuery的音乐播放器
### 第一步：下载

> git clone https://github.com/honghaibin/bang-audio.git

### 第二步：引入包文件

> npm install 或者 cnpm install 

### 第三步：启动

> node bin/www  

### 第四步：登陆;

> 浏览器中输入 http://localhost:3000/ 回车

兼容性：亲测最低兼容ie11

关键文件：
```
bang-audio.css 
loading.png （和bang-audio.css文件放在一个文件夹内）
bang-audio.js   
```

使用:
```
var options=[{
		url:[
			'./mp3/m.mp3'
		],
		download: false,   //为false时禁止下载，其它或者不设值默认都拥有下载功能
		rate: true,   //控制是否可调节播放速率，同download
		listen: true  //公司项目中录音的调听和下载是两个权限，所以做了这个配置控制是否具有播放功能（醉醉的，能下载都不给在线听！！）
	},{
		url:[
			'./mp3/红昭愿.mp3'
		],
		download: true,   
		rate: true
	}];
BANG_audio.init($("#app"),options);

options可以是数组（渲染多个audio），也可以是对象（一个）。
```

