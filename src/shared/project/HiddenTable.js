import React, { Component } from 'react';
import { Table, Popover } from 'antd';

const defaultOverflow = {
  display:"inline-block",
  textAlign:'center',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: '100%',
};

export default class extends Component {

  getColumns = (columns, line) => {
    columns.forEach((i) => {
      if(!i.render){
          i.render = (v, r) => {
              return (
                    <span style={defaultOverflow}>
                          {v}
                    </span>
              )
          }
      }
    });
    return columns;
  };

    getEllipsisColumns = (columns, line) => {
        const popRender = (value, rowValue, column) => {
            if (column.popoverFix) {
                return column.popoverFix(value, rowValue);
            } else {
                return value;
            }
        };
        columns.map((i) => {
            !i.render ? i.render = (v, r) => {
                return (
                    <Popover overlayStyle={{maxWidth:"400px"}} placement="top" content={popRender(v, r, i)}>
                        <div style={{
                            overflow: 'hidden',
                            OTextOverflow: 'ellipsis',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: line,
                            webkitBoxOrient: 'vertical',
                        }}>{v}</div>
                    </Popover>)
            } : i;
        });
        return columns;
    };

  render() {
    const { columns, dataSource, line = 1, ellipsis, ...others } = this.props;
    const fixColumns = ellipsis ? this.getEllipsisColumns(columns, line) : this.getColumns(columns, line);
    dataSource.forEach((v, i) => {
      v.key = i;
    });
    return (
      <Table column={{align:'center'}} columns={fixColumns} dataSource={dataSource} {...others} />
    );
  }
}
