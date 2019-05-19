import React, { Component } from 'react';
import { Select } from 'antd'

export default class extends Component {//用于做轮序的高阶组件
  constructor(props){
    super(props)
  }

  render() {
    return <Select getPopupContainer={triggerNode => triggerNode.parentNode} {...this.props}>{this.props.children}</Select>
  }
}
