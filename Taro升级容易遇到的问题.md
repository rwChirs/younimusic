## 1、本项目地址： https://git.jd.com/7fresh-fe/miniapp
## 2、启动本项目之前需要更新本地taro版本，需要执行命令：npm install -g @tarojs/cli
## 3、如果遇到问题“Permission denied”
解决方法：权限不足，如果要使用，通过如下命令进行授权即可：sudo chmod -R 777 要操作的目录地址
## 4、在新版本中，属于框架本身的API，从框架自己的包中引入，其它的API仍然从@tarojs/taro引入。
import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import Taro from '@tarojs/taro'
// useEffect 是来自于 React 的 API
import React, { useEffect } from 'react'

## 5、新文件*.config.js，* 代表你页面/项目文件的文件名，config 文件必须和页面/项目文件在同一文件夹。
在这个文件里你可以使用任意合法的 JavaScript 语法，只要最终把配置作为对象通过 export default 出去即可
export default {
	navigationBarTitleText: ’’,
	navigationBarTextStyle: 'white’,
	navigationStyle: 'custom', //微信客户端低版本<7.0.0不支持
}

## 6、使用第三方React库。
如果你需要引入 React 相关生态的库，直接通过 npm install 安装然后引入使用即可，Taro 不会再维护类似于 taro-redux 、
taro-mobx 之类的库。
// 当使用了 JSX 时，babel 会隐式地调用 React.createElement
// 因此只要你使用了 JSX，就要把 React或者Nerv引入
import React from 'react'
import { useSelector } from 'react-redux'

## 7、路由
在旧版本中可以通过 this.$router 访问当前组件/页面路由的详情。在 Taro Next 对应的 API 是在 @tarojs/taro 中的
 getCurrentInstance().router，两者的属性一模一样。

import Taro，{ getCurrentInstance } from '@tarojs/taro’
componentWillMount () {
// getCurrentInstance().router 和 this.$router 和属性一样
	console.log(getCurrentInstance().router)
}
 ## 8、路由信息我们推荐在 componentDidShow 生命周期的参数中直接读取
// app.js 项目入口文件
class App extends Component {
	componentDidShow (options /* 这里有你想要的路由信息 */) {
	}
	render () {
	...
	}
}
getCurrentInstance().router 其实是访问小程序当前页面 onLoad 生命周期参数的快捷方式。

## 9、样式
在 Taro Next 中，没有 组件的外部样式和全局样式 的概念，组件的配置（config.js）是无效的，页面和入口文件引入的 CSS 都会变成
全局 CSS ，没有了 externalClasses 和 addGlobalClass 这两个概念。
如果你需要带作用域的 CSS，可以考虑使用 CSS Modules。https://github.com/css-modules/css-modules

## 10、编译配置
需要添加 framework 配置，取值为使用的框架（react, nerv, vue, vue3）
jsxAttributeNameReplace 配置已被移除。

## 11、编译依赖库
Webpack 升级到 Webpack@4，Babel 升级到 babel@7。Webpack 升级是在 taro@2 中完成的，如果你是从 taro@1 升级上
来的话，或许需要去看看 Taro 2 更改 查看使用 Webpack 编译后带来的变化。
升级到 babel@7 意味着你的项目文件全部都会通过根目录的 babel.config.js 的配置进行编译。

## 12、Eslint 和 最佳实践
eslint-plugin-taro 已被废弃，你不再需要遵循它所规定的种种限制。你可以发挥你的创造力使用任何合法的 JSX 语法。
升级后支持<> </>这种写法
旧版本文档所提到的最佳实践也不必再遵循。也就是说，即便你不给组件设置 defaultProps，
自定义事件名不以 on 开头（还有其它的旧版本代码风格最佳实践），你的代码也能运行。
但值得注意的是，遵循这样的 代码风格最佳实践 可以让你的代码更健壮，你的应用也会因此而收益

## 13、Ref & Dom
Taro Next 在底层会维护一个精简的 DOM 系统，在框架中使用 ref 链接到的是一个 Taro Element 实例，因此你直接可以使用 
HTMLElement 的部分方法直接操作它。如果你需要获取原生小程序 DOM 实例，那需要使用原生小程序的 SelectorQuery 来获取。

大部分和渲染相关的 DOM 属性你都可以通过像 Web 开发一样获取或设置（如果有必要的话你甚至可以通过 parentNode 和
 childNodes 访问元素的父元素和子元素！），但元素的位置你还是必须通过原生小程序 DOM 实例的 boundingClientRect() 
和 scrollOffset() 方法获取。

另外，如果你使用的是 React，就将无法使用字符串的形式来使用 ref。(Nerv 不受此影响)

## 14、生命周期
新增一个生命周期: componentDidCatch(err, info) ，这是由框架本身（React 或 Nerv）提供的。componentDidCatch(err, info)
 会在组件和它的子孙抛出错误时触发，第一个参数 err 指向抛出的错误，第二个参数 info 是组件的调用信息。
componentDidCatch 和原有的 componentDidCatchError 共同存在，区别在于 componentDidCatchError 只能在入口组件
（App）中使用，对应原生小程序的生命周期 onError()，componentDidCatch 可以在任何 React/Nerv 类组件中使用（包括入口组件）

## 15、Hooks
在 Taro Next，Taro 的专有 Hooks（例如 usePageScroll, useReachBottom）从 @tarojs/taro 中引入，框架自己的 Hooks 
（例如 useEffect, useState）从对应的框架引入。
另外，旧版本的 Taro 可以在 Class Component 中使用 Hooks，但 React 是不允许这样的行为的。

## 16、$scope和$componentType
由于 Taro Next 没有自定义组件，所以也没有了 this.$scope 和 this.$componentType 的概念。getCurrentInstance().page 
可以返回当前小程序页面的实例。

## 17、全局变量的引用
Taro.getApp() 改成 Taro.getApp().$app

## 18、插件的写法
 config = {
      usingComponents: {
        index: 'plugin://loginPlugin/index',
        instruction: 'plugin://loginPlugin/instruction',
      },
  };
  改成
  export default {
    navigationBarTitleText: '登录',
    navigationBarTextStyle: 'black',
    usingComponents: {
      'freshman-gift': '../../../components/freshman-gift/index',
    },
  }

## 19、css父级页面和组件的css同名，会被组件css覆盖
components组件里的css名称会覆盖页面css

## 20、taro3 会把组件合并到一个文件中，就会报css引入顺序问题

解决方法：
config/index.js
mini: {
  enableExtract:true,
  miniCssExtractPluginOption: {
  //忽略css文件引入顺序
  ignoreOrder: true
  },
}

本项目已配置

## 21、引入文件
import { logUrlAddSeries } from '@/utils/common/logReport';
改成
import { logUrlAddSeries } from '../../utils/common/logReport';

目前不支持@写法

## 22、需要调用的页面必须在app.config.js里配置访问路径，否则不编译生成小程序文件
例如：7club/home

## 23、不在引入new-ui

## 24、不要使用async await，微信低版本会出现白屏

## 25、页面滑动到第一屏下面的时候，点击弹框，整个页面会自动上滑到第一屏，这个时候需要查看遮罩层的渲染问题
解决方法一：把判断遮罩层写到弹框组件内
有其他解决方法大家可以记录下来。

## 26、点击跳转h5提示https://undefined
解决方法：const url = `${Taro.getApp().h5RequestHost}/链接`改为
const url = `${Taro.getApp().$app.h5RequestHost}/链接`或者
const app = Taro.getApp().$app
const url = `${app.h5RequestHost}/链接`

废弃的文件
1、paySuccess 已废弃
2、import-component 已废弃
3、cabinet 已废弃
