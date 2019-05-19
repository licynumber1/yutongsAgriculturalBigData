import React, { Component } from 'react';
import { Popover, Select, Table } from 'antd';
import CardList from './CardList';

const Option = Select.Option;
const defaultStyle = {
  padding: '20px',
};


export default class extends Component {

  constructor(props) {
    super(props);
  }

  getFixData = (data) => {
    const fixData = [{ value: '信息项名称', style: { width: '33%' } },
                      { value: '信息项类型', style: { width: '34%' } }, { value: '长度', style: { width: '33%' } }];
    const getFixItem = (i) => {
      const items = ['type', 'name', 'length'];
      items.forEach((v) => {
        if (i[v] === undefined) {
          i[v] = '';
        }
      });
      return i;
    };
    data.forEach((i) => {
      const fixItem = getFixItem(i);
      for (const item in fixItem) {
        fixData.push({ value: i[item], style: { width: item === 'type' ? '34%' : '33%' } });
      }
    });
    return fixData;
  }

  render() {
    const { label, title, width = '600px', ...cardConfig } = this.props;
    const data = this.getFixData(cardConfig.data);

    return (
      <Popover
        content={
          <div style={{ width, ...defaultStyle }}>
            {
            this.props.children ?
              this.props.children :
              <CardList dataList={data} />
          }
          </div>
      } placement="right" title={
        <span style={{ fontSize: '18px' }}>
          {title || 'title'}
        </span>
      } trigger="hover"
      >
        <span style={{ color: '#1890ff', cursor: 'pointer' }}>{label}</span>
      </Popover>
    );
  }
}
