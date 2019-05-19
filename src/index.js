import React from 'react'
import ReactDOM from 'react-dom'
import './reset.less'
import registerServiceWorker from './registerServiceWorker'
import { Routes } from './router'
//? mock 数据
if(process.env.NODE_ENV === 'development'){
  require('./mock/mockData.js');
}
ReactDOM.render(<Routes />, document.getElementById('root'))
registerServiceWorker()
