# music Miniapp & TaroV3.2.2

## 文件目录
- src
  - common 主题色的css和js
  - components 公共组件
  - config
  - custom-tab-bar 自定义菜单栏，不写这个文件，菜单栏出不来
  - images 主菜单的图片文件，暂时没有使用，可不动
  - pages 主包文件
    - index 首页 

  - pages-mine 和用户相关
     - about 关于我们 


### 兼容原生组件
1. 手动修改引入 js 时使用相对路径
2. 手动修改引入组件时使用相对路径
3. 语法参考 [Taro 官方文档](https://nervjs.github.io/taro/)
4. AppID(小程序 ID) wxae9140d69ccf0c22
5. AppSecret(小程序密钥) 暂无


### 小程序开发步骤

1. 安装，yarn 可替换为 npm，推荐使用 yarn

```
$ yarn global add @tarojs/cli
$ yarn install
```

2. 开发

```
$ yarn start
```

3. 打包

```
$ yarn run build:weapp
```

4. 线上环境本地调试

```
$ npm run build:weapp -- --watch --env production
```

# 微信小程序基本信息

## 登录账号

- 用户名：snow_baby_princess@163.com
- 密码：
- Appid：wxae9140d69ccf0c22
- AppSecret：暂无


