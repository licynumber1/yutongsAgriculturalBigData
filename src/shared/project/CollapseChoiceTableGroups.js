import React, { Component } from 'react';
import { Popover, Collapse, Button } from 'antd';
import { connect } from 'dva/index';
import HiddenTable from './HiddenTable';
import styles from './style.less';
import PopoverTag from './PopoverTag';

const Panel = Collapse.Panel;
const defaultStyle = {
  padding: '20px',
};
const mapStateToProps = (state) => {
  const { resources } = state;
  return {
    resources,
  };
};
const columns = [
  {
    title: '信息项名称',
    dataIndex: 'name',
    key: 'name',
    width: '33%',
  },
  {
    title: '数据类型',
    dataIndex: 'type',
    key: 'type',
    width: '34%',
  },
  {
    title: '长度',
    dataIndex: 'length',
    key: 'length',
    width: '33%',
  },
];

@connect(mapStateToProps)

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      saveData: {},
      visible: false,
    };
  }

  changeCollapse(e) {

  }

  componentDidMount() {
    // console.log(this.props.identifier);//getFields
    this.props.dispatch({
      type: 'resources/getFields',
      payload: {
        identifier: this.props.identifier,
      },
    });
  }

  getArrFields = (fields) => {
    fields.map(i => ({
      name: i.name,
      dataList: i.tableData,
    }));

    const arr = [];
    for (const i in fields) {
      arr.push({
        name: i,
        dataList: fields[i],
      });
    }
    return arr;
  };

  save = () => {
    this.props.save(this.state.saveData);
    this.changeVisible(false);
  };

  changeVisible = (v) => {
    this.setState({
      visible: (v === true || v === false) ? v : !this.state.visible,
    });
  };

  rowSelection = (name, tableIndex, columnIndex) => {
    return ({
      onChange: (selectedRowKeys, selectedRows) => {
        this.state.saveData[`${name}-${tableIndex}-${columnIndex}`] = selectedRows;
        this.setState({
          saveData: this.state.saveData,
        });
      },
    });
  };

  render() {
    const { title, label, width = '600px' } = this.props;
    const { fields = [] } = this.props.resources || [];

    return (
      <Popover
        visible={this.state.visible} content={
          <div style={{ width, ...defaultStyle }}>
            <Collapse defaultActiveKey={['1']} onChange={this.changeCollapse}>
              {
              fields.map((v, i) => {
                return (
                  <Panel header={v.name} key={v+i}>
                    {
                      <div>
                        {
                          (v.tableData || []).map((val, j) => {
                            return (
                              <div key={j}>
                                <span>{val.name || ''}</span>
                                <HiddenTable
                                  rowSelection={this.rowSelection(v.name, i, j)}
                                  columns={columns} dataSource={val.table || []}
                                />
                              </div>
                            );
                          })
                        }
                      </div>
                    }
                  </Panel>
                );
              })
            }
            </Collapse>
            <div style={{ height: '30px' }} />
            {
            fields.length === 0 ?
              <div>暂无候选信息项</div>
              :
              <Button style={{ background: '#1890ff', color: '#ffffff', float: 'right' }} type="primary" htmlType="submit" onClick={this.save}>
                保存
              </Button>
          }
            <Button style={{ float: 'right' }} htmlType="submit" onClick={this.changeVisible}>
            关闭
          </Button>
            <div style={{ height: '20px' }} />

          </div>
      } placement="right" title={
        <span style={{ fontSize: '18px' }}>
          {title || 'title'}
        </span>
      } trigger="click"
      >
        <span onClick={this.changeVisible} style={{ color: '#1890ff', cursor: 'pointer' }}>{label}</span>
        <PopoverTag
          placement="bottomLeft"
          title={'自动推测'}
          content={[
            '信息项自动推测功能可以从本信息资源已关联的数据源的标注信息中，自动推测出可能的信息项候选值供用户选择。',
            '当信息项与数据源中的大量字段信息都是一一对应关系时（比如关系型数据库中某张表有上百个字段需要共享），推荐先为该信息资源添加数据源并完成字段标注，再利用自动推测功能，将数据源中已标注的字段自动导入信息项列表中，这样可以极大地简化繁琐的录入工作。',
          ]}
          trigger="click"
        />
      </Popover>
    );
  }
}
