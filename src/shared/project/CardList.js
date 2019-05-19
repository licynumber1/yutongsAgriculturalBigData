import React, {Component} from 'react';
import {Card, Popover, Select, Table} from 'antd';

const Option = Select.Option;

const hidden = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

export default class extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {gridStyle, dataList} = this.props
    return (
      <Card style={gridStyle}>
        {
          dataList.map((v, i) => {
            return (<Card.Grid key={i} style={v.style}>
              <Popover overlayStyle={{maxWidth:"400px"}} content={v.value || v.initValue || "无"} trigger="hover">
                <div style={hidden}>{v.value || v.initValue || "无"}</div>
              </Popover>
            </Card.Grid>)
          })
        }
      </Card>
    )
  }
}
