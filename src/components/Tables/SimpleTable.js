/**
 * powered by 波比小金刚 at 2018-05-25 11:02:19 
 * last modified by 波比小金刚 at 2018-05-25 11:02:19 
 * @Description: 简单的table组件 
*/

import React from 'react';
import './index.less';

const getSubTableItem = (headers, item) => {
  if(!headers || !headers.length) return null;
  return headers.map((i, index) => {
    return (
      <li key={ `${item[i.label]}` } style={{width: i.width}}>{ item[i.label] }</li>
    )
  });
}

/**
 * !简单组件参数说明（横向）
 * TODO 增加样式的自定义参数配置：比如 headerClassName, contentClassName
 * @param {headers} [{label: '', title: '', width: ''}] 
 * @param {data} [{number?: xx, title?: xx, ...}]
 * @how to use:
*      <Table.SimpleTable 
        headers={mockData.headers}
        data={mockData.data}
      />
 */
export const SimpleTable = ({headers, data}) => {

  return (
    <div className='ht-simple-table-wrapper'>
      <ul className='ht-simple-table-head'>
        {
          headers && headers.length && headers.map(item => (
            <li key={ item.label } style={{width: item.width}}>{ item.title }</li>
          ))
        }
      </ul>
      <div className='ht-simple-table-body'>
        {
          data && data.length && data.map((item, index) => (
            <ul className='ht-simple-table-items' key={`table-${index}`}>
              {
                getSubTableItem(headers, item)
              }
            </ul>
          ))
        }
      </div>
    </div>
  )
}
//! 数据结构demo
// const mockData = {
//   headers: [
//     {
//       label: 'number',
//       title: '序号',
//       width: '20%'
//     },
//     {
//       label: 'title',
//       title: '标题',
//       width: '20%'
//     },
//     {
//       label: 'type',
//       title: '类型',
//       width: '30%'
//     },
//     {
//       label: 'uv',
//       title: '阅读量',
//       width: '30%'
//     }
//   ],
//   data: [
//     {
//       number: 1,
//       title: '这是一个标题',
//       type: '图文',
//       uv: 200
//     },
//     {
//       number: 2,
//       title: '这是一个标题',
//       type: '图文',
//       uv: 200
//     },
//     {
//       number: 3,
//       title: '这是一个标题',
//       type: '图文',
//       uv: 200
//     },
//     {
//       number: 4,
//       title: '这是一个标题',
//       type: '图文',
//       uv: 200
//     }
//   ]
// }
