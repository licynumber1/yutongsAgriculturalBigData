import React, { Component } from 'react';
import { Rate, Popover } from 'antd'

export default class extends Component {
  constructor(props){
    super(props)
  }

  render() {
    const num = (~~(parseFloat(this.props.defaultValue)*10))/2
    //仅用于展示，value值受控
    return (
      <Popover overlayStyle={{maxWidth:"400px"}} content={`血缘关系完成度 ${~~(parseFloat(this.props.defaultValue)*100)}%`}>
        <span>
          <Rate style={{whiteSpace: "nowrap",fontSize:"10px"}}
                disabled allowHalf
                defaultValue={num} />
        </span>
      </Popover>
    )
  }
}
