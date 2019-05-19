import GetContentDataWrapper from './getContentDataWrapper'
import React, { Component } from 'react';

export class ContentData extends Component {
  render(){
      const {data,searchData,pageType,id} = this.props
      return (
          <div className='content-data'>
              {
                  (data || []).map((v,i)=>(<GetContentDataWrapper key={i} chartsId={v} searchData={searchData} pageType={pageType} id={id}/>))
              }
          </div>
      )
  }
}