/*
* @Author: huangteng
* @Date:   2018-05-05 15:03:13
 * @Last Modified by: 波比小金刚
 * @Last Modified time: 2018-05-21 17:51:31
* @Description: 自定义配置文件，用来支持装饰器语法、less、antd组件按需加载
*/
const rewireMobX = require('react-app-rewire-mobx');
const rewireLess = require('react-app-rewire-less');
const {injectBabelPlugin} = require('react-app-rewired');
const overrideDefaultThemeConfig = require('./theme.js');

module.exports = function override(config, env){

  // antd 按需加载解决方案
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);

  // less 并且利用了 less-loader 的 modifyVars 来进行主题复写
  config = rewireLess.withLoaderOptions({
    modifyVars: overrideDefaultThemeConfig,
  })(config, env);
  
  // mobx 装饰器支持
  config = rewireMobX(config, env);

  return config;
}
