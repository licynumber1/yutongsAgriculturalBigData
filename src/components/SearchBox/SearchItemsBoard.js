/**
 * powered by 波比小金刚 at 2018-05-23 10:12:39 
 * last modified by 波比小金刚 at 2018-05-23 10:12:39 
 * @Description: 搜索框查询结果展示面板 
*/
import React from 'react';
import { Link } from 'react-router-dom';
import PopoverSpan from '../../shared/project/PopoverSpan'

const SingleContextBoard = ({item,keyName='briefVoList'}) => {
  const {label} = item;
  const data = item[`${keyName}`]
  return (
    <div className='ht-single-context-wrapper'>
      <h1><b>{label}</b></h1>
      {
        data && data.length && data.map( (i, index) => (
            <Link to={{ pathname:`/search/${i.id}/${label}` }}
                key={`${i.id}-${index}`}
            >
                <div className="ht-single-context">
                    <img src={i.image} alt=""/>
                    <div style={{marginLeft:"8px"}}>
                       <div style={{height:"20px",lineHeight:"20px"}}>
                           <PopoverSpan overlayStyle={{zIndex:10000}} style={{color:"#333333",height:"24px",lineHeight:"24px", fontSize:"14px",display:"inline-block",maxWidth:"220px"}} data={i.title}/>
                       </div>
                       <div style={{height:"20px",lineHeight:"20px"}}>
                           <p style={{textOverflow:"ellipsis",whiteSpace: "nowrap",lineHeight:"20px",color:"#999",fontSize:"12px"}}>{i.description || " "}</p>
                       </div>
                    </div>
                </div>
            </Link>
        ))
      }
    </div>
  )
}

export const SearchItemBoard = ({data}) => {
  return (
    <div className='ht-searchitems-board-wrapper'>
      {
        data && data.length && data.map((item, index) => (
          <SingleContextBoard
            item={item}
            key={`item-${index}`}
          />
        ))
      }
    </div>
  )
}