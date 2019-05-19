/**
 * powered by 波比小金刚 at 2018-05-25 13:59:25 
 * last modified by 波比小金刚 at 2018-05-25 13:59:25 
 * @Description: 纵向数据 table 组件 
*/
import React from 'react';
import './index.less';
import {entries} from '../../utils/utils';

// ? 封装 headers
const getHeaders = (data, widths) => {
  if(!data || !data.length) return null;
  const arr = data.map((item, index) => {
    return (<li 
              key={ item.label } 
              style={{width: widths && (widths.length === data.length + 1) ? widths[index+1] : `${(100 / (data.length+1))}%`}}
            >
              { item.label }
            </li>)
  });
  arr.unshift(<li key='date' style={{width: widths ? widths[0] : `${(100 / (data.length+1))}%`}}>日期</li>);
  return arr;
}

// ? 封装body
const getContent = (data, widths) => {
  if(!data || !data.length) return null;

  //* 处理日期
  const dates = Object.keys(data[0]['datas']);

  //
  const arr = data.map((item, index) => {
    return (
      <ul 
        key={item.label}
        style={{width: widths && (widths.length === data.length + 1) ? widths[index+1] : `${(100 / (data.length+1))}%`}}
      >
        {
          getVerticalList(item.datas, item.total)
        }
      </ul>
    )
  });
  arr.unshift(<ul key='date-value' style={{width: widths ? widths[0] : `${(100 / (data.length+1))}%`}}>{getVerticalList(dates)}</ul>);
  return arr;
}

// * 生成竖向列表
const getVerticalList = (data, total=0) => {
  if(Array.isArray(data) && data.length){
    const arr = data.map((item, index) => (
      <li key={`${item}-${index}`}>{ item }</li>
    ));
    arr.push(<li key='total'>合计</li>);
    return arr;
  }else if(data){
    let arr = []
    for(let [key, value] of entries(data)){
      arr.push(<li key={`${key}-${value}`}>{ value }</li>)
    };
    arr.push(<li key={`total-${total}`}>{ total }</li>)
    return arr;
  }
}

/**
 * TODO 同样是样式可以灵活的自定义设置
 * @param { data } ： [{label: '', datas: [], total: ''}]
 * @param { widths }: ['25%', '20%', ...]
 * @param { pagenation }
 */
export const VerticalTable = ({data, widths}) => {
  return (
    <div className='ht-simple-table-wrapper'>
      {
        data && data.length ? 
        <div style={{height: '100%'}}>
          <ul className='ht-simple-table-head'>
            {
              getHeaders(data, widths)
            }
          </ul>
          <div className='ht-vertical-table-body'>
            {
              getContent(data, widths)
            }
          </div>
        </div> : null
      }
    </div>
  )
}

//? 模拟数据
// const data =  [
//   {
//     "label": "语音",
//     "datas": {
//       "2018-05-18": 0,
//       "2018-05-19": 0,
//       "2018-05-20": 0
//     },
//     "total": 0
//   },
//   {
//     "label": "视频",
//     "datas": {
//       "2018-05-18": 0,
//       "2018-05-19": 0,
//       "2018-05-20": 0
//     },
//     "total": 0
//   },
//   {
//     "label": "图文",
//     "datas": {
//       "2018-05-18": 0,
//       "2018-05-19": 0,
//       "2018-05-20": 0
//     },
//     "total": 0
//   }
// ]