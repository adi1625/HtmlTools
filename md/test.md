## win server 自动关机（因为没有激活）
下载 PStools 解压到c盘，cmd执行C:\PStools\psexec.exe -d -i -s regedit.exe，
修改 HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WLMS，
imagepath项值改为%SystemRoot%\system32，Start项的值改为4

## 资源管理器多出 icloud 图标
```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{F0D63F85-37EC-4097-B30D-61B4A8917118}
```

## 报错：access violation at address
系统属性（就是设置环境变量那里） - 高级 - 性能 - 设置 - 数据执行保护 - 为除下列选定程序之外的所有程序和服务启用 DEP（下面不用添加程序） - 确定；

## Win 共享密码 凭据管理器
control userpasswords2  本会话内不会更改，所以重启或注销生效

## CMD 改 IP 配置
```
netsh interface ip set address name="以太网" source=static addr=192.168.72.72 mask=255.255.240.0 gateway=192.168.64.1
netsh interface ip set dns name="以太网" source=static addr=210.22.84.3
pause
```

## Miracast 手机投屏电脑
检查：win + r 运行 dxdiag.exe  - 保存所有信息，从保存的txt中找到 Miracast，看是否是avaliable；
处理：不是的话就查一下显卡和网卡是否支持，然后更新最新驱动，看情况关掉独显（nvidia控制面板）；
连接：设置 - 系统 - 投影到这台电脑；手机上投屏过来，电脑通知栏会显示是否允许谁投屏；

## DLAN 手机投屏电脑
开启服务 SSDP Discovery / Windows Media Player Network Sharing Service，控制面板\网络和 Internet\网络和共享中心\媒体流选项 好像还要打开一下， 然后打开 Windows Media Player -- 媒体流，允许xxx；然后手机上就能看到了；

## 虚拟机VMware通过宿主shadowsocks代理上网
虚拟机网络设置为nat，win10 设置 - 网络和internet - 代理 - 手动代理，地址为宿主ip地址，端口为ss局域网代理端口（ss设置为允许局域网）；

## 重启启动资源管理器
win r 或任务管理器-文件-新建任务，输入explorer

## 快速访问无法取消固定
删除
```
%APPDATA%\Microsoft\Windows\Recent\AutomaticDestinations
```
的 f01b4d95cf55d32a.automaticDestinations-ms 来重置快速访问

## OneNote
同步要开启Proxifier，添加exe文件到代理规则中。
选择共享此笔记本后会在onedrive\文档 文件夹下生成一个链接，然后才可以被手机端发现，如果只是把本体放到onedrive上，并不会同步。
共享的笔记本本体会存在onedrive云端，客户端没有文件，只是个链接，本体可以从网页上下载；
改完备份文件夹位置后要点确定才能生效；
错乱的分区：好像都是重复的文件，删了吧；
Ctrl+m ：多开

## OneDrive同步慢
1. hosts：134.170.108.26 onedrive.live.com 134.170.109.48 skyapi.onedrive.live.com
2. Microsoft\OneDrive\settings\Personal\Global.ini，开头加“numberOfConcurrentUploads=3”。
3. 关闭设置中与office有关的项目。

## 笔记本合盖开机方法
bios支持usb开机最好，不行就
用磁铁找到传感器位置，抠掉对应磁铁，再飞线开关板；

## 不能跳过win10密钥
执行sourse下的setup

## 自定义win10颜色
```
HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize
```
新建SpecialColor的32位DWORD值00BAB4AB，然后注销登陆去颜色设置那里找这个颜色应用；

## Win10预览版官方iso下载
在电脑设置windows更新那里加入预览版更新
然后简单设置一下，重启后再设置一下Fast，
然后就可以去https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewadvanced 下载镜像；
此处电脑是虚拟机，好像这个“获取预览版”的设置是不被同步到多个设备的。

## 触摸板乱跳
考虑交流供电漏电

## 屏蔽流氓软件自动安装
流氓软件终结者3.5  https://liwei2.com/2015/11/27/378.html

## 自定义快捷方式快捷键卡顿
关掉微软拼音的云计算功能

## Nvidia各种突然连不上报错
cmd管理员-netsh winsock reset回车重启电脑；

## 笔记本断电锁30帧
nvida exprience设置-常规-关闭分享、设置-游戏-BatteryBoost-60帧。

## 应用转换时的错误 请验证指定的转换路径是否有效
HKEY_CLASSES_ROOT\Installer\Products\ 下找到相应软件所属条目删除

## 动态壁纸:
DeskScapes/Wallpaper Engine

## 快速定位注册表
运行：
```
cmd /c reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Applets\Regedit" /v "LastKey" /d "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\Wds\rdpwd\Tds\tcp" /f&&start regedit.exe
```
或者新建 .vbs
```
Dim objHTA
Dim cClipBoard
Dim WshShell
set objHTA=createobject("htmlfile")
cClipBoard=objHTA.parentwindow.clipboarddata.getdata("text")
Set WshShell = WScript.CreateObject("WScript.Shell")
WshShell.RegWrite "HKCU\Software\Microsoft\Windows\CurrentVersion\Applets\Regedit\LastKey", cClipBoard, "REG_SZ"
WshShell.Run "regedit.exe -m"
Set objHTA = nothing
Set WshShell = nothing

'readme
'copy your address and run it
```


## 清理程序与功能里无法删除的项目
都在这里：
```
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall
HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall
```

字体fontlink:
```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Console\TrueTypeFont
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\FontLink\SystemLink
```

## 改系统语言为英文
先到语言那里添加英文并设为显示语言：控制面板\区域语言\语言\，
然后改欢迎界面：控制面板\区域语言\区域\更改位置\管理\复制设置\打钩，然后重启
1803：设置/时间和语言/区域和语言/：国家和地区/中国、添加语言/设置为默认语言
1803：设置/时间和语言/语音

## UWP应用代理
下载 Fiddlerr - WinConfig -  把想要走代理的App勾选上 -  “Save Changes”

## win10快捷键
全角半角转换：shift + space
便签：win+w

## win10改系统字体
改字体.reg  然后运行
```
Windows Registry Editor Version 5.00
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts]
"Microsoft YaHei & Microsoft YaHei UI (TrueType)"="NotoSansHans-DemiLight.otf"
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\FontSubstitutes]
"Microsoft YaHei"="NotoSansHans-DemiLight"
"Microsoft YaHei UI"="NotoSansHans-DemiLight"
```
恢复微软雅黑
```
Windows Registry Editor Version 5.00
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts]
"Microsoft YaHei & Microsoft YaHei UI (TrueType)"="msyh.ttc"
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\FontSubstitutes]
"Microsoft YaHei"=-
"Microsoft YaHei UI"=-
```

## 索引
相关的选项：文件夹属性 - 高级；文件夹选项 - 搜索；索引选项；服务-windows search；搜索工具（在搜索栏输入内容时会显示）
奇特的现象：a盘b盘文件开启索引会搜不到东西，typora保存的文件内容搜不到。

## 任务栏快捷方式位置
搜索TaskBar

## 修改默认锁屏壁纸
```
HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Personalization
```
新建字符串LockScreenImage，值为路径

## excel“无法释放剪贴板上的空间，另一个程序可能仍在使用剪贴板”
关掉迅雷

## 打不开路由设备页面
手动设置ip与子网掩码

## wifi无缝中继
主路由设置信道11；从路由设置相同信道、ssid、psw、加密方式，关闭DHCP。

## wifi不稳定、频繁掉线
cmd[netsh winsock reset] 重启、禁用ipv6、右键电源管理关闭节约电源

## 自动更新的集显驱动不能修改屏幕亮度
```
HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0001
```
，可以在注册表里面搜索featuretestcontrol，将f000修改为ffff，然后重启 就可以调节亮度了。

## win10更新下载进度条卡死
停止更新服务：任务管理器-服务-windows update右键停止，清空完更新缓存再右键开始；
windows update更新缓存文件夹是：C:\WINDOWS\SoftwareDistribution\Download；

## 连CMCC-EDU无法显示登录页
DNS设为211.137.160.5、211.136.17.107

## 无法自动连接已配对的蓝牙耳机
右键喇叭-播放设备-右键耳机-连接

## 应用商店下载卡死
DNS优选

## 开机启动软件
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp

## 开机自动登录
win+R：netplwiz，去掉勾，应用，输入微软账号密码

## 从盘自动休眠
用diskinfo，功能-高级特征-AAM/APM控制，禁用电源控制项就行了。但是每次重启之后需要再次禁用，所以推荐将diskinfo开机启动

## 输入法无法切换
cmd：ctfmon

## 右键卡顿
首先用menumgr1.2.exe删掉显卡菜单，再按后缀找到exe下的显卡有关的dll并删掉。

## 去除我的电脑六个文件夹
```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\
```
删掉那六个奇葩
```
{1CF1260C-4DD0-4ebb-811F-33C572699FDE} 音乐
{374DE290-123F-4565-9164-39C4925E467B} 下载
{3ADD1653-EB32-4cb0-BBD7-DFA0ABB5ACCA} 图片
{A0953C92-50DC-43bf-BE83-3742FED03C9C} 视频
{A8CDFF1C-4878-43be-B5FD-F8091C1C60D0} 文档
{B4BFCC3A-DB2C-424C-B029-7FE99A87C641} 桌面
```
“ThisPCPolicy”，将其数据数值由Show改为Hide，最后确定即可。
```
图片文件夹：{0ddd015d-b06c-45d5-8c4c-f59713854639}＼PropertyBag
视频文件夹：{35286a68-3c57-41a1-bbb1-0eae73d76c95}＼PropertyBag
下载文件夹：{7d83ee9b-2244-4e70-b1f5-5393042af1e4}＼PropertyBag
音乐文件夹：{a0c69a99-21c8-4671-8703-7934162fcf1d}＼PropertyBag
桌面文件夹：{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}＼PropertyBag
文档文件夹：{f42ee2d3-909f-4907-8871-4c22fc0bf756}＼PropertyBag
```

以下代码新建文档.reg运行：
```
Windows Registry Editor Version 5.00
[-HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{088e3905-0323-4b02-9826-5d99428e115f}]
[-HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{24ad3ad4-a569-4530-98e1-ab02f9417aa8}]
[-HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}]
[-HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{d3162b92-9365-467a-956b-92703aca08af}]
[-HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}]
[-HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{088e3905-0323-4b02-9826-5d99428e115f}]
[-HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{24ad3ad4-a569-4530-98e1-ab02f9417aa8}]
[-HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}]
[-HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{d3162b92-9365-467a-956b-92703aca08af}]
[-HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}]
```

## 开机弹出bing网页:
运行，输入gpedit.msc回车，之后就会弹出组策略的窗口，我们一次找到“计算机配置”-“管理模板”-“系统”-“Internet 通信管理”，然后单击选中“Internet 通信设置”，在右边的窗口中找到“关闭 Windows 网络连接状态指示器活动测试”，
然后右键“关闭 Windows 网络连接状态指示器活动测试”，选择“编辑”，在打开的窗口界面中，我们勾选“已启用”，然后确定，重启。

## 关闭win update/win defender
运行-gpedit.msc-计算机配置-管理模板-Windows组件
家庭版没组策略

在Windows搜索中输入services.msc，找到“HomeGoup Listener”与“HomeGroup Provider”两项服务，右键单击进入“属性”，停止运行后设置启动类型为“禁用”。

## 待机wifi掉线
设备管理器 网卡属性 电源 不自动断电
还有，右下角 属性去掉ipv6的勾


## Win10系统怎样让打开图片方式为照片查看器
```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Photo Viewer\Capabilities\FileAssociations
```
在FileAssociations目录下，我们对着该界面击右键，选择“新建-字符串值”菜单，
接下来就是比较关键的步骤了，如果你想要打开.jpg后缀的文件，那么数值名称要写为.jpg，数值数据写为“PhotoViewer.FileAssoc.Tiff”，如下图所示，然后点击“确定”按钮。接下来，如果你想要使用Windows照片查看器查看.png后缀的文件，那么数值名称写为.png，数值数据还是为PhotoViewer.FileAssoc.Tiff。换句话说，只要你想更改任何格式的图片文件打开方式，那么数值名称就是.格式名称，数值数据一直为PhotoViewer.FileAssoc.Tiff。到这里，我们就成功修改了图片文件的打开方式，我们可以关闭注册表编辑器，然后对着你想要打开的图片格式的文件击右键，选择“打开方式”，就可以看到打开程序列表中有“Windows照片查看器”。

## VPN连不上
卸载Geforce  experience，或新建bat文件运行后重启。

```
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Rasman\Parameters" /v ProhibitIpSec /t REG_DWORD /d 1
```

## 磁盘被是别为便携磁盘:
安装英特尔快速存储

## 查看系统版本msinfo32

## 修改user的文件夹名
激活administrator，并登陆
修改文件夹名，开元 改为 azure
```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList
```
改ProfileImagePath
断开azure与微软的连接，去微软网页修改个人信息后再连上
可以用了

## 安装未签名的驱动
【Win】+【i】， 或者用[Win]+[C]调出Charm菜单-更改电脑设置-设置-常规-高级启动的立即重启-疑难解答-高级选项-启动设置-重新启动，如果你的Win 8是主系统或者单Win 8系统 会看到这样的界面，选择7-禁用驱动程序强制签名 ，如果你的Win8不是主系统， 在选择Win8按F8会看到这样的界面，选择“ Dlsable Driver Signature Enforcement ”继续启动即可。这个菜单随着系统版本不同是有不同语言的，中文的话就是“禁用驱动程序强制签名”再安装驱动就可以看到Windows 安全对话框了

## 注册账号
密码不能包含账户名里的字段

## 密钥：
W269N-WFGWX-YVC9B-4J6C9-T83GX

## 洗白方法:
Kms激活8.1，然后卸载kms
微软升级工具下载镜像，用镜像升级10，联网激活
此时的激活方式依旧是批量，但是没有时间限制了
在格盘重装10，激活方式变成零售！！！
保证你的8.1和10类别一样
同时保证你的8.1也是msdn 母盘装的
http://www.itellyou.cn/
这个网站可以找到镜像，镜像哈希和msdn是一样的

用hue kms 10 这个软件可以激活10240 大小是 4.01g，是批量，可以自动续期
方法：先去第三栏激活kms服务器，后去第一栏点第一个windows vl

