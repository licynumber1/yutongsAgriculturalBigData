import React, { Component } from 'react';
import { Popover } from 'antd'
const defaultStyle = { whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}

export default class extends Component {
  render() {
    const { data, popData,getPopupContainer,overlayStyle={} } = this.props
    return (
      <span>
         {
             <Popover content={popData ? popData : data} overlayStyle={Object.assign({},{maxWidth:"400px"},overlayStyle)} getPopupContainer={getPopupContainer}>
              <span style={
                Object.assign({},defaultStyle,this.props.style)
              }>
                {data} </span>
             </Popover>
         }
      </span>
    )
  }
}
